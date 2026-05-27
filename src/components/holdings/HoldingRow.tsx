import { useState } from 'react';
import type { Holding } from '../../types';
import { formatINR, formatHolding, formatPrice, getHoldingKey, isLossHarvestable } from '../../utils/formatters';
import { useHarvest } from '../../context/HarvestContext';

interface HoldingRowProps {
  holding: Holding;
  index: number;
}

// ─── Gain Cell ────────────────────────────────────────────────────────────────

function GainCell({ gain, balance }: { gain: number; balance: number }) {
  const isPositive = gain > 0.001;
  const isNegative = gain < -0.001;
  const isEmpty = !isPositive && !isNegative && balance === 0;

  if (isEmpty) return <span className="text-kx-subtle text-sm">—</span>;

  return (
    <div className="space-y-0.5">
      <p className={`text-sm font-semibold tabular-nums transition-colors duration-200 ${
        isNegative ? 'text-kx-red' : isPositive ? 'text-kx-green' : 'text-kx-muted'
      }`}>
        {!isPositive && !isNegative ? '₹0.00' : formatINR(gain)}
      </p>
      {balance > 0 && (
        <p className="text-xs text-kx-subtle tabular-nums">
          {formatHolding(balance)} coins
        </p>
      )}
    </div>
  );
}

// ─── Desktop Row ──────────────────────────────────────────────────────────────

