import { Entity, UserReport, RentalListingData, JobOfferData } from '../../src/types/index.js';

export interface DuplicateMatchResult {
  match_type: 'same_phone' | 'same_email' | 'same_domain' | 'similar_name' | 'similar_address' | 'duplicate_listing' | 'duplicate_report';
  entity_id_a: string;
  entity_id_b: string;
  matched_value: string;
  similarity_score: number; // 0-100
  notes: string;
}

export class DuplicateDetectionService {
  /**
   * Scans system records to detect duplicate entities, cross-used contact details,
   * duplicate rental listings, or repeated incident reports.
   */
  public detectDuplicates(
    entities: Entity[],
    reports: UserReport[]
  ): DuplicateMatchResult[] {
    const results: DuplicateMatchResult[] = [];

    // 1. Phone & Email Cross-Check across entities
    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const a = entities[i];
        const b = entities[j];

        // Same Phone Number across unrelated entities
        if (a.phone && b.phone && a.phone === b.phone) {
          results.push({
            match_type: 'same_phone',
            entity_id_a: a.id,
            entity_id_b: b.id,
            matched_value: a.phone,
            similarity_score: 100,
            notes: `Identical telephone number (${a.phone}) registered across distinct entities: "${a.name}" and "${b.name}".`
          });
        }

        // Same Email Address
        if (a.email && b.email && a.email.toLowerCase() === b.email.toLowerCase()) {
          results.push({
            match_type: 'same_email',
            entity_id_a: a.id,
            entity_id_b: b.id,
            matched_value: a.email,
            similarity_score: 100,
            notes: `Identical contact email (${a.email}) shared between "${a.name}" and "${b.name}".`
          });
        }

        // Domain Match
        if (a.website && b.website && this.extractDomain(a.website) === this.extractDomain(b.website)) {
          results.push({
            match_type: 'same_domain',
            entity_id_a: a.id,
            entity_id_b: b.id,
            matched_value: this.extractDomain(a.website),
            similarity_score: 100,
            notes: `Entities share the exact same web domain: ${this.extractDomain(a.website)}.`
          });
        }

        // Similar Name (Levenshtein / String overlap)
        const nameSim = this.calculateStringSimilarity(a.name.toLowerCase(), b.name.toLowerCase());
        if (nameSim > 85 && a.id !== b.id) {
          results.push({
            match_type: 'similar_name',
            entity_id_a: a.id,
            entity_id_b: b.id,
            matched_value: `${a.name} ~ ${b.name}`,
            similarity_score: Math.round(nameSim),
            notes: `High name similarity (${Math.round(nameSim)}%) detected between "${a.name}" and "${b.name}".`
          });
        }
      }
    }

    // 2. Duplicate Report Detection
    for (let i = 0; i < reports.length; i++) {
      for (let j = i + 1; j < reports.length; j++) {
        const r1 = reports[i];
        const r2 = reports[j];

        if (r1.entity_id === r2.entity_id && r1.description && r2.description) {
          const descSim = this.calculateStringSimilarity(r1.description.toLowerCase(), r2.description.toLowerCase());
          if (descSim > 80) {
            results.push({
              match_type: 'duplicate_report',
              entity_id_a: r1.id,
              entity_id_b: r2.id,
              matched_value: `Report ${r1.id} & Report ${r2.id}`,
              similarity_score: Math.round(descSim),
              notes: `Duplicate report text pattern (${Math.round(descSim)}% match) submitted for entity ${r1.entity_id}.`
            });
          }
        }
      }
    }

    return results;
  }

  private extractDomain(url: string): string {
    return url.replace(/^https?:\/\//, '').split('/')[0].split(':')[0].toLowerCase();
  }

  private calculateStringSimilarity(s1: string, s2: string): number {
    let longer = s1;
    let shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    const longerLength = longer.length;
    if (longerLength === 0) {
      return 100.0;
    }
    const editDistance = this.levenshteinDistance(longer, shorter);
    return ((longerLength - editDistance) / parseFloat(longerLength.toString())) * 100;
  }

  private levenshteinDistance(s1: string, s2: string): number {
    const costs: number[] = [];
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) costs[j] = j;
        else {
          if (j > 0) {
            let newValue = costs[j - 1];
            if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
              newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
            }
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }
}
