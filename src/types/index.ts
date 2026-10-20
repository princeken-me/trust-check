/**
 * TrustCheck - Global Trust & Risk Intelligence Platform Types
 */

export type UserRole = 
  | 'Super Admin' 
  | 'Admin' 
  | 'Analyst' 
  | 'Moderator' 
  | 'Verified Business' 
  | 'Regular User';

export type UserStatus = 'active' | 'suspended' | 'pending';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  email_verified_at?: string;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export type EntityType = 
  | 'Website'
  | 'Business'
  | 'Seller'
  | 'Job Offer'
  | 'Rental Listing'
  | 'Investment Opportunity'
  | 'Social Media Account'
  | 'Phone Number'
  | 'Email Address'
  | 'Payment Account'
  | 'Organization';

export type RiskClassification = 
  | 'Strong Trust Signals'
  | 'Generally Low Risk'
  | 'Moderate Risk'
  | 'High Risk'
  | 'Suspicious'
  | 'Limited Verification'
  | 'Unable to Verify'
  | 'Verified Identity';

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected' | 'revoked';
export type TrustStatus = 'trusted' | 'low_risk' | 'neutral' | 'elevated_risk' | 'high_risk' | 'unverified';

export interface Entity {
  id: string;
  entity_type: EntityType;
  name: string;
  slug: string;
  description: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  country?: string;
  state_region?: string;
  city?: string;
  status: 'active' | 'flagged' | 'archived';
  verification_status: VerificationStatus;
  trust_status: TrustStatus;
  created_at: string;
  updated_at: string;
  
  // Specific relationships metadata (loaded conditionally)
  website_data?: WebsiteData;
  business_data?: BusinessData;
  job_data?: JobOfferData;
  rental_data?: RentalListingData;
  investment_data?: InvestmentData;
  social_profiles?: SocialProfile[];
  current_score?: TrustScore;
}

export interface WebsiteData {
  id: string;
  entity_id: string;
  domain: string;
  full_url: string;
  registration_info?: string;
  domain_age_days?: number;
  https_status: boolean;
  cert_info?: string;
  registrar?: string;
  country?: string;
  hosting_info?: string;
  first_discovered_date: string;
  last_checked_date: string;
}

export interface BusinessData {
  id: string;
  entity_id: string;
  business_name: string;
  registration_number?: string;
  registration_info?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  country?: string;
  social_profiles?: string[];
  verification_status: VerificationStatus;
  claimed_status: boolean;
  verified_date?: string;
}

export interface SocialProfile {
  id: string;
  entity_id: string;
  platform: 'LinkedIn' | 'Twitter' | 'Facebook' | 'Instagram' | 'GitHub' | 'Telegram' | 'WhatsApp' | 'Other';
  username: string;
  profile_url: string;
  verification_status: VerificationStatus;
  date_discovered: string;
}

export interface JobOfferData {
  id: string;
  entity_id: string;
  job_title: string;
  company: string;
  application_url: string;
  recruiter?: string;
  contact_details?: string;
  salary?: string;
  location?: string;
  remote_status: boolean;
  payment_request_detected: boolean;
  application_fee_detected: boolean;
  verification_status: VerificationStatus;
}

export interface RentalListingData {
  id: string;
  entity_id: string;
  property_title: string;
  location: string;
  landlord_agent: string;
  contact: string;
  listing_url: string;
  price: string;
  property_type: string;
  images: string[];
  verification_status: VerificationStatus;
  duplicate_detection_status: 'none' | 'possible_duplicate' | 'verified_unique';
}

export interface InvestmentData {
  id: string;
  entity_id: string;
  organization: string;
  website: string;
  opportunity_type: string;
  claimed_returns: string;
  minimum_investment?: string;
  contact_details?: string;
  regulatory_info?: string;
  verification_status: VerificationStatus;
}

