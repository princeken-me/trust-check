import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { initDatabase, getDb } from './db/db.js';
import { TrustScoreService } from './services/TrustScoreService.js';
import { RiskSignalService } from './services/RiskSignalService.js';
import { TrustSignalService } from './services/TrustSignalService.js';
import { EvidenceService } from './services/EvidenceService.js';
import { EntityMatchingService } from './services/EntityMatchingService.js';
import { ReportModerationService } from './services/ReportModerationService.js';
import { VerificationService } from './services/VerificationService.js';
import { TrustIntelligenceEngine } from './services/TrustIntelligenceEngine.js';
import { TrustAnalysisService } from './services/TrustAnalysisService.js';
import { DuplicateDetectionService } from './services/DuplicateDetectionService.js';
import { ResearchQueueService } from './services/ResearchQueueService.js';
import { Entity, CheckRequest, UserReport, ReviewExperience, VerificationRequest, AdminActivityLog } from '../src/types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

async function startServer() {
  await initDatabase();

  const app = express();
  app.use(express.json());

  // Services
  const trustScoreService = new TrustScoreService();
  const riskSignalService = new RiskSignalService();
  const trustSignalService = new TrustSignalService();
  const evidenceService = new EvidenceService();
  const entityMatchingService = new EntityMatchingService();
  const reportModerationService = new ReportModerationService();
  const verificationService = new VerificationService();
  const intelligenceEngine = new TrustIntelligenceEngine();
  const trustAnalysisService = new TrustAnalysisService();
  const duplicateDetector = new DuplicateDetectionService();
  const researchQueueService = new ResearchQueueService();

  // --------------------------------------------------------------------------
  // REST API ENDPOINTS
  // --------------------------------------------------------------------------

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', brand: 'TrustCheck', timestamp: new Date().toISOString() });
  });

  // Search & Check Endpoint ("Before you trust it, check it.")
  app.post('/api/check', async (req, res) => {
    try {
      const { query, input_type = 'url', user_id } = req.body;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Query string is required' });
      }

      const db = getDb();
      await db.read();

      // 1. Entity Matching
      const matchResult = entityMatchingService.matchEntity(query, db.data.entities);
      let entity = matchResult.matched;

      // 2. Automated Silent Intelligence Engine Analysis
      const analysis = await intelligenceEngine.analyzeSubmission(query, input_type, entity || undefined);

      if (!entity) {
        // Create new candidate entity
        const entityId = `ent-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const slug = query.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `entity-${Date.now()}`;
        
        entity = {
          id: entityId,
          entity_type: matchResult.candidateType,
          name: analysis.name || query,
          slug,
          description: analysis.description || `Entity analyzed for query ${query}.`,
          website: input_type === 'url' ? (query.startsWith('http') ? query : `https://${query}`) : undefined,
          status: 'active',
          verification_status: 'unverified',
          trust_status: 'unverified',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        if (input_type === 'url') {
          const domain = query.replace(/^https?:\/\//, '').split('/')[0];
          entity.website_data = {
            id: `web-${entityId}`,
            entity_id: entityId,
            domain,
            full_url: query.startsWith('http') ? query : `https://${query}`,
            domain_age_days: analysis.domainAgeDays || 120,
            https_status: analysis.hasHttps !== false,
            first_discovered_date: new Date().toISOString(),
            last_checked_date: new Date().toISOString()
          };
          db.data.websites.push(entity.website_data);
        }

        db.data.entities.push(entity);
      }

      // 3. Generate Signals & Evidence
      const riskSignals = riskSignalService.evaluateRiskSignals(entity);
      // Merge suggested signals from intelligence engine
      analysis.suggestedRiskSignals.forEach((sig, idx) => {
        if (!riskSignals.some(s => s.signal_name === sig.signal_name)) {
          riskSignals.push({
            id: `rs-ai-${entity!.id}-${idx}`,
            entity_id: entity!.id,
            ...sig,
            severity: (sig.severity as any) || 'medium'
          });
        }
      });

      const trustSignals = trustSignalService.evaluateTrustSignals(entity);
      analysis.suggestedTrustSignals.forEach((sig, idx) => {
        if (!trustSignals.some(s => s.signal_name === sig.signal_name)) {
          trustSignals.push({
            id: `ts-ai-${entity!.id}-${idx}`,
            entity_id: entity!.id,
            ...sig,
            significance: (sig.significance as any) || 'standard'
          });
        }
      });

      // Update in database
      db.data.risk_signals = db.data.risk_signals.filter(s => s.entity_id !== entity!.id).concat(riskSignals);
      db.data.trust_signals = db.data.trust_signals.filter(s => s.entity_id !== entity!.id).concat(trustSignals);

      const evidenceItems = evidenceService.generateStandardEvidenceSet(entity.id, entity.website_data?.domain, entity.country);
      db.data.evidence = db.data.evidence.filter(e => e.entity_id !== entity!.id).concat(evidenceItems);

      // 4. Calculate Trust Score
      const trustScore = trustScoreService.calculateScore(entity, riskSignals, trustSignals);

      // Update trust score in db
      const existingScoreIdx = db.data.trust_scores.findIndex(s => s.entity_id === entity!.id);
      if (existingScoreIdx >= 0) {
        const oldScore = db.data.trust_scores[existingScoreIdx];
        db.data.trust_score_history.push({
          id: `tsh-${Date.now()}`,
          entity_id: entity.id,
          previous_score: oldScore.score,
          new_score: trustScore.score,
          risk_level: trustScore.risk_level,
          change_reason: 'Automated re-assessment and evidence sync.',
          changed_at: new Date().toISOString()
        });
        db.data.trust_scores[existingScoreIdx] = trustScore;
      } else {
        db.data.trust_scores.push(trustScore);
      }

      // Record check request log
      const checkReq: CheckRequest = {
        id: `chk-${Date.now()}`,
        user_id: user_id || 'guest',
        input_type: input_type as any,
        submitted_url: input_type === 'url' ? query : undefined,
        submitted_text: input_type === 'text' ? query : undefined,
        entity_matched_id: entity.id,
        date_submitted: new Date().toISOString(),
        status: 'completed'
      };
      db.data.check_requests.push(checkReq);

      await db.write();

      // Return complete entity profile
      return res.json({
        entity,
        score: trustScore,
        risk_signals: riskSignals,
        trust_signals: trustSignals,
        evidence: db.data.evidence.filter(e => e.entity_id === entity!.id),
        website_data: db.data.websites.find(w => w.entity_id === entity!.id) || entity.website_data,
        business_data: db.data.businesses.find(b => b.entity_id === entity!.id) || entity.business_data
      });
    } catch (error: any) {
      console.error('Check route error:', error);
      res.status(500).json({ error: 'Failed to process check request', details: error.message });
    }
  });

  // GET All Entities / Search Catalog
  app.get('/api/entities', async (req, res) => {
    const db = getDb();
    await db.read();

    const { type, status, q } = req.query;
    let list = [...db.data.entities];

    if (type) list = list.filter(e => e.entity_type === type);
    if (status) list = list.filter(e => e.status === status);
    if (q && typeof q === 'string') {
      const searchTerm = q.toLowerCase();
      list = list.filter(e => e.name.toLowerCase().includes(searchTerm) || e.description.toLowerCase().includes(searchTerm) || (e.website && e.website.toLowerCase().includes(searchTerm)));
    }

    // Attach scores to entities
    const enriched = list.map(e => ({
      ...e,
      current_score: db.data.trust_scores.find(s => s.entity_id === e.id),
      website_data: db.data.websites.find(w => w.entity_id === e.id),
      business_data: db.data.businesses.find(b => b.entity_id === e.id)
    }));

    res.json(enriched);
  });

  // GET Single Entity Full Profile
  app.get('/api/entities/:id', async (req, res) => {
    const db = getDb();
    await db.read();

    const entity = db.data.entities.find(e => e.id === req.params.id || e.slug === req.params.id);
    if (!entity) return res.status(404).json({ error: 'Entity not found' });

    const score = db.data.trust_scores.find(s => s.entity_id === entity.id);
    const risk_signals = db.data.risk_signals.filter(s => s.entity_id === entity.id);
    const trust_signals = db.data.trust_signals.filter(s => s.entity_id === entity.id);
    const evidence = db.data.evidence.filter(e => e.entity_id === entity.id);
    const website_data = db.data.websites.find(w => w.entity_id === entity.id);
    const business_data = db.data.businesses.find(b => b.entity_id === entity.id);
    const score_history = db.data.trust_score_history.filter(h => h.entity_id === entity.id);
    const reports = db.data.user_reports.filter(r => r.entity_id === entity.id && r.status === 'actioned');
    const reviews = db.data.reviews_and_experiences.filter(r => r.entity_id === entity.id && r.moderation_status === 'approved');

    res.json({
      entity,
      score,
      risk_signals,
      trust_signals,
      evidence,
      website_data,
      business_data,
      score_history,
      reports_count: reports.length,
      reviews
    });
  });

  // Submit User Report
  app.post('/api/reports', async (req, res) => {
    try {
      const db = getDb();
      await db.read();
      const { entity_id, report_type, description, evidence_summary, user_name, user_email } = req.body;

      const report: UserReport = {
        id: `rep-${Date.now()}`,
        entity_id,
        report_type,
        description,
        evidence_summary,
        user_name: user_name || 'Anonymous User',
        user_email: user_email || 'anonymous@trustcheck.org',
        status: 'pending',
        created_at: new Date().toISOString()
      };

      db.data.user_reports.push(report);
      await db.write();

      res.status(201).json({ message: 'Report submitted for moderation', report });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET Reports (Moderation Desk)
  app.get('/api/admin/reports', async (req, res) => {
    const db = getDb();
    await db.read();
    res.json(db.data.user_reports);
  });

  // Moderate Report
  app.post('/api/admin/reports/:id/moderate', async (req, res) => {
    const db = getDb();
    await db.read();

    const reportIdx = db.data.user_reports.findIndex(r => r.id === req.params.id);
    if (reportIdx < 0) return res.status(404).json({ error: 'Report not found' });

    const { action, moderator_id = 'usr-moderator-1', notes } = req.body;
    const { updatedReport, logEntry } = reportModerationService.moderateReport(
      db.data.user_reports[reportIdx],
      action,
      moderator_id,
      notes || 'Moderation action applied'
    );

    db.data.user_reports[reportIdx] = updatedReport;
    db.data.admin_activity_logs.push(logEntry);
    await db.write();

    res.json({ message: 'Report updated', report: updatedReport });
  });

  // Submit Business Verification Request
  app.post('/api/verifications/request', async (req, res) => {
    const db = getDb();
    await db.read();
    const { entity_id, organization_name, documentation_summary, user_id } = req.body;

    const vReq: VerificationRequest = {
      id: `vr-${Date.now()}`,
      entity_id,
      user_id: user_id || 'usr-biz-1',
      organization_name,
      documentation_summary,
      documentation_files: ['/docs/corporate-incorporation.pdf'],
      status: 'pending',
      submitted_at: new Date().toISOString()
    };

    db.data.verification_requests.push(vReq);
    await db.write();
    res.status(201).json({ message: 'Verification application submitted', verification_request: vReq });
  });

  // GET Verifications (Admin Queue)
  app.get('/api/admin/verifications', async (req, res) => {
    const db = getDb();
    await db.read();
    res.json(db.data.verification_requests);
  });

  // Review Verification Request
  app.post('/api/admin/verifications/:id/review', async (req, res) => {
    const db = getDb();
    await db.read();

    const vReqIdx = db.data.verification_requests.findIndex(v => v.id === req.params.id);
    if (vReqIdx < 0) return res.status(404).json({ error: 'Verification request not found' });

    const { approved, reviewer_id = 'usr-analyst-1', notes } = req.body;
    const { updatedRequest, verifiedRecord, updatedEntityStatus, logEntry } = verificationService.processVerification(
      db.data.verification_requests[vReqIdx],
      reviewer_id,
      approved,
      notes || 'Compliance verification completed'
    );

    db.data.verification_requests[vReqIdx] = updatedRequest;
    if (verifiedRecord) db.data.verified_entities.push(verifiedRecord);

    const entityIdx = db.data.entities.findIndex(e => e.id === updatedRequest.entity_id);
    if (entityIdx >= 0) {
      db.data.entities[entityIdx].verification_status = updatedEntityStatus;
    }

    db.data.admin_activity_logs.push(logEntry);
    await db.write();

    res.json({ message: 'Verification request completed', request: updatedRequest });
  });

  // Watchlist & Alerts
  app.get('/api/watchlist', async (req, res) => {
    const db = getDb();
    await db.read();
    const user_id = (req.query.user_id as string) || 'usr-regular-1';
    const items = db.data.watchlists.filter(w => w.user_id === user_id);
    const enriched = items.map(w => ({
      ...w,
      entity: db.data.entities.find(e => e.id === w.entity_id)
    }));
    res.json(enriched);
  });

  app.post('/api/watchlist/toggle', async (req, res) => {
    const db = getDb();
    await db.read();
    const { entity_id, user_id = 'usr-regular-1' } = req.body;

    const idx = db.data.watchlists.findIndex(w => w.entity_id === entity_id && w.user_id === user_id);
    if (idx >= 0) {
      db.data.watchlists.splice(idx, 1);
      await db.write();
      return res.json({ watched: false, message: 'Removed from watchlist' });
    } else {
      db.data.watchlists.push({
        id: `wl-${Date.now()}`,
        user_id,
        entity_id,
        alert_preferences: { score_change: true, new_reports: true, new_risk_signals: true, verification_change: true },
        created_at: new Date().toISOString()
      });
      await db.write();
      return res.json({ watched: true, message: 'Added to watchlist' });
    }
  });

  // Admin Activity Logs & Data Sources
  app.get('/api/admin/logs', async (req, res) => {
    const db = getDb();
    await db.read();
    res.json(db.data.admin_activity_logs);
  });

  app.get('/api/admin/sources', async (req, res) => {
    const db = getDb();
    await db.read();
    res.json(db.data.data_sources);
  });

  // Trust Intelligence Engine: Research Queue Endpoint
  app.get('/api/admin/research-queue', async (req, res) => {
    const db = getDb();
    await db.read();
    const tasks = researchQueueService.getQueue();
    const logs = researchQueueService.getLogs();
    res.json({ tasks, logs });
  });

  app.post('/api/admin/research-queue/dispatch', async (req, res) => {
    const db = getDb();
    await db.read();
    const { entity_id, entity_name, research_type, sources } = req.body;
    const task = researchQueueService.dispatchJob(
      entity_id || 'ent-manual-1',
      entity_name || 'Manual Submitted Target',
      research_type || 'Website review',
      sources || ['WHOIS', 'OpenCorporates']
    );
    res.status(201).json({ message: 'Research job queued', task });
  });

  app.post('/api/admin/research-queue/process/:id', async (req, res) => {
    const task = await researchQueueService.processJob(req.params.id);
    if (!task) return res.status(404).json({ error: 'Job not found in queue' });
    res.json({ message: 'Research job processed', task });
  });

  // Trust Intelligence Engine: Duplicate Detection Endpoint
  app.get('/api/admin/duplicates', async (req, res) => {
    const db = getDb();
    await db.read();
    const matches = duplicateDetector.detectDuplicates(db.data.entities, db.data.user_reports);
    res.json({ total_matches: matches.length, matches });
  });

  // Trust Intelligence Engine: Scheduler Execution Endpoint
  app.post('/api/admin/scheduled-tasks/run', async (req, res) => {
    const db = getDb();
    await db.read();
    const result = researchQueueService.runScheduledTasks(db.data.entities.length);
    res.json({ message: 'Scheduler triggered', result });
  });

  // SEO: robots.txt and sitemap.xml endpoints
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *
Allow: /
Allow: /check/
Allow: /entity/
Allow: /directory
Allow: /how-it-works
Allow: /about
Allow: /contact
Disallow: /admin
Disallow: /api/
Sitemap: ${process.env.APP_URL || 'https://trustcheck.org'}/sitemap.xml`);
  });

  app.get('/sitemap.xml', async (req, res) => {
    const db = getDb();
    await db.read();
    const baseUrl = process.env.APP_URL || 'https://trustcheck.org';
    const now = new Date().toISOString().split('T')[0];

    const entityUrls = (db.data.entities || []).map((e: any) => `
  <url>
    <loc>${baseUrl}/entity/${e.slug || e.id}</loc>
    <lastmod>${e.updated_at ? e.updated_at.split('T')[0] : now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/directory</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/how-it-works</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>${entityUrls}
</urlset>`;

    res.type('application/xml');
    res.send(xml);
  });

  // User Accounts & Roles
  app.get('/api/users', async (req, res) => {
    const db = getDb();
    await db.read();
    res.json(db.data.users);
  });

  // Architecture Spec Endpoint (Detailed documentation payload)
  app.get('/api/architecture', (req, res) => {
    res.json({
      brand: 'TrustCheck',
      slogan: 'Before you trust it, check it.',
      supporting: 'Check before you click. Check before you pay. Check before you trust.',
      framework: 'Laravel 11 / Node Express ESM Hybrid',
      tables_count: 22,
      tables: [
        'users', 'entities', 'websites', 'businesses', 'social_profiles', 'job_offers',
        'rental_listings', 'investment_opportunities', 'check_requests', 'risk_signals',
        'trust_signals', 'evidence', 'user_reports', 'trust_scores', 'trust_score_history',
        'verification_requests', 'verified_entities', 'reviews_and_experiences', 'watchlists',
        'alerts', 'admin_activity_logs', 'data_sources'
      ],
      services: [
        'TrustScoreService', 'RiskSignalService', 'TrustSignalService', 'EvidenceService',
        'EntityMatchingService', 'ReportModerationService', 'VerificationService'
      ],
      roles: ['Super Admin', 'Admin', 'Analyst', 'Moderator', 'Verified Business', 'Regular User']
    });
  });

  // --------------------------------------------------------------------------
  // VITE MIDDLEWARE OR STATIC SERVING
  // --------------------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TrustCheck Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
