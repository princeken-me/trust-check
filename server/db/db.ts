import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import fs from 'fs';
import { 
  User, Entity, WebsiteData, BusinessData, SocialProfile, JobOfferData, 
  RentalListingData, InvestmentData, CheckRequest, RiskSignal, TrustSignal, 
  Evidence, UserReport, TrustScore, TrustScoreHistory, VerificationRequest, 
  VerifiedEntity, ReviewExperience, Watchlist, Alert, AdminActivityLog, DataSource 
} from '../../src/types/index.js';
import { 
  initialUsers, initialEntities, initialWebsites, initialBusinesses, 
  initialRiskSignals, initialTrustSignals, initialEvidence, initialTrustScores, 
  initialUserReports, initialDataSources 
} from './seeders.js';

export interface DatabaseSchema {
  users: User[];
  entities: Entity[];
  websites: WebsiteData[];
  businesses: BusinessData[];
  social_profiles: SocialProfile[];
  job_offers: JobOfferData[];
  rental_listings: RentalListingData[];
  investment_opportunities: InvestmentData[];
  check_requests: CheckRequest[];
  risk_signals: RiskSignal[];
  trust_signals: TrustSignal[];
  evidence: Evidence[];
  user_reports: UserReport[];
  trust_scores: TrustScore[];
  trust_score_history: TrustScoreHistory[];
  verification_requests: VerificationRequest[];
  verified_entities: VerifiedEntity[];
  reviews_and_experiences: ReviewExperience[];
  watchlists: Watchlist[];
  alerts: Alert[];
  admin_activity_logs: AdminActivityLog[];
  data_sources: DataSource[];
  migrations: { name: string; executed_at: string }[];
}

const defaultData: DatabaseSchema = {
  users: initialUsers,
  entities: initialEntities,
  websites: initialWebsites,
  businesses: initialBusinesses,
  social_profiles: [],
  job_offers: [],
  rental_listings: [],
  investment_opportunities: [],
  check_requests: [],
  risk_signals: initialRiskSignals,
  trust_signals: initialTrustSignals,
  evidence: initialEvidence,
  user_reports: initialUserReports,
  trust_scores: initialTrustScores,
  trust_score_history: [],
  verification_requests: [
    {
      id: 'vr-ecocraft-1',
      entity_id: 'ent-5-ecotreats',
      user_id: 'usr-regular-1',
      organization_name: 'EcoCraft Artisan Home Goods',
      documentation_summary: 'Oregon State Business Registration Certificate & Tax ID',
      documentation_files: ['/docs/ecocraft-oregon-cert.pdf'],
      status: 'pending',
      submitted_at: '2026-07-28T14:00:00Z'
    }
  ],
  verified_entities: [
    {
      id: 've-apex-1',
      entity_id: 'ent-1-apex',
      verification_type: 'Government Registry',
      documents: ['/docs/uk-house-cert-08921034.pdf'],
      reviewer_id: 'usr-analyst-1',
      verification_date: '2025-02-01T00:00:00Z',
      expiry_date: '2027-02-01T00:00:00Z',
      status: 'active'
    }
  ],
  reviews_and_experiences: [],
  watchlists: [],
  alerts: [],
  admin_activity_logs: [
    {
      id: 'log-init-1',
      admin_id: 'usr-superadmin-1',
      admin_name: 'Eleanor Vance',
      action: 'SYSTEM_BOOTSTRAP_MIGRATIONS',
      target_type: 'Database',
      target_id: 'schema_v1',
      ip_address: '127.0.0.1',
      created_at: new Date().toISOString()
    }
  ],
  data_sources: initialDataSources,
  migrations: [
    { name: '2026_07_29_000001_create_trustcheck_tables', executed_at: new Date().toISOString() }
  ]
};

const dbPath = path.join(process.cwd(), 'trustcheck_db.json');
const adapter = new JSONFile<DatabaseSchema>(dbPath);
const db = new Low<DatabaseSchema>(adapter, defaultData);

export async function initDatabase() {
  await db.read();
  if (!db.data || !db.data.entities || db.data.entities.length === 0) {
    db.data = defaultData;
    await db.write();
    console.log('Database initialized with default schema & seeders.');
  } else {
    console.log('Database loaded successfully from trustcheck_db.json.');
  }
}

export function getDb() {
  return db;
}
