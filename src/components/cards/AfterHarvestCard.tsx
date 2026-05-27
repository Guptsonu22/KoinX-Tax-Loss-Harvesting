import { Sparkles, TrendingDown, Info, MousePointerClick } from 'lucide-react';
import type { ComputedGains } from '../../types';
import { formatINR } from '../../utils/formatters';
import { useHarvest } from '../../context/HarvestContext';

// ─── Gain Row ────────────────────────────────────────────────────────────────

interface GainRowProps {
  label: string;
  value: number;
  prevValue: number;
  highlight?: boolean;
}

function GainRow({ label, value, prevValue, highlight }: GainRowProps) {
  const isNegative = value < 0;
  const delta = value - prevValue;
  // Only show badge if the change is meaningful relative to the value
  const hasChanged = Math.abs(delta) > 0.0001;
  const wentUp = delta > 0;

  return (
    <div className={`flex items-center justify-between py-1 transition-all duration-200 ${highlight ? 'mt-1' : ''}`}>
      <span className={`text-sm ${highlight ? 'text-white/90 font-medium' : 'text-blue-200/60'}`}>
        {label}
      </span>
      <div className="flex items-center gap-2">
        {hasChanged && (
          <span className={`
            text-[10px] px-1.5 py-0.5 rounded font-bold leading-none tabular-nums
            transition-all duration-200
            ${wentUp ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}
          `}>
            {wentUp ? '▲' : '▼'} {formatINR(Math.abs(delta), { precise: true })}
          </span>
        )}
        <span className={`
          text-sm font-semibold tabular-nums transition-colors duration-200
          ${isNegative ? 'text-red-300' : 'text-white'}
        `}>
          {formatINR(value)}
        </span>
      </div>
    </div>
  );
}

// ─── Gain Section ────────────────────────────────────────────────────────────

interface SectionProps {
  title: string;
  profits: number;
  losses: number;
  net: number;
  prevProfits: number;
  prevLosses: number;
  prevNet: number;
}

function GainSection({ title, profits, losses, net, prevProfits, prevLosses, prevNet }: SectionProps) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-semibold text-blue-300/40 uppercase tracking-widest mb-3">
        {title}
      </p>
      <GainRow label="Profits" value={profits} prevValue={prevProfits} />
      <GainRow label="Losses" value={losses} prevValue={prevLosses} />
      <div className="pt-1.5 border-t border-white/10">
        <GainRow label="Net Capital Gains" value={net} prevValue={prevNet} highlight />
      </div>
    </div>
  );
}

// ─── After Harvest Card ──────────────────────────────────────────────────────

interface AfterHarvestCardProps {
  gains: ComputedGains;
  preGains: ComputedGains;
  savings: number;
  hasSavings: boolean;
}

