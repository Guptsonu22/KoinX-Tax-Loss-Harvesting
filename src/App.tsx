import { AlertTriangle } from 'lucide-react';
import Header from './components/layout/Header';
import Disclaimer from './components/common/Disclaimer';
import PreHarvestCard from './components/cards/PreHarvestCard';
import AfterHarvestCard from './components/cards/AfterHarvestCard';
import HoldingsTable from './components/holdings/HoldingsTable';
import { CardSkeleton } from './components/common/Loader';
import { HarvestProvider, useHarvest } from './context/HarvestContext';
import { useHarvestCalculation } from './hooks/useHarvestCalculation';

// ─── Inner content (needs to be inside HarvestProvider) ──────────────────────

function TaxHarvestingContent() {
  const { state } = useHarvest();
  const { preGains, postGains, savings, hasSavings } = useHarvestCalculation();

  const isLoading = state.loadingHoldings || state.loadingGains;
  const fatalError = !!state.error && !state.capitalGains;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">

      {/* Page subtitle — mobile only */}
      <div className="sm:hidden">
        <p className="text-kx-muted text-sm">Optimise your crypto tax liability</p>
      </div>

      {/* Disclaimer */}
      <Disclaimer />

      {/* Capital Gains Cards */}
      {fatalError ? (
        <div className="bg-kx-card border border-kx-border rounded-2xl p-10 flex flex-col items-center gap-3 text-center">
          <div className="p-3 bg-red-500/10 rounded-full">
            <AlertTriangle size={22} className="text-kx-red" />
          </div>
          <p className="text-white font-medium">Failed to load capital gains</p>
          <p className="text-kx-muted text-sm max-w-xs">{state.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-kx-blue hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading || !preGains ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : (
            <>
              <PreHarvestCard gains={preGains} />
              <AfterHarvestCard
                gains={postGains!}
                preGains={preGains}
                savings={savings}
                hasSavings={hasSavings}
              />
            </>
          )}
        </div>
      )}

      {/* Holdings Table */}
      <HoldingsTable />
    </main>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <HarvestProvider>
      <div className="min-h-screen bg-kx-dark font-inter text-kx-text">
        <Header />
        <TaxHarvestingContent />

        {/* Footer */}
        <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-6">
          <div className="border-t border-kx-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-kx-muted text-xs">
              © 2025 KoinX · Tax Loss Harvesting Tool
            </p>
            <p className="text-kx-muted/80 text-xs">
              Built for KoinX Frontend Internship Assignment · For informational purposes only
            </p>
          </div>
        </footer>
      </div>
    </HarvestProvider>
  );
}