export default function HoldingRow({ holding, index }: HoldingRowProps) {
  const { state, toggleHolding } = useHarvest();
  const [imgError, setImgError] = useState(false);

  const key = getHoldingKey(holding);
  const isSelected = state.selectedKeys.has(key);
  const isHarvestable = isLossHarvestable(holding);
  const useInitials = holding.logo.includes('DefaultCoin') || imgError;

  return (
    <tr
      onClick={() => toggleHolding(key)}
      className={`
        border-b border-kx-border/60 last:border-0 cursor-pointer
        transition-all duration-200 hover:scale-[1.002] active:scale-[0.998] group
        ${isSelected
          ? 'bg-blue-500/10 ring-inset ring-1 ring-blue-500/20 hover:bg-blue-500/[0.13]'
          : 'hover:bg-[#111c35]'}
      `}
      style={{ animationDelay: `${index * 0.04}s` }}
      aria-selected={isSelected}
    >
      {/* Checkbox */}
      <td className="pl-5 pr-2 py-3.5 w-12">
        <div
          className={`
            w-4 h-4 rounded border-[1.5px] flex items-center justify-center
            transition-all duration-200 flex-shrink-0
            ${isSelected
              ? 'bg-kx-blue border-kx-blue scale-105'
              : 'border-kx-border group-hover:border-kx-muted bg-transparent'}
          `}
          aria-label={`${isSelected ? 'Deselect' : 'Select'} ${holding.coinName}`}
        >
          {isSelected && (
            <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
              <path d="M1 3.5L3.2 5.5L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
      </td>

      {/* Asset info */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3 min-w-0">
          {/* Logo */}
          <div className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden bg-kx-border/80 flex items-center justify-center ring-1 ring-kx-border">
            {useInitials ? (
              <span className="text-[11px] font-bold text-kx-muted">
                {holding.coin.replace('$', '').slice(0, 2).toUpperCase()}
              </span>
            ) : (
              <img
                src={holding.logo}
                alt={holding.coin}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
                loading="lazy"
              />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-white text-sm font-semibold">{holding.coin}</p>
              {isHarvestable && (
                <span className="text-[10px] font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-1.5 py-px rounded-full leading-none">
                  LOSS
                </span>
              )}
            </div>
            <p className="text-kx-subtle text-xs truncate max-w-[150px] mt-0.5" title={holding.coinName}>
              {holding.coinName}
            </p>
          </div>
        </div>
      </td>

      {/* Holdings / Avg Buy Price */}
      <td className="px-4 py-3.5">
        <p className="text-white text-sm font-medium tabular-nums">{formatHolding(holding.totalHolding)}</p>
        <p className="text-kx-subtle text-xs tabular-nums mt-0.5">{formatPrice(holding.averageBuyPrice)}</p>
      </td>

      {/* Current Price */}
      <td className="px-4 py-3.5">
        <p className="text-white text-sm font-medium tabular-nums">{formatPrice(holding.currentPrice)}</p>
      </td>

      {/* Short-Term Gain */}
      <td className="px-4 py-3.5">
        <GainCell gain={holding.stcg.gain} balance={holding.stcg.balance} />
      </td>

      {/* Long-Term Gain */}
      <td className="px-4 py-3.5">
        <GainCell gain={holding.ltcg.gain} balance={holding.ltcg.balance} />
      </td>

      {/* Amount to Sell */}
      <td className="px-4 py-3.5">
        {isSelected ? (
          <div className="inline-flex items-center gap-1.5 bg-blue-500/15 border border-blue-500/30 rounded-lg px-2.5 py-1 transition-all duration-200">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-300 text-xs font-semibold tabular-nums">
              {formatHolding(holding.totalHolding)}
            </span>
          </div>
        ) : (
          <span className="text-kx-subtle/50 text-sm">—</span>
        )}
      </td>
    </tr>
  );
}

// ─── Mobile Card ──────────────────────────────────────────────────────────────

export function MobileHoldingCard({ holding, index }: HoldingRowProps) {
  const { state, toggleHolding } = useHarvest();
  const [imgError, setImgError] = useState(false);

  const key = getHoldingKey(holding);
  const isSelected = state.selectedKeys.has(key);
  const isHarvestable = isLossHarvestable(holding);
  const useInitials = holding.logo.includes('DefaultCoin') || imgError;

  const hasStcg = Math.abs(holding.stcg.gain) > 0.001;
  const hasLtcg = Math.abs(holding.ltcg.gain) > 0.001 || holding.ltcg.balance > 0;

  return (
    <div
      onClick={() => toggleHolding(key)}
      className={`
        rounded-xl border p-4 cursor-pointer
        transition-all duration-200 hover:scale-[1.002] active:scale-[0.99]
        ${isSelected
          ? 'border-blue-500/40 bg-blue-500/10 shadow-[0_0_0_1px_rgba(59,130,246,0.2)]'
          : 'border-kx-border hover:border-kx-border-light hover:bg-[#111c35]'}
      `}
      style={{ animationDelay: `${index * 0.04}s` }}
      aria-selected={isSelected}
    >
      {/* Top Row: Logo + Name + Checkbox */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden bg-kx-border flex items-center justify-center ring-1 ring-kx-border">
            {useInitials ? (
              <span className="text-xs font-bold text-kx-muted">
                {holding.coin.replace('$', '').slice(0, 2).toUpperCase()}
              </span>
            ) : (
              <img src={holding.logo} alt={holding.coin}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)} loading="lazy"
              />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-sm">{holding.coin}</span>
              {isHarvestable && (
                <span className="text-[10px] font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-1.5 py-px rounded-full">
                  LOSS
                </span>
              )}
            </div>
            <p className="text-kx-subtle text-xs truncate max-w-[180px] mt-0.5">{holding.coinName}</p>
          </div>
        </div>

        {/* Checkbox */}
        <div className={`w-5 h-5 rounded border-[1.5px] flex items-center justify-center flex-shrink-0 transition-all duration-200
          ${isSelected ? 'bg-kx-blue border-kx-blue' : 'border-kx-border bg-transparent'}`}
        >
          {isSelected && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <div>
          <p className="text-kx-subtle text-[11px] mb-1 uppercase tracking-wide">Holdings</p>
          <p className="text-white text-sm font-medium tabular-nums">{formatHolding(holding.totalHolding)}</p>
          <p className="text-kx-subtle text-xs mt-0.5 tabular-nums">{formatPrice(holding.averageBuyPrice)}</p>
        </div>
        <div>
          <p className="text-kx-subtle text-[11px] mb-1 uppercase tracking-wide">Current Price</p>
          <p className="text-white text-sm font-medium tabular-nums">{formatPrice(holding.currentPrice)}</p>
        </div>
        {hasStcg && (
          <div>
            <p className="text-kx-subtle text-[11px] mb-1 uppercase tracking-wide">Short-Term</p>
            <p className={`text-sm font-semibold tabular-nums ${
              holding.stcg.gain < -0.001 ? 'text-kx-red' : 'text-kx-green'
            }`}>
              {formatINR(holding.stcg.gain)}
            </p>
            {holding.stcg.balance > 0 && (
              <p className="text-kx-subtle text-xs">{formatHolding(holding.stcg.balance)} coins</p>
            )}
          </div>
        )}
        {hasLtcg && (
          <div>
            <p className="text-kx-subtle text-[11px] mb-1 uppercase tracking-wide">Long-Term</p>
            <p className={`text-sm font-semibold tabular-nums ${
              holding.ltcg.gain < -0.001 ? 'text-kx-red' : 'text-kx-green'
            }`}>
              {holding.ltcg.gain !== 0 ? formatINR(holding.ltcg.gain) : '₹0.00'}
            </p>
            {holding.ltcg.balance > 0 && (
              <p className="text-kx-subtle text-xs">{formatHolding(holding.ltcg.balance)} coins</p>
            )}
          </div>
        )}
      </div>

      {/* Amount to Sell (only when selected) */}
      {isSelected && (
        <div className="mt-3 pt-3 border-t border-blue-500/20 flex items-center justify-between">
          <span className="text-blue-300/70 text-xs">Amount to Sell</span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-300 text-xs font-semibold tabular-nums">
              {formatHolding(holding.totalHolding)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
