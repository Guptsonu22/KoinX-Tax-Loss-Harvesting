/**
 * Format a number as Indian Rupee currency.
 *
 * @param value   The numeric value to format
 * @param options precise: true → shows meaningful decimals for sub-₹1 values (e.g. savings)
 *                showSign: true → prefix positive values with '+'
 */
export function formatINR(
  value: number,
  options?: { showSign?: boolean; precise?: boolean }
): string {
  const absValue = Math.abs(value);

  // Handle tiny values that round to zero first to avoid signs like -₹0.00 or +₹0.00
  if (!options?.precise && absValue < 0.01) {
    return '₹0.00';
  }

  if (options?.precise && absValue < 0.01) {
    const formattedVal = absValue.toFixed(4);
    if (parseFloat(formattedVal) === 0) {
      return '₹0.00';
    }
    const sign = value < 0 ? '-' : options?.showSign && value > 0 ? '+' : '';
    return `${sign}₹${formattedVal}`;
  }

  const sign = value < 0 ? '-' : options?.showSign && value > 0 ? '+' : '';

  if (options?.precise && absValue < 100) {
    // 1–100 range: show 2 decimals
    return `${sign}₹${absValue.toFixed(2)}`;
  }

  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(absValue);

  return `${sign}₹${formatted}`;
}


/**
 * Format a crypto holding amount for display.
 * No scientific notation — always human-readable.
 */
export function formatHolding(value: number): string {
  if (value === 0) return '0';
  const absValue = Math.abs(value);

  if (absValue < 1e-6) return '~0';
  if (absValue >= 1_000_000) {
    return `${(value / 1_000_000).toLocaleString('en-IN', { maximumFractionDigits: 2 })}M`;
  }
  if (absValue >= 1_000) {
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 4 }).format(value);
  }
  if (absValue >= 0.01) {
    return value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 6 });
  }
  return value.toPrecision(4);
}

/**
 * Format price in INR with appropriate decimal places.
 */
export function formatPrice(value: number): string {
  if (value === 0) return '₹0';
  const absValue = Math.abs(value);

  if (absValue < 0.0001) return `₹${value.toPrecision(3)}`;
  if (absValue < 1) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 4,
      maximumFractionDigits: 6,
    }).format(value);
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Generate a unique key for a holding (handles duplicate coin symbols like USDC).
 */
export function getHoldingKey(holding: { coin: string; coinName: string }): string {
  return `${holding.coin}-${holding.coinName}`;
}

/**
 * Determine if a holding is a loss candidate — good for tax-loss harvesting.
 */
export function isLossHarvestable(
  holding: { stcg: { gain: number }; ltcg: { gain: number } }
): boolean {
  return holding.stcg.gain < -0.001 || holding.ltcg.gain < -0.001;
}

/**
 * Compute the net gain/loss impact of a set of selected holdings.
 * A negative result means selecting these will reduce taxable gains.
 */
export function netHarvestImpact(
  holdings: { stcg: { gain: number }; ltcg: { gain: number } }[]
): number {
  return holdings.reduce((sum, h) => sum + h.stcg.gain + h.ltcg.gain, 0);
}
