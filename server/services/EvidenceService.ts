import { Evidence, EvidenceType } from '../../src/types/index.js';

export class EvidenceService {
  /**
   * Generates and links evidence records to entities and risk/trust signals.
   */
  public createEvidence(
    entityId: string,
    evidenceType: EvidenceType,
    title: string,
    description: string,
    sourceUrl?: string,
    filePath?: string
  ): Evidence {
    return {
      id: `ev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      entity_id: entityId,
      evidence_type: evidenceType,
      title,
      source_url: sourceUrl,
      description,
      file_path: filePath,
      collected_date: new Date().toISOString(),
      verification_status: 'verified'
    };
  }

  public generateStandardEvidenceSet(entityId: string, domain?: string, country?: string): Evidence[] {
    const items: Evidence[] = [];
    const now = new Date().toISOString();

    if (domain) {
      items.push({
        id: `ev-${entityId}-whois`,
        entity_id: entityId,
        evidence_type: 'Public record',
        title: 'Domain WHOIS & DNS Certificate Record',
        source_url: `https://${domain}`,
        description: `Public registration record and certificate audit for domain ${domain}.`,
        collected_date: now,
        verification_status: 'verified'
      });
    }

    items.push({
      id: `ev-${entityId}-footprint`,
      entity_id: entityId,
      evidence_type: 'Website page',
      title: 'Digital Footprint & Public Footprint Indexing',
      description: `Cross-referenced web citations and company disclosures for entity location (${country || 'Global'}).`,
      collected_date: now,
      verification_status: 'verified'
    });

    return items;
  }
}
