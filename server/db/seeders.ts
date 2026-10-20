import { 
  User, Entity, WebsiteData, BusinessData, SocialProfile, JobOfferData, 
  RentalListingData, InvestmentData, CheckRequest, RiskSignal, TrustSignal, 
  Evidence, UserReport, TrustScore, TrustScoreHistory, VerificationRequest, 
  VerifiedEntity, ReviewExperience, Watchlist, Alert, AdminActivityLog, DataSource 
} from '../../src/types/index.js';

export const initialUsers: User[] = [
  {
    id: 'usr-superadmin-1',
    name: 'Eleanor Vance',
    email: 'admin@trustcheck.org',
    phone: '+1-555-019-2831',
    role: 'Super Admin',
    status: 'active',
    email_verified_at: '2025-01-15T08:00:00Z',
    last_login_at: '2026-07-29T06:45:00Z',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2026-07-29T06:45:00Z'
  },
  {
    id: 'usr-analyst-1',
    name: 'Marcus Thorne',
    email: 'm.thorne@trustcheck.org',
    phone: '+44-20-7946-0912',
    role: 'Analyst',
    status: 'active',
    email_verified_at: '2025-03-10T10:30:00Z',
    last_login_at: '2026-07-29T05:12:00Z',
    created_at: '2025-03-01T00:00:00Z',
    updated_at: '2026-07-29T05:12:00Z'
  },
  {
    id: 'usr-moderator-1',
    name: 'Sophia Chen',
    email: 's.chen@trustcheck.org',
    phone: '+65-6789-0123',
    role: 'Moderator',
    status: 'active',
    email_verified_at: '2025-04-01T09:15:00Z',
    last_login_at: '2026-07-28T18:20:00Z',
    created_at: '2025-04-01T00:00:00Z',
    updated_at: '2026-07-28T18:20:00Z'
  },
  {
    id: 'usr-biz-1',
    name: 'Apex Global Logistics Legal',
    email: 'legal@apexlogistic.com',
    phone: '+1-800-555-9090',
    role: 'Verified Business',
    status: 'active',
    email_verified_at: '2025-06-12T14:22:00Z',
    last_login_at: '2026-07-27T11:00:00Z',
    created_at: '2025-06-10T00:00:00Z',
    updated_at: '2026-07-27T11:00:00Z'
  },
  {
    id: 'usr-regular-1',
    name: 'David Miller',
    email: 'd.miller88@gmail.com',
    phone: '+1-312-555-4321',
    role: 'Regular User',
    status: 'active',
    email_verified_at: '2025-09-20T16:00:00Z',
    last_login_at: '2026-07-29T07:05:00Z',
    created_at: '2025-09-20T00:00:00Z',
    updated_at: '2026-07-29T07:05:00Z'
  }
];

