import { RiskSignal, Entity } from '../../src/types/index.js';

export class RiskSignalService {
  /**
   * Generates automated risk signals based on entity metadata, domain age, reports, and content.
   */
  public evaluateRiskSignals(entity: Partial<Entity>, customContext?: any): RiskSignal[] {
    const signals: RiskSignal[] = [];
    const now = new Date().toISOString();

    // 1. Domain Registration Age Check
    if (entity.website_data?.domain_age_days !== undefined) {
      if (entity.website_data.domain_age_days < 30) {
        signals.push({
          id: `rs-${Date.now()}-1`,
          entity_id: entity.id || '',
          signal_name: 'Newly Registered Domain',
          category: 'domain',
          description: `Domain was created ${entity.website_data.domain_age_days} days ago. Newly registered domains carry statistically higher risk.`,
          severity: 'high',
          evidence: `Whois record shows registration date within the past 30 days (${entity.website_data.first_discovered_date}).`,
          source: 'Whois / Domain Registrar Lookup',
          confidence: 95,
          date_detected: now
        });
      } else if (entity.website_data.domain_age_days < 90) {
        signals.push({
          id: `rs-${Date.now()}-2`,
          entity_id: entity.id || '',
          signal_name: 'Recent Domain Registration (< 90 Days)',
          category: 'domain',
          description: 'Domain was created within the last 3 months.',
          severity: 'medium',
          evidence: `Domain age is ${entity.website_data.domain_age_days} days.`,
          source: 'Domain Registry Analysis',
          confidence: 90,
          date_detected: now
        });
      }

      // Check HTTPS
      if (!entity.website_data.https_status) {
        signals.push({
          id: `rs-${Date.now()}-3`,
          entity_id: entity.id || '',
          signal_name: 'Insecure Connection (No HTTPS)',
          category: 'domain',
          description: 'Website does not enforce encrypted SSL/TLS connections.',
          severity: 'high',
          evidence: 'HTTP protocol without valid SSL certificate.',
          source: 'Network Scanner',
          confidence: 100,
          date_detected: now
        });
      }
    }

    // 2. Missing Physical Contact & Identity Information
    if (!entity.address && !entity.phone) {
      signals.push({
        id: `rs-${Date.now()}-4`,
        entity_id: entity.id || '',
        signal_name: 'Missing Business Contact Information',
        category: 'identity',
        description: 'No verified physical corporate address or telephone contact provided.',
        severity: 'medium',
        evidence: 'Entity profile lacks verified physical address and customer service phone number.',
        source: 'Public Footprint Audit',
        confidence: 85,
        date_detected: now
      });
    }

    // 3. Job Offer Specific Risk Signals
    if (entity.entity_type === 'Job Offer' && entity.job_data) {
      if (entity.job_data.payment_request_detected || entity.job_data.application_fee_detected) {
        signals.push({
          id: `rs-${Date.now()}-5`,
          entity_id: entity.id || '',
          signal_name: 'Upfront Payment or Fee Requested',
          category: 'payment',
          description: 'Job listing or recruiter requires candidates to pay an application, training, or equipment fee.',
          severity: 'critical',
          evidence: 'Application instructions require candidate payment prior to employment offer.',
          source: 'Job Offer Content Analyzer',
          confidence: 95,
          date_detected: now
        });
      }
    }

    // 4. Rental Listing Specific Risk Signals
    if (entity.entity_type === 'Rental Listing' && entity.rental_data) {
      if (entity.rental_data.duplicate_detection_status === 'possible_duplicate') {
        signals.push({
          id: `rs-${Date.now()}-6`,
          entity_id: entity.id || '',
          signal_name: 'Duplicate Photo or Listing Detected',
          category: 'duplicate',
          description: 'Property listing photos match existing online listings under a different contact or address.',
          severity: 'high',
          evidence: 'Image hashing matched listing photos across unrelated platforms.',
          source: 'Image Fingerprinting Engine',
          confidence: 88,
          date_detected: now
        });
      }
    }

    // 5. Investment Opportunity Specific Risk Signals
    if (entity.entity_type === 'Investment Opportunity' && entity.investment_data) {
      if (entity.investment_data.claimed_returns?.includes('% per day') || entity.investment_data.claimed_returns?.includes('Guaranteed')) {
        signals.push({
          id: `rs-${Date.now()}-7`,
          entity_id: entity.id || '',
          signal_name: 'Unrealistic Financial Promises',
          category: 'financial',
          description: 'Claims guaranteed high-yield returns or daily profit returns without market disclosure.',
          severity: 'critical',
          evidence: `Opportunity marketing promises "${entity.investment_data.claimed_returns}".`,
          source: 'Financial Compliance Risk Audit',
          confidence: 95,
          date_detected: now
        });
      }
    }

    return signals;
  }
}
