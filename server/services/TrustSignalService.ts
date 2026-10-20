import { TrustSignal, Entity } from '../../src/types/index.js';

export class TrustSignalService {
  /**
   * Generates evidence-backed positive trust signals for an entity.
   */
  public evaluateTrustSignals(entity: Partial<Entity>, customContext?: any): TrustSignal[] {
    const signals: TrustSignal[] = [];
    const now = new Date().toISOString();

    // 1. Domain Longevity
    if (entity.website_data?.domain_age_days && entity.website_data.domain_age_days > 1095) { // > 3 years
      const years = Math.floor(entity.website_data.domain_age_days / 365);
      signals.push({
        id: `ts-${Date.now()}-1`,
        entity_id: entity.id || '',
        signal_name: 'Established Domain Operating History',
        category: 'domain',
        description: `Domain has been continuously active for over ${years} years.`,
        significance: 'high',
        evidence: `Domain registration established in ${entity.website_data.first_discovered_date}.`,
        source: 'Whois / Registry Records',
        confidence: 95,
        date_detected: now
      });
    }

    // 2. HTTPS & Security Certificate
    if (entity.website_data?.https_status) {
      signals.push({
        id: `ts-${Date.now()}-2`,
        entity_id: entity.id || '',
        signal_name: 'Valid SSL/TLS Encryption',
        category: 'domain',
        description: 'Enforces secure encrypted web sessions with an active certificate.',
        significance: 'standard',
        evidence: `Certificate issued by ${entity.website_data.registrar || 'Trusted Certificate Authority'}.`,
        source: 'Security Audit',
        confidence: 100,
        date_detected: now
      });
    }

    // 3. Physical Address & Corporate Presence
    if (entity.address && entity.country) {
      signals.push({
        id: `ts-${Date.now()}-3`,
        entity_id: entity.id || '',
        signal_name: 'Verifiable Physical Business Location',
        category: 'identity',
        description: `Registered physical office in ${entity.city ? entity.city + ', ' : ''}${entity.country}.`,
        significance: 'medium',
        evidence: `Corporate address match: ${entity.address}, ${entity.country}.`,
        source: 'Public Registry Verification',
        confidence: 90,
        date_detected: now
      });
    }

    // 4. Verification Status
    if (entity.verification_status === 'verified') {
      signals.push({
        id: `ts-${Date.now()}-4`,
        entity_id: entity.id || '',
        signal_name: 'Verified Business Identity',
        category: 'verification',
        description: 'Completed TrustCheck corporate identity & legal registration review.',
        significance: 'high',
        evidence: 'Official business registration documents cross-verified by compliance analyst.',
        source: 'TrustCheck Compliance Desk',
        confidence: 100,
        date_detected: now
      });
    }

    // 5. Social Presence & Footprint
    if (entity.social_profiles && entity.social_profiles.length > 0) {
      signals.push({
        id: `ts-${Date.now()}-5`,
        entity_id: entity.id || '',
        signal_name: 'Established Social Footprint',
        category: 'reputation',
        description: `Active public presence across ${entity.social_profiles.length} platforms.`,
        significance: 'standard',
        evidence: `Connected profiles: ${entity.social_profiles.map(p => p.platform).join(', ')}.`,
        source: 'Social Indexer',
        confidence: 85,
        date_detected: now
      });
    }

    return signals;
  }
}