export default function AfterHarvestCard({ gains, preGains, savings, hasSavings }: AfterHarvestCardProps) {
  const { state } = useHarvest();

  const hasSelections = state.selectedKeys.size > 0;
  const gainsIncreased = gains.realisedGains > preGains.realisedGains + 0.0001;
  const gainsDecreased = gains.realisedGains < preGains.realisedGains - 0.0001;
  const realisedDelta = gains.realisedGains - preGains.realisedGains;

  return (
    <div
      className="relative rounded-2xl overflow-hidden flex flex-col animate-fade-in transition-all duration-300 ease-in-out"
      style={{
        background: 'linear-gradient(150deg, #1c3f72 0%, #102e56 35%, #091d3e 75%, #060f25 100%)',
        border: '1px solid rgba(59, 130, 246, 0.25)',
      }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 40% at 20% 0%, rgba(59,130,246,0.18) 0%, transparent 70%)',
        }}
      />

      <div className="relative p-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-white font-semibold text-base">After Harvesting</h2>
            <span className={`
              text-[11px] px-2 py-0.5 rounded-full font-medium border
              transition-colors duration-300
              ${hasSelections
                ? 'text-blue-300 bg-blue-500/15 border-blue-500/25'
                : 'text-blue-400/50 bg-transparent border-blue-400/20'}
            `}>
              {hasSelections ? 'Live' : 'Preview'}
            </span>
          </div>
          {/* Selection count pill */}
          {hasSelections && (
            <span className="text-[11px] text-blue-300/70 tabular-nums">
              {state.selectedKeys.size} asset{state.selectedKeys.size !== 1 ? 's' : ''} selected
            </span>
          )}
        </div>

        {/* Short-term */}
        <GainSection
          title="Short-term gains"
          profits={gains.stcg.profits}   losses={gains.stcg.losses}   net={gains.stcg.net}
          prevProfits={preGains.stcg.profits} prevLosses={preGains.stcg.losses} prevNet={preGains.stcg.net}
        />

        <div className="border-t border-white/10" />

        {/* Long-term */}
        <GainSection
          title="Long-term gains"
          profits={gains.ltcg.profits}   losses={gains.ltcg.losses}   net={gains.ltcg.net}
          prevProfits={preGains.ltcg.profits} prevLosses={preGains.ltcg.losses} prevNet={preGains.ltcg.net}
        />

        {/* Realised Capital Gains */}
        <div
          className="rounded-xl p-4 transition-all duration-300"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-blue-200/80 text-sm">Realised Capital Gains</span>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              {/* Directional delta badge — precise for tiny values */}
              {gainsDecreased && (
                <span className="text-[11px] bg-green-500/20 text-green-300 px-2 py-0.5 rounded-lg font-semibold tabular-nums">
                  ↓ {formatINR(Math.abs(realisedDelta), { precise: true })} saved
                </span>
              )}
              {gainsIncreased && (
                <span className="text-[11px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded-lg font-semibold tabular-nums">
                  ↑ {formatINR(Math.abs(realisedDelta), { precise: true })} added
                </span>
              )}
              <span className={`font-bold text-lg tabular-nums transition-colors duration-300 ${
                gains.realisedGains < 0 ? 'text-red-300' : 'text-white'
              }`}>
                {formatINR(gains.realisedGains)}
              </span>
            </div>
          </div>
        </div>

        {/* ── No selection state ──────────────────────────────────────── */}
        {!hasSelections && (
          <div className="flex items-start gap-3 rounded-xl px-4 py-3.5 animate-fade-in"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.15)' }}
          >
            <MousePointerClick size={15} className="text-blue-300/50 flex-shrink-0 mt-0.5" />
            <p className="text-blue-200/50 text-xs leading-relaxed">
              Select loss-making assets from the table below to preview your potential tax savings.
              Look for the{' '}
              <span className="text-red-400 font-semibold">LOSS</span>
              {' '}badge.
            </p>
          </div>
        )}

        {/* ── Savings Banner ───────────────────────────────────────────── */}
        {hasSavings && (
          <div className="flex items-start gap-3 rounded-xl px-4 py-3.5 animate-fade-in
            transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.15)]"
            style={{ background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.28)' }}
          >
            <div className="p-1.5 bg-green-500/20 rounded-lg flex-shrink-0 mt-0.5">
              <TrendingDown size={15} className="text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-green-200 text-sm font-semibold leading-snug">
                You're going to save{' '}
                {/* Use precise formatting so tiny savings like ₹0.00307 display correctly */}
                <span className="text-green-100 font-bold">
                  {formatINR(savings, { precise: true })}
                </span>
              </p>
              <p className="text-green-400/60 text-xs mt-1">
                in realised capital gains by harvesting selected losses
              </p>
            </div>
            <Sparkles size={15} className="text-green-400 flex-shrink-0 mt-0.5 animate-pulse" />
          </div>
        )}

        {/* ── Gains increased warning ───────────────────────────────────── */}
        {gainsIncreased && (
          <div className="flex items-start gap-3 rounded-xl px-4 py-3 animate-fade-in"
            style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.18)' }}
          >
            <Info size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-amber-300/70 text-xs leading-relaxed">
              Selecting profitable assets increases your taxable gains. For tax savings, choose assets
              with the{' '}
              <span className="font-semibold text-red-400">LOSS</span>
              {' '}badge in the table below.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
