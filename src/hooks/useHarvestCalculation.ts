import { useMemo } from 'react';
import { useHarvest } from '../context/HarvestContext';
import { applyHarvesting, computeGains, calculateSavings } from '../utils/calculations';
import type { ComputedGains } from '../types';

interface HarvestCalculation {
  preGains: ComputedGains | null;
  postGains: ComputedGains | null;
  savings: number;
  hasSavings: boolean;
}

/**
 * Derives the "after harvesting" capital gains state based on
 * the currently selected holdings.
 */
export function useHarvestCalculation(): HarvestCalculation {
  const { state, selectedHoldings } = useHarvest();

  return useMemo(() => {
    if (!state.capitalGains) {
      return { preGains: null, postGains: null, savings: 0, hasSavings: false };
    }

    const preGains = computeGains(state.capitalGains);
    const afterHarvestBase = applyHarvesting(state.capitalGains, selectedHoldings);
    const postGains = computeGains(afterHarvestBase);
    const savings = calculateSavings(preGains, postGains);

    return {
      preGains,
      postGains,
      savings,
      hasSavings: savings > 0,
    };
  }, [state.capitalGains, selectedHoldings]);
}
