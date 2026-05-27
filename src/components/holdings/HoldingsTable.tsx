import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { useHarvest } from '../../context/HarvestContext';
import { TableSkeleton } from '../common/Loader';
import HoldingRow, { MobileHoldingCard } from './HoldingRow';
import { formatINR, netHarvestImpact } from '../../utils/formatters';

const INITIAL_ROWS = 10;

export default function HoldingsTable() {
  const { state, selectedHoldings, selectAll, deselectAll, isAllSelected, isIndeterminate } = useHarvest();
  const [showAll, setShowAll] = useState(false);

  // ── Net harvest impact (memoized) ─────────────────────────────────────────
  const netImpact = useMemo(() => netHarvestImpact(selectedHoldings), [selectedHoldings]);
  const isNetLoss  = netImpact < -0.0001;
  const isNetGain  = netImpact >  0.0001;

  // ── Loading / error ───────────────────────────────────────────────────────
  if (state.loadingHoldings) return <TableSkeleton />;

  if (state.error) {
    return (
      <div className="bg-kx-card border border-kx-border rounded-2xl p-10 flex flex-col items-center gap-4">
        <div className="p-3 bg-red-500/10 rounded-full">
          <AlertTriangle size={24} className="text-kx-red" />
        </div>
        <div className="text-center">
          <p className="text-white font-medium mb-1">Failed to Load Holdings</p>
          <p className="text-kx-muted text-sm">{state.error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-kx-blue hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  const holdings = state.holdings;
  const displayed = showAll ? holdings : holdings.slice(0, INITIAL_ROWS);
  const hasMore = holdings.length > INITIAL_ROWS;
  const selCount = state.selectedKeys.size;

  const handleSelectAll = () => (isAllSelected ? deselectAll() : selectAll());

  // ── Shared checkbox ───────────────────────────────────────────────────────
  const SelectAllCheckbox = () => (
    <button
      onClick={(e) => { e.stopPropagation(); handleSelectAll(); }}
      className={`w-4 h-4 rounded border-[1.5px] flex items-center justify-center
        transition-all duration-200 flex-shrink-0
        ${isAllSelected || isIndeterminate
          ? 'bg-kx-blue border-kx-blue scale-105'
          : 'border-kx-border hover:border-kx-muted bg-transparent'}`}
      aria-label={isAllSelected ? 'Deselect all holdings' : 'Select all holdings'}
    >
      {isAllSelected && (
        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
          <path d="M1 3.5L3.2 5.5L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      {isIndeterminate && !isAllSelected && (
        <div className="w-2 h-0.5 bg-white rounded" />
      )}
    </button>
  );

  return (
    <div className="bg-kx-card border border-kx-border rounded-2xl overflow-hidden animate-fade-in">

      {/* ── Card Header ─────────────────────────────────────────────────── */}
      <div className="px-6 py-4 border-b border-kx-border flex items-start sm:items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-white font-semibold text-base">Holdings</h3>
          {/* Summary row */}
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <p className="text-kx-subtle text-xs">{holdings.length} assets</p>

            {selCount > 0 && (
              <>
                <span className="text-kx-border">·</span>
                <span className="text-blue-400 text-xs font-medium tabular-nums">
                  {selCount} selected
                </span>
                {/* Net impact badge */}
                {isNetLoss && (
                  <span className="text-[11px] font-semibold tabular-nums
                    text-green-300 bg-green-500/10 border border-green-500/20
                    px-2 py-0.5 rounded-full">
                    🎯 Harvesting Loss: {formatINR(Math.abs(netImpact), { precise: true })}
                  </span>
                )}
                {isNetGain && (
                  <span className="text-[11px] font-semibold tabular-nums
                    text-amber-300 bg-amber-500/10 border border-amber-500/20
                    px-2 py-0.5 rounded-full">
                    ⚠️ Net Gain: {formatINR(netImpact, { precise: true })}
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Hint chip */}
          <span className="hidden md:inline-flex items-center gap-1.5 text-[11px]
            text-amber-400/80 bg-amber-500/8 border border-amber-500/15
            rounded-full px-2.5 py-1">
            💡 Select <span className="text-red-400 font-semibold">LOSS</span> assets to reduce taxes
          </span>
          {selCount > 0 && (
            <button
              onClick={deselectAll}
              className="text-xs text-kx-blue hover:text-blue-400 transition-colors font-medium whitespace-nowrap"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* DESKTOP TABLE (md and above)                                     */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[860px]">
          {/* Sticky header with backdrop-blur */}
          <thead className="sticky top-0 z-10 backdrop-blur-sm" style={{ background: 'rgba(11,18,32,0.92)' }}>
            <tr className="border-b border-kx-border">
              <th className="pl-5 pr-2 py-3 w-12">
                <div className="flex items-center justify-center">
                  <SelectAllCheckbox />
                </div>
              </th>
              {[
                { label: 'Asset', cls: 'px-4 min-w-[190px]' },
                { label: 'Holdings\nAvg Buy Price', cls: 'px-4 min-w-[130px]' },
                { label: 'Current Price', cls: 'px-4 min-w-[120px]' },
                { label: 'Short-Term Gain', cls: 'px-4 min-w-[145px]' },
                { label: 'Long-Term Gain', cls: 'px-4 min-w-[145px]' },
                { label: 'Amount to Sell', cls: 'px-4 min-w-[130px]' },
              ].map(({ label, cls }, i) => (
                <th key={i} className={`${cls} py-3 text-left`}>
                  <span className="text-kx-subtle text-[11px] font-semibold uppercase tracking-wider whitespace-pre-line leading-tight">
                    {label}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {displayed.map((h, idx) => (
              <HoldingRow
                key={`${h.coin}-${h.coinName}-${idx}`}
                holding={h}
                index={idx}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* MOBILE CARDS                                                     */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="md:hidden">
        {/* Mobile select-all + hint */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-kx-border"
          style={{ background: 'rgba(11,18,32,0.92)' }}>
          <button
            onClick={handleSelectAll}
            className="flex items-center gap-2.5 text-sm text-kx-muted hover:text-white transition-colors"
          >
            <SelectAllCheckbox />
            <span>{isAllSelected ? 'Deselect All' : 'Select All'}</span>
          </button>
          {selCount > 0 && (
            <button onClick={deselectAll} className="text-xs text-kx-blue font-medium">
              Clear all
            </button>
          )}
        </div>

        {/* Mobile hint */}
        <div className="mx-4 mt-3 mb-1 flex items-center gap-1.5 text-[11px] text-amber-400/70">
          <span>💡</span>
          <span>Select <span className="text-red-400 font-semibold">LOSS</span> assets to reduce your tax</span>
        </div>

        <div className="p-4 space-y-3">
          {displayed.map((h, idx) => (
            <MobileHoldingCard
              key={`mob-${h.coin}-${h.coinName}-${idx}`}
              holding={h}
              index={idx}
            />
          ))}
        </div>
      </div>

      {/* ── View All / Less Toggle ─────────────────────────────────────── */}
      {hasMore && (
        <div className="border-t border-kx-border px-6 py-3.5 flex items-center justify-center">
          <button
            onClick={() => setShowAll(p => !p)}
            className="flex items-center gap-2 text-kx-blue hover:text-blue-400
              transition-colors duration-200 text-sm font-medium py-1.5 px-4
              rounded-xl hover:bg-blue-500/10"
          >
            {showAll ? (
              <>
                <ChevronUp size={15} />
                <span>Show Less</span>
              </>
            ) : (
              <>
                <ChevronDown size={15} />
                <span>View All {holdings.length} Assets</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