export const initialEntities: Entity[] = [
  {
    id: 'ent-1-apex',
    entity_type: 'Business',
    name: 'Apex Global Logistics Solutions Inc.',
    slug: 'apex-global-logistics',
    description: 'Licensed international freight forwarding and supply chain enterprise headquartered in London with global warehousing facilities.',
    website: 'https://apexglobalfreight.com',
    phone: '+44-20-7946-0800',
    email: 'contact@apexglobalfreight.com',
    address: '124 City Road, EC1V 2NX',
    country: 'United Kingdom',
    state_region: 'Greater London',
    city: 'London',
    status: 'active',
    verification_status: 'verified',
    trust_status: 'trusted',
    created_at: '2024-02-15T10:00:00Z',
    updated_at: '2026-07-29T06:00:00Z'
  },
  {
    id: 'ent-2-yieldmax',
    entity_type: 'Investment Opportunity',
    name: 'YieldMax Quantum Algo Trading Platform',
    slug: 'yieldmax-quantum-algo',
    description: 'Automated digital asset arbitrage website promising 3.5% daily compounding yield through high-frequency trading bots.',
    website: 'https://yieldmax-quantum-trade.biz',
    phone: '+1-888-000-9912',
    email: 'support@yieldmax-quantum-trade.biz',
    address: 'Suite 404, Offshore House',
    country: 'Seychelles',
    state_region: 'Mahe',
    city: 'Victoria',
    status: 'flagged',
    verification_status: 'unverified',
    trust_status: 'high_risk',
    created_at: '2026-06-10T14:30:00Z',
    updated_at: '2026-07-28T19:40:00Z'
  },
  {
    id: 'ent-3-luxuryrent',
    entity_type: 'Rental Listing',
    name: 'Downtown Executive Penthouse Suite #1402',
    slug: 'downtown-penthouse-suite-1402',
    description: 'Fully furnished luxury 2-bedroom apartment listing posted on social media forums offering 60% below market rental rate.',
    website: 'https://social-marketplace.com/listing/98213',
    phone: '+1-415-555-0182',
    email: 'lease.downtown1402@tempmail.io',
    address: '450 Sutter Street',
    country: 'United States',
    state_region: 'California',
    city: 'San Francisco',
    status: 'flagged',
    verification_status: 'unverified',
    trust_status: 'elevated_risk',
    created_at: '2026-07-01T09:15:00Z',
    updated_at: '2026-07-29T02:10:00Z'
  },
  {
    id: 'ent-4-remotejob',
    entity_type: 'Job Offer',
    name: 'Global Executive Assistant - Remote Data Entry',
    slug: 'global-exec-assistant-remote',
    description: 'Unsolicited remote job offer received via messaging app requiring applicant to purchase workspace hardware via cheque transfer.',
    website: 'https://careers-globalexec-portal.net',
    phone: '+1-202-555-0149',
    email: 'hr-onboarding@careers-globalexec-portal.net',
    address: 'Unverified Remote Postal Address',
    country: 'United States',
    state_region: 'New York',
    city: 'New York',
    status: 'flagged',
    verification_status: 'unverified',
    trust_status: 'high_risk',
    created_at: '2026-07-15T11:00:00Z',
    updated_at: '2026-07-29T04:25:00Z'
  },
  {
    id: 'ent-5-ecotreats',
    entity_type: 'Seller',
    name: 'EcoCraft Artisan Home Goods',
    slug: 'ecocraft-artisan-home-goods',
    description: 'E-commerce boutique specializing in sustainable handcrafted home Decor with transparent shipping policies and active social reviews.',
    website: 'https://ecocrafthomegoods.com',
    phone: '+1-503-555-0199',
    email: 'hello@ecocrafthomegoods.com',
    address: '890 SE Belmont St',
    country: 'United States',
    state_region: 'Oregon',
    city: 'Portland',
    status: 'active',
    verification_status: 'pending',
    trust_status: 'low_risk',
    created_at: '2025-05-20T12:00:00Z',
    updated_at: '2026-07-29T01:00:00Z'
  }
];

export const initialWebsites: WebsiteData[] = [
  {
    id: 'web-1',
    entity_id: 'ent-1-apex',
    domain: 'apexglobalfreight.com',
    full_url: 'https://apexglobalfreight.com',
    registration_info: 'Registered with NameCheap Inc, UK Companies House #08921034',
    domain_age_days: 1650,
    https_status: true,
    cert_info: 'DigiCert TLS RSA SHA256 2024 CA1',
    registrar: 'NameCheap Inc.',
    country: 'United Kingdom',
    hosting_info: 'AWS eu-west-1 Cloud Infrastructure',
    first_discovered_date: '2020-01-10T00:00:00Z',
    last_checked_date: '2026-07-29T06:00:00Z'
  },
  {
    id: 'web-2',
    entity_id: 'ent-2-yieldmax',
    domain: 'yieldmax-quantum-trade.biz',
    full_url: 'https://yieldmax-quantum-trade.biz',
    registration_info: 'Privacy Protected WHOIS Guardian Seychelles',
    domain_age_days: 18,
    https_status: true,
    cert_info: "Let's Encrypt Free Domain Validated CA",
    registrar: 'Offshore Registrar LLC',
    country: 'Seychelles',
    hosting_info: 'Bulletproof Reverse Proxy Host',
    first_discovered_date: '2026-07-11T00:00:00Z',
    last_checked_date: '2026-07-28T19:40:00Z'
  }
];

export const initialBusinesses: BusinessData[] = [
  {
    id: 'biz-1',
    entity_id: 'ent-1-apex',
    business_name: 'Apex Global Logistics Solutions Inc.',
    registration_number: 'UK-08921034',
    registration_info: 'UK Companies House Verified Official Record',
    website: 'https://apexglobalfreight.com',
    phone: '+44-20-7946-0800',
    email: 'contact@apexglobalfreight.com',
    address: '124 City Road, EC1V 2NX',
    country: 'United Kingdom',
    social_profiles: ['LinkedIn', 'Twitter'],
    verification_status: 'verified',
    claimed_status: true,
    verified_date: '2025-02-01T00:00:00Z'
  }
];

