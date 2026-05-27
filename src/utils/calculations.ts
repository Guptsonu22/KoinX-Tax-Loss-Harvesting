import type { CapitalGains, ComputedGains, Holding } from '../types';

/**
 * Compute net and realised gains from raw capital gains data
 */
export function computeGains(gains: CapitalGains): ComputedGains {
  const stcgNet = gains.stcg.profits - gains.stcg.losses;
  const ltcgNet = gains.ltcg.profits - gains.ltcg.losses;

  return {
    stcg: { ...gains.stcg, net: stcgNet },
    ltcg: { ...gains.ltcg, net: ltcgNet },
    realisedGains: stcgNet + ltcgNet,
  };
}

/**
 * Apply selected holdings' gains to base capital gains to produce
 * the "after harvesting" capital gains values.
 *
 * Rules:
 * - If a holding's STCG gain > 0 → add to stcg.profits
 * - If a holding's STCG gain < 0 → add abs(gain) to stcg.losses
 * - Same logic for LTCG
 */
export function applyHarvesting(
  baseGains: CapitalGains,
  selectedHoldings: Holding[]
): CapitalGains {
  // Deep clone to avoid mutating original
  const updated: CapitalGains = {
    stcg: { profits: baseGains.stcg.profits, losses: baseGains.stcg.losses },
    ltcg: { profits: baseGains.ltcg.profits, losses: baseGains.ltcg.losses },
  };

  for (const holding of selectedHoldings) {
    // Apply STCG
    if (holding.stcg.gain > 0) {
      updated.stcg.profits += holding.stcg.gain;
    } else if (holding.stcg.gain < 0) {
      updated.stcg.losses += Math.abs(holding.stcg.gain);
    }

    // Apply LTCG
    if (holding.ltcg.gain > 0) {
      updated.ltcg.profits += holding.ltcg.gain;
    } else if (holding.ltcg.gain < 0) {
      updated.ltcg.losses += Math.abs(holding.ltcg.gain);
    }
  }

  return updated;
}

/**
 * Calculate tax savings (raw gain reduction, not tax-adjusted)
 */
export function calculateSavings(
  preGains: ComputedGains,
  postGains: ComputedGains
): number {
  return preGains.realisedGains - postGains.realisedGains;
}
