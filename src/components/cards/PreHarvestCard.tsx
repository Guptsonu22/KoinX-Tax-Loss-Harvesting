import type { ComputedGains } from '../../types';
import { formatINR } from '../../utils/formatters';

interface GainRowProps {
  label: string;
  value: number;
  highlight?: boolean;
}

function GainRow({ label, value, highlight }: GainRowProps) {
  const isNegative = value < 0;
  return (
    <div className={`flex items-center justify-between py-1 ${highlight ? 'mt-1' : ''}`}>
      <span className={`text-sm ${highlight ? 'text-kx-text font-medium' : 'text-kx-muted'}`}>
        {label}
      </span>
      <span className={`text-sm font-semibold tabular-nums ${
        isNegative ? 'text-kx-red' : highlight ? 'text-white' : 'text-kx-text'
      }`}>
        {formatINR(value)}
      </span>
    </div>
  );
}

interface SectionProps {
  title: string;
  profits: number;
  losses: number;
  net: number;
}

function GainSection({ title, profits, losses, net }: SectionProps) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-semibold text-kx-subtle uppercase tracking-widest mb-3">
        {title}
      </p>
      <GainRow label="Profits" value={profits} />
      <GainRow label="Losses" value={losses} />
      <div className="pt-1.5 border-t border-white/10">
        <GainRow label="Net Capital Gains" value={net} highlight />
      </div>
    </div>
  );
}

interface PreHarvestCardProps {
  gains: ComputedGains;
}

export default function PreHarvestCard({ gains }: PreHarvestCardProps) {
  return (
    <div className="bg-[#0c1520] border border-kx-border rounded-2xl p-6 flex flex-col gap-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2">
        <h2 className="text-white font-semibold text-base">Pre-Harvesting</h2>
        <span className="text-[11px] text-kx-muted bg-kx-border/60 border border-kx-border px-2 py-0.5 rounded-full font-medium">
          Current
        </span>
      </div>

      {/* Short-term */}
      <GainSection
        title="Short-term gains"
        profits={gains.stcg.profits}
        losses={gains.stcg.losses}
        net={gains.stcg.net}
      />

      <div className="border-t border-white/10" />

      {/* Long-term */}
      <GainSection
        title="Long-term gains"
        profits={gains.ltcg.profits}
        losses={gains.ltcg.losses}
        net={gains.ltcg.net}
      />

      {/* Realised Capital Gains */}
      <div className="bg-kx-border/20 border border-kx-border/60 rounded-xl p-4 mt-1">
        <div className="flex items-center justify-between">
          <span className="text-kx-muted text-sm">Realised Capital Gains</span>
          <span className={`font-bold text-lg tabular-nums ${
            gains.realisedGains < 0 ? 'text-kx-red' : 'text-white'
          }`}>
            {formatINR(gains.realisedGains)}
          </span>
        </div>
      </div>
    </div>
  );
}