export const initialRiskSignals: RiskSignal[] = [
  {
    id: 'rs-yield-1',
    entity_id: 'ent-2-yieldmax',
    signal_name: 'Newly Registered Domain (< 30 Days)',
    category: 'domain',
    description: 'The website domain was registered 18 days ago under WHOIS privacy protection.',
    severity: 'high',
    evidence: 'WHOIS record created 2026-07-11 via Offshore Registrar LLC.',
    source: 'Domain Registrar API',
    confidence: 98,
    date_detected: '2026-07-11T14:30:00Z'
  },
  {
    id: 'rs-yield-2',
    entity_id: 'ent-2-yieldmax',
    signal_name: 'Unrealistic Financial Return Guarantee',
    category: 'financial',
    description: 'Promote 3.5% daily profit compounding yields with zero risk disclosure.',
    severity: 'critical',
    evidence: 'Website marketing copy: "Guaranteed 3.5% daily payout risk-free algorithm".',
    source: 'Financial Compliance Risk Engine',
    confidence: 96,
    date_detected: '2026-07-12T09:00:00Z'
  },
  {
    id: 'rs-rental-1',
    entity_id: 'ent-3-luxuryrent',
    signal_name: 'Duplicate Image Footprint Match',
    category: 'duplicate',
    description: 'Listing property photos match a verified condo sale listing in Miami, Florida.',
    severity: 'high',
    evidence: 'Perceptual hashing algorithm matched 6 photos with Zillow Miami archive #78291.',
    source: 'Image Fingerprint Engine',
    confidence: 92,
    date_detected: '2026-07-02T10:15:00Z'
  },
  {
    id: 'rs-rental-2',
    entity_id: 'ent-3-luxuryrent',
    signal_name: 'Wire Transfer / Crypto Upfront Request',
    category: 'payment',
    description: 'Landlord claims out-of-country emergency and demands holding deposit via non-reversible wire transfer before viewing.',
    severity: 'critical',
    evidence: 'User submission message logs from email lease.downtown1402@tempmail.io.',
    source: 'User Incident Report',
    confidence: 95,
    date_detected: '2026-07-03T11:40:00Z'
  },
  {
    id: 'rs-job-1',
    entity_id: 'ent-4-remotejob',
    signal_name: 'Cheque Advance Equipment Fee Pattern',
    category: 'payment',
    description: 'Recruiter requires applicant to deposit cheque and send remaining funds to equipment vendor.',
    severity: 'critical',
    evidence: 'Onboarding PDF instructions require payment via Zelle/Wire to third-party vendor.',
    source: 'Document Parsing Engine',
    confidence: 99,
    date_detected: '2026-07-16T15:00:00Z'
  }
];

export const initialTrustSignals: TrustSignal[] = [
  {
    id: 'ts-apex-1',
    entity_id: 'ent-1-apex',
    signal_name: 'Verified UK Companies House Registry Record',
    category: 'identity',
    description: 'Official corporate filing cross-referenced with United Kingdom official registry #08921034.',
    significance: 'high',
    evidence: 'UK Companies House API active filing status confirmed.',
    source: 'Government API',
    confidence: 100,
    date_detected: '2024-02-16T00:00:00Z'
  },
  {
    id: 'ts-apex-2',
    entity_id: 'ent-1-apex',
    signal_name: 'Established Operating History (> 4.5 Years)',
    category: 'domain',
    description: 'Domain continuously registered and active since January 2020.',
    significance: 'high',
    evidence: 'Whois domain history verified across multiple independent DNS snapshots.',
    source: 'Security Audit',
    confidence: 98,
    date_detected: '2024-02-16T00:00:00Z'
  },
  {
    id: 'ts-eco-1',
    entity_id: 'ent-5-ecotreats',
    signal_name: 'Transparent Business Address & Contact',
    category: 'transparency',
    description: 'Verified physical commercial shopfront in Portland, Oregon with direct customer care lines.',
    significance: 'medium',
    evidence: 'Physical location matched Oregon Secretary of State filings.',
    source: 'State Public Registry',
    confidence: 90,
    date_detected: '2025-05-21T00:00:00Z'
  }
];

export const initialEvidence: Evidence[] = [
  {
    id: 'ev-1',
    entity_id: 'ent-1-apex',
    evidence_type: 'Public record',
    title: 'UK Companies House Filing #08921034',
    source_url: 'https://find-and-update.company-information.service.gov.uk/company/08921034',
    description: 'Official corporate status report confirming active standing, verified officers, and annual accounts filings.',
    collected_date: '2025-02-01T00:00:00Z',
    verification_status: 'verified'
  },
  {
    id: 'ev-2',
    entity_id: 'ent-2-yieldmax',
    evidence_type: 'Screenshot',
    title: 'Guaranteed Yield Marketing Disclosure',
    source_url: 'https://yieldmax-quantum-trade.biz',
    description: 'Archived page snapshot capturing claims of guaranteed 3.5% daily ROI with automated payout buttons.',
    collected_date: '2026-07-11T15:00:00Z',
    verification_status: 'verified'
  }
];

