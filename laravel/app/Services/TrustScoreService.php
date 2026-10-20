<?php

namespace App\Services;

use App\Models\Entity;
use App\Models\TrustScore;
use Illuminate\Support\Collection;

class TrustScoreService
{
    /**
     * Calculate Trust Score (0-100) and assign non-judgmental risk classification.
     */
    public function calculateScore(Entity $entity, Collection $riskSignals, Collection $trustSignals): TrustScore
    {
        $baseScore = 50;
        $riskDeduction = 0;

        foreach ($riskSignals as $signal) {
            switch ($signal->severity) {
                case 'critical': $riskDeduction += 30; break;
                case 'high': $riskDeduction += 20; break;
                case 'medium': $riskDeduction += 10; break;
                case 'low': $riskDeduction += 5; break;
                default: $riskDeduction += 1; break;
            }
        }

        $trustAddition = 0;
        foreach ($trustSignals as $signal) {
            switch ($signal->significance) {
                case 'high': $trustAddition += 25; break;
                case 'medium': $trustAddition += 15; break;
                default: $trustAddition += 10; break;
            }
        }

        if ($entity->verification_status === 'verified') {
            $trustAddition += 20;
        }

        $finalScore = min(100, max(0, (int)round($baseScore + $trustAddition - $riskDeduction)));
        $riskLevel = $this->determineRiskClassification($entity, $finalScore, $riskSignals, $trustSignals);

        $explanation = "Calculated overall Trust Index of {$finalScore}/100 resulting in a classification of \"{$riskLevel}\".";

        return new TrustScore([
            'entity_id' => $entity->id,
            'score' => $finalScore,
            'risk_level' => $riskLevel,
            'trust_signals_count' => $trustSignals->count(),
            'risk_signals_count' => $riskSignals->count(),
            'confidence' => ($riskSignals->count() + $trustSignals->count() >= 3) ? 85 : 60,
            'score_explanation' => $explanation,
            'calculated_date' => now(),
        ]);
    }

    private function determineRiskClassification(Entity $entity, int $score, Collection $riskSignals, Collection $trustSignals): string
    {
        $hasCriticalRisk = $riskSignals->contains('severity', 'critical');
        if ($entity->verification_status === 'verified' && $score >= 85) return 'Verified Identity';
        if ($score >= 85) return 'Strong Trust Signals';
        if ($score >= 70) return 'Generally Low Risk';
        if ($score >= 50) return 'Moderate Risk';
        if ($score < 30 || $hasCriticalRisk) return 'Suspicious';
        if ($score >= 30) return 'High Risk';
        return 'Limited Verification';
    }
}
