import { useState } from 'react';
import { ChevronDown, Info } from 'lucide-react';

const disclaimerPoints = [
  {
    icon: '⚠️',
    text: 'Tax loss harvesting is the practice of selling assets at a loss to offset capital gains tax liability. This can reduce your overall taxable income.',
  },
  {
    icon: '📊',
    text: 'This tool provides an estimate only. Actual tax savings may differ based on your jurisdiction, applicable tax laws, and personal tax situation.',
  },
  {
    icon: '💱',
    text: 'Price data may differ slightly from other sources such as CoinGecko due to timing. Always verify current prices before making trading decisions.',
  },
  {
    icon: '⚖️',
    text: 'Wash-sale rules and other regulations may apply in your jurisdiction. Consult a qualified tax professional before taking action.',
  },
  {
    icon: '🔒',
    text: 'Past performance and tax estimates are not indicative of future results. This tool is for informational purposes only and does not constitute financial or tax advice.',
  },
];

export default function Disclaimer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-xl border border-kx-border overflow-hidden transition-all duration-300"
      style={{ background: 'rgba(15,25,35,0.8)' }}
    >
      <button
        onClick={() => setIsOpen(p => !p)}
        className="w-full flex items-center justify-between px-5 py-4 text-left
          hover:bg-white/[0.025] transition-colors duration-200 group"
        aria-expanded={isOpen}
        id="disclaimer-toggle"
        aria-controls="disclaimer-content"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-amber-500/10 rounded-lg ring-1 ring-amber-500/20">
            <Info size={15} className="text-amber-400" />
          </div>
          <div>
            <span className="text-kx-text font-medium text-sm">Important Notes &amp; Disclaimers</span>
            {!isOpen && (
              <span className="ml-2 text-[11px] text-kx-subtle">Click to expand</span>
            )}
          </div>
        </div>
        <ChevronDown
          size={17}
          className={`text-kx-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Animated body */}
      <div
        id="disclaimer-content"
        role="region"
        aria-labelledby="disclaimer-toggle"
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 pb-5">
          <div className="border-t border-kx-border pt-4">
            <ul className="space-y-3">
              {disclaimerPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-base flex-shrink-0 mt-0.5">{point.icon}</span>
                  <p className="text-kx-muted text-xs leading-relaxed">{point.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
