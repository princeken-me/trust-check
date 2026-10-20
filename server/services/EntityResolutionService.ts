import { Entity, EntityType } from '../../src/types/index.js';

export interface ResolutionMatch {
  matched_entity: Entity | null;
  candidate_type: EntityType;
  match_confidence: number; // 0 - 100
  match_criteria: string[];
}

export class EntityResolutionService {
  /**
   * Resolves an arbitrary query string (URL, business name, phone, email, etc.)
   * against existing entity profiles to locate candidate matches.
   */
  public resolveEntity(query: string, existingEntities: Entity[]): ResolutionMatch {
    const cleanQuery = query.trim().toLowerCase();
    const criteria: string[] = [];
    let bestMatch: Entity | null = null;
    let highestConfidence = 0;

    // Detect Input Candidate Type
    let candidateType: EntityType = 'Business';
    if (cleanQuery.includes('.') || cleanQuery.startsWith('http')) {
      candidateType = 'Website';
    } else if (cleanQuery.startsWith('+') || /^\d[\d\s\-\(\)]{7,}\d$/.test(cleanQuery)) {
      candidateType = 'Phone Number';
    } else if (cleanQuery.includes('@')) {
      candidateType = 'Email Address';
    }

    const queryDomain = cleanQuery.replace(/^https?:\/\//, '').split('/')[0].split(':')[0];

    for (const entity of existingEntities) {
      let confidence = 0;
      const currentCriteria: string[] = [];

      // 1. Exact Domain Match
      if (entity.website && this.extractDomain(entity.website) === queryDomain && queryDomain.length > 3) {
        confidence += 95;
        currentCriteria.push(`Exact domain match: ${queryDomain}`);
      }

      // 2. Exact Name Match
      if (entity.name.toLowerCase() === cleanQuery) {
        confidence += 90;
        currentCriteria.push(`Exact name match: "${entity.name}"`);
      } else if (entity.name.toLowerCase().includes(cleanQuery) || cleanQuery.includes(entity.name.toLowerCase())) {
        confidence += 60;
        currentCriteria.push(`Partial name overlap: "${entity.name}"`);
      }

      // 3. Exact Email / Phone Match
      if (entity.email && entity.email.toLowerCase() === cleanQuery) {
        confidence += 95;
        currentCriteria.push(`Exact contact email match: ${entity.email}`);
      }
      if (entity.phone && entity.phone.replace(/[^0-9]/g, '') === cleanQuery.replace(/[^0-9]/g, '') && cleanQuery.replace(/[^0-9]/g, '').length > 6) {
        confidence += 95;
        currentCriteria.push(`Exact phone match: ${entity.phone}`);
      }

      if (confidence > highestConfidence) {
        highestConfidence = confidence;
        bestMatch = entity;
        criteria.length = 0;
        criteria.push(...currentCriteria);
      }
    }

    return {
      matched_entity: highestConfidence >= 50 ? bestMatch : null,
      candidate_type: candidateType,
      match_confidence: Math.min(100, highestConfidence),
      match_criteria: criteria
    };
  }

  private extractDomain(url: string): string {
    return url.replace(/^https?:\/\//, '').split('/')[0].split(':')[0].toLowerCase();
  }
}
