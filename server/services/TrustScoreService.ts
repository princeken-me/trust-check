import { Entity, RiskSignal, TrustSignal, TrustScore, RiskClassification } from '../../src/types/index.js';

export class TrustScoreService {
  /**
   * Calculates composite Trust Score (0 - 100) and assigns an evidence-based Risk Classification.
   * Safety Principle: Never labels entities as "criminal" or "scammer". Uses objective risk buckets.
   */
  public calculateScore(
    entity: Partial<Entity>,
    riskSignals: RiskSignal[],
    trustSignals: TrustSignal[]
  ): TrustScore {
    let baseScore = 50; // Neutral baseline for unverified entities

    // Calculate deductions from risk signals
    let riskDeduction = 0;
    for (const signal of riskSignals) {
      switch (signal.severity) {
        case 'critical':
          riskDeduction += 30;
          break;
        case 'high':
          riskDeduction += 20;
          break;
        case 'medium':
          riskDeduction += 10;
          break;
        case 'low':
          riskDeduction += 5;
          break;
        case 'info':
          riskDeduction += 1;
          break;
      }
    }

    // Calculate additions from trust signals
    let trustAddition = 0;
    for (const signal of trustSignals) {
      switch (signal.significance) {
        case 'high':
          trustAddition += 25;
          break;
        case 'medium':
          trustAddition += 15;
          break;
        case 'standard':
          trustAddition += 10;
          break;
      }
    }

    // Domain / Verification bonus
    if (entity.verification_status === 'verified') {
      trustAddition += 20;
    }

    // Final mathematical score calculation bounded between 0 and 100
    let finalScore = Math.min(100, Math.max(0, Math.round(baseScore + trustAddition - riskDeduction)));

    // Assign careful Risk Classification
    const riskLevel = this.determineRiskClassification(entity, finalScore, riskSignals, trustSignals);

    // Calculate confidence level based on number of signals & data points
    const totalSignals = riskSignals.length + trustSignals.length;
    let confidence = 40; // baseline
    if (totalSignals >= 5) confidence = 90;
    else if (totalSignals >= 3) confidence = 75;
    else if (totalSignals >= 1) confidence = 60;

    // Generate clear transparent score explanation
    const scoreExplanation = this.generateExplanation(finalScore, riskLevel, riskSignals, trustSignals, entity);

    return {
      id: `score-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      entity_id: entity.id || '',
      score: finalScore,
      risk_level: riskLevel,
      trust_signals_count: trustSignals.length,
      risk_signals_count: riskSignals.length,
      confidence,
      score_explanation: scoreExplanation,
      calculated_date: new Date().toISOString()
    };
  }

  private determineRiskClassification(
    entity: Partial<Entity>,
    score: number,
    riskSignals: RiskSignal[],
    trustSignals: TrustSignal[]
  ): RiskClassification {
    const hasCriticalRisk = riskSignals.some(s => s.severity === 'critical');
    const isVerified = entity.verification_status === 'verified';

    if (isVerified && score >= 85) {
      return 'Verified Identity';
    }

    if (score >= 85 && trustSignals.length >= 3) {
      return 'Strong Trust Signals';
    }

    if (score >= 70) {
      return 'Generally Low Risk';
    }

    if (score >= 50 && score < 70) {
      return 'Moderate Risk';
    }

    if (score < 30 || hasCriticalRisk) {
      return 'Suspicious';
    }

    if (score >= 30 && score < 50) {
      return 'High Risk';
    }

    if (riskSignals.length === 0 && trustSignals.length === 0) {
      return 'Limited Verification';
    }

    return 'Unable to Verify';
  }

  private generateExplanation(
    score: number,
    riskLevel: RiskClassification,
    riskSignals: RiskSignal[],
    trustSignals: TrustSignal[],
    entity: Partial<Entity>
  ): string {
    const parts: string[] = [];

    parts.push(`Calculated overall Trust Index of ${score}/100 resulting in a classification of "${riskLevel}".`);

    if (trustSignals.length > 0) {
      const topTrust = trustSignals.slice(0, 2).map(s => s.signal_name).join(', ');
      parts.push(`Positive trust factors include: ${topTrust}.`);
    }

    if (riskSignals.length > 0) {
      const topRisk = riskSignals.slice(0, 2).map(s => s.signal_name).join(', ');
      parts.push(`Identified risk signals include: ${topRisk}.`);
    } else {
      parts.push('No severe risk indicators or negative pattern matches were detected at this time.');
    }

    if (entity.verification_status === 'verified') {
      parts.push('This entity holds a verified identity status backed by official documentation.');
    } else {
      parts.push('This entity has not yet completed formal identity verification.');
    }

    return parts.join(' ');
  }
}