export const initialTrustScores: TrustScore[] = [
  {
    id: 'score-apex',
    entity_id: 'ent-1-apex',
    score: 94,
    risk_level: 'Verified Identity',
    trust_signals_count: 5,
    risk_signals_count: 0,
    confidence: 95,
    score_explanation: 'Calculated overall Trust Index of 94/100 resulting in a classification of "Verified Identity". Positive trust factors include: Verified UK Companies House Registry Record, Established Operating History (> 4.5 Years). No severe risk indicators or negative pattern matches were detected at this time. This entity holds a verified identity status backed by official documentation.',
    calculated_date: '2026-07-29T06:00:00Z'
  },
  {
    id: 'score-yieldmax',
    entity_id: 'ent-2-yieldmax',
    score: 12,
    risk_level: 'Suspicious',
    trust_signals_count: 1,
    risk_signals_count: 2,
    confidence: 90,
    score_explanation: 'Calculated overall Trust Index of 12/100 resulting in a classification of "Suspicious". Identified risk signals include: Unrealistic Financial Return Guarantee, Newly Registered Domain (< 30 Days). Caution is strongly recommended prior to initiating financial transactions.',
    calculated_date: '2026-07-28T19:40:00Z'
  },
  {
    id: 'score-rental',
    entity_id: 'ent-3-luxuryrent',
    score: 28,
    risk_level: 'High Risk',
    trust_signals_count: 0,
    risk_signals_count: 2,
    confidence: 88,
    score_explanation: 'Calculated overall Trust Index of 28/100 resulting in a classification of "High Risk". Identified risk signals include: Wire Transfer / Crypto Upfront Request, Duplicate Image Footprint Match. Verify landlord identity independently before transmitting funds.',
    calculated_date: '2026-07-29T02:10:00Z'
  },
  {
    id: 'score-job',
    entity_id: 'ent-4-remotejob',
    score: 15,
    risk_level: 'Suspicious',
    trust_signals_count: 0,
    risk_signals_count: 1,
    confidence: 92,
    score_explanation: 'Calculated overall Trust Index of 15/100 resulting in a classification of "Suspicious". Identified risk signals include: Cheque Advance Equipment Fee Pattern. Legitimate employers never request candidates to advance money for hardware.',
    calculated_date: '2026-07-29T04:25:00Z'
  },
  {
    id: 'score-ecotreats',
    entity_id: 'ent-5-ecotreats',
    score: 78,
    risk_level: 'Generally Low Risk',
    trust_signals_count: 2,
    risk_signals_count: 0,
    confidence: 80,
    score_explanation: 'Calculated overall Trust Index of 78/100 resulting in a classification of "Generally Low Risk". Positive trust factors include: Transparent Business Address & Contact, Active E-commerce Storefront. Identity verification is currently pending.',
    calculated_date: '2026-07-29T01:00:00Z'
  }
];

export const initialUserReports: UserReport[] = [
  {
    id: 'rep-1',
    entity_id: 'ent-2-yieldmax',
    user_id: 'usr-regular-1',
    user_name: 'David Miller',
    user_email: 'd.miller88@gmail.com',
    report_type: 'Suspicious investment',
    description: 'Site refused withdrawal after asking for an extra 15% verification fee.',
    evidence_summary: 'Chat conversation logs showing deposit requests.',
    status: 'under_review',
    created_at: '2026-07-27T10:00:00Z'
  }
];

export const initialDataSources: DataSource[] = [
  {
    id: 'ds-1',
    source_name: 'UK Companies House Registry API',
    source_type: 'Government Registry',
    url_api: 'https://api.company-information.service.gov.uk',
    reliability_rating: 5,
    country: 'United Kingdom',
    active_status: true,
    last_checked: '2026-07-29T06:00:00Z'
  },
  {
    id: 'ds-2',
    source_name: 'ICANN WHOIS Domain Intelligence',
    source_type: 'Domain Registrar',
    url_api: 'https://whois.icann.org/api/lookup',
    reliability_rating: 5,
    country: 'Global',
    active_status: true,
    last_checked: '2026-07-29T06:00:00Z'
  },
  {
    id: 'ds-3',
    source_name: 'SEC EDGAR Corporate Regulatory Database',
    source_type: 'Financial Regulator',
    url_api: 'https://www.sec.gov/edgar/searchedgar/companysearch',
    reliability_rating: 5,
    country: 'United States',
    active_status: true,
    last_checked: '2026-07-29T05:30:00Z'
  }
];
