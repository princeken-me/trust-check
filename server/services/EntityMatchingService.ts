import { Entity, EntityType } from '../../src/types/index.js';

export class EntityMatchingService {
  /**
   * Matches user check query (URL, phone, email, text, business name) against database entities.
   */
  public matchEntity(query: string, existingEntities: Entity[]): { matched: Entity | null; candidateType: EntityType; cleanQuery: string } {
    const raw = query.trim().toLowerCase();
    
    // Normalize query
    let cleanQuery = raw;
    let candidateType: EntityType = 'Website';

    if (raw.startsWith('http://') || raw.startsWith('https://') || raw.includes('.com') || raw.includes('.org') || raw.includes('.net') || raw.includes('.io') || raw.includes('.co')) {
      candidateType = 'Website';
      cleanQuery = raw.replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase();
    } else if (raw.match(/^\+?[0-9\s\-()]{7,}$/)) {
      candidateType = 'Phone Number';
    } else if (raw.includes('@')) {
      candidateType = 'Email Address';
    } else if (raw.includes('job') || raw.includes('hiring') || raw.includes('career')) {
      candidateType = 'Job Offer';
    } else if (raw.includes('rent') || raw.includes('apartment') || raw.includes('lease') || raw.includes('suite')) {
      candidateType = 'Rental Listing';
    } else if (raw.includes('invest') || raw.includes('crypto') || raw.includes('trade') || raw.includes('yield')) {
      candidateType = 'Investment Opportunity';
    } else {
      candidateType = 'Business';
    }

    // Attempt exact or fuzzy match
    const matched = existingEntities.find(e => {
      if (e.website && e.website.toLowerCase().includes(cleanQuery)) return true;
      if (e.name.toLowerCase() === cleanQuery || e.slug === cleanQuery) return true;
      if (e.phone && e.phone.includes(cleanQuery)) return true;
      if (e.email && e.email.toLowerCase() === cleanQuery) return true;
      return false;
    }) || null;

    return { matched, candidateType, cleanQuery };
  }
}