export interface CheckRequest {
  id: string;
  user_id?: string;
  input_type: 'url' | 'text' | 'phone' | 'email' | 'business' | 'listing';
  submitted_url?: string;
  submitted_text?: string;
  submitted_phone?: string;
  submitted_email?: string;
  uploaded_evidence?: string[];
  entity_matched_id?: string;
  date_submitted: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export type SignalSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface RiskSignal {
  id: string;
  entity_id: string;
  signal_name: string;
  category: 'domain' | 'identity' | 'payment' | 'communication' | 'financial' | 'reports' | 'duplicate';
  description: string;
  severity: SignalSeverity;
  evidence: string;
  source: string;
  confidence: number; // 0-100
  date_detected: string;
}

export interface TrustSignal {
  id: string;
  entity_id: string;
  signal_name: string;
  category: 'domain' | 'identity' | 'transparency' | 'history' | 'verification' | 'reputation';
  description: string;
  significance: 'high' | 'medium' | 'standard';
  evidence: string;
  source: string;
  confidence: number; // 0-100
  date_detected: string;
}

export type EvidenceType = 
  | 'Website page'
  | 'Public record'
  | 'User submission'
  | 'Screenshot'
  | 'Document'
  | 'External source'
  | 'Business information'
  | 'Historical record';

export interface Evidence {
  id: string;
  entity_id: string;
  evidence_type: EvidenceType;
  title: string;
  source_url?: string;
  description: string;
  file_path?: string;
  collected_date: string;
  verification_status: 'verified' | 'unverified' | 'disputed';
}

export type ReportType = 
  | 'Suspicious website'
  | 'Fake business'
  | 'Fake job'
  | 'Fake rental'
  | 'Suspicious investment'
  | 'Payment fraud'
  | 'Impersonation'
  | 'Other concern';

export interface UserReport {
  id: string;
  entity_id: string;
  user_id?: string;
  user_name?: string;
  user_email?: string;
  report_type: ReportType;
  description: string;
  evidence_summary?: string;
  evidence_files?: string[];
  status: 'pending' | 'under_review' | 'actioned' | 'dismissed';
  moderation_notes?: string;
  moderated_by?: string;
  created_at: string;
}

export interface TrustScore {
  id: string;
  entity_id: string;
  score: number; // 0 - 100
  risk_level: RiskClassification;
  trust_signals_count: number;
  risk_signals_count: number;
  confidence: number; // 0 - 100
  score_explanation: string;
  calculated_date: string;
}

export interface TrustScoreHistory {
  id: string;
  entity_id: string;
  previous_score: number;
  new_score: number;
  risk_level: RiskClassification;
  change_reason: string;
  changed_at: string;
}

export interface VerificationRequest {
  id: string;
  entity_id: string;
  user_id: string;
  organization_name: string;
  documentation_summary: string;
  documentation_files: string[];
  reviewer_id?: string;
  review_notes?: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submitted_at: string;
}

export interface VerifiedEntity {
  id: string;
  entity_id: string;
  verification_type: 'Government Registry' | 'Domain Ownership' | 'Legal Authorization' | 'Verified Identity';
  documents: string[];
  reviewer_id: string;
  verification_date: string;
  expiry_date?: string;
  status: 'active' | 'expired' | 'revoked';
}

export interface ReviewExperience {
  id: string;
  entity_id: string;
  user_id: string;
  user_name: string;
  rating: number; // 1-5
  title: string;
  content: string;
  evidence?: string;
  moderation_status: 'pending' | 'approved' | 'rejected';
  moderated_by?: string;
  moderated_at?: string;
  created_at: string;
}

export interface Watchlist {
  id: string;
  user_id: string;
  entity_id: string;
  notes?: string;
  alert_preferences: {
    score_change: boolean;
    new_reports: boolean;
    new_risk_signals: boolean;
    verification_change: boolean;
  };
  created_at: string;
  entity?: Entity;
}

export interface Alert {
  id: string;
  user_id: string;
  entity_id: string;
  alert_type: 'score_change' | 'new_report' | 'new_risk_signal' | 'verification_change';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface AdminActivityLog {
  id: string;
  admin_id: string;
  admin_name: string;
  action: string;
  target_type: string;
  target_id: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address: string;
  created_at: string;
}

export interface DataSource {
  id: string;
  source_name: string;
  source_type: 'Government Registry' | 'Domain Registrar' | 'Financial Regulator' | 'SSL CA' | 'Threat Database' | 'Public API';
  url_api: string;
  reliability_rating: number; // 1 - 5 stars
  country: string;
  active_status: boolean;
  last_checked: string;
}

export type ResearchType = 
  | 'Website review'
  | 'Business verification'
  | 'Domain research'
  | 'Job verification'
  | 'Rental listing review'
  | 'Investment opportunity review'
  | 'Duplicate detection';

export interface ResearchTask {
  id: string;
  entity_id: string;
  entity_name: string;
  research_type: ResearchType;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  assigned_to: string;
  sources_selected: string[];
  findings?: string;
  evidence_suggested?: string[];
  created_at: string;
  completed_at?: string;
}

export interface ContentItem {
  id: string;
  content_type: 'faq' | 'safety_guide' | 'announcement' | 'featured_entity';
  title: string;
  category?: string;
  body: string;
  is_published: boolean;
  author: string;
  created_at: string;
}

export interface SystemSettings {
  site_name: string;
  slogan: string;
  contact_email: string;
  support_phone: string;
  max_upload_size_mb: number;
  score_sensitivity: 'conservative' | 'standard' | 'strict';
  auto_moderation_threshold: number;
  maintenance_mode: boolean;
  public_reports_enabled: boolean;
  audit_logging_enabled: boolean;
}

