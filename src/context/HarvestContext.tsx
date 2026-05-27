import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from 'react';
import type { Holding, CapitalGains } from '../types';
import { fetchHoldings, fetchCapitalGains } from '../services/api';
import { getHoldingKey } from '../utils/formatters';

// ─── State ────────────────────────────────────────────────────────────────────

interface HarvestState {
  holdings: Holding[];
  capitalGains: CapitalGains | null;
  selectedKeys: Set<string>;
  loadingHoldings: boolean;
  loadingGains: boolean;
  error: string | null;
}

const initialState: HarvestState = {
  holdings: [],
  capitalGains: null,
  selectedKeys: new Set(),
  loadingHoldings: true,
  loadingGains: true,
  error: null,
};

// ─── Actions ──────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_HOLDINGS'; payload: Holding[] }
  | { type: 'SET_CAPITAL_GAINS'; payload: CapitalGains }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'TOGGLE_HOLDING'; payload: string }
  | { type: 'SELECT_ALL' }
  | { type: 'DESELECT_ALL' };

function reducer(state: HarvestState, action: Action): HarvestState {
  switch (action.type) {
    case 'SET_HOLDINGS':
      return { ...state, holdings: action.payload, loadingHoldings: false };

    case 'SET_CAPITAL_GAINS':
      return { ...state, capitalGains: action.payload, loadingGains: false };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loadingHoldings: false,
        loadingGains: false,
      };

    case 'TOGGLE_HOLDING': {
      const newKeys = new Set(state.selectedKeys);
      if (newKeys.has(action.payload)) {
        newKeys.delete(action.payload);
      } else {
        newKeys.add(action.payload);
      }
      return { ...state, selectedKeys: newKeys };
    }

    case 'SELECT_ALL': {
      const allKeys = new Set(state.holdings.map(getHoldingKey));
      return { ...state, selectedKeys: allKeys };
    }

    case 'DESELECT_ALL':
      return { ...state, selectedKeys: new Set() };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface HarvestContextValue {
  state: HarvestState;
  toggleHolding: (key: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  selectedHoldings: Holding[];
}

const HarvestContext = createContext<HarvestContextValue | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function HarvestProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // Fetch both APIs in parallel
    Promise.all([fetchHoldings(), fetchCapitalGains()])
      .then(([holdings, gainsResponse]) => {
        // Sort: loss assets bubble to the top (best for harvesting),
        // then by absolute short-term gain descending for easy scanning
        const sorted = [...holdings].sort((a, b) => {
          const aIsLoss = a.stcg.gain < -0.001 || a.ltcg.gain < -0.001;
          const bIsLoss = b.stcg.gain < -0.001 || b.ltcg.gain < -0.001;
          if (aIsLoss && !bIsLoss) return -1;
          if (!aIsLoss && bIsLoss) return 1;
          return Math.abs(b.stcg.gain) - Math.abs(a.stcg.gain);
        });
        dispatch({ type: 'SET_HOLDINGS', payload: sorted });
        dispatch({ type: 'SET_CAPITAL_GAINS', payload: gainsResponse.capitalGains });
      })
      .catch((err: Error) => {
        dispatch({ type: 'SET_ERROR', payload: err.message });
      });
  }, []);

  const toggleHolding = (key: string) =>
    dispatch({ type: 'TOGGLE_HOLDING', payload: key });

  const selectAll = () => dispatch({ type: 'SELECT_ALL' });
  const deselectAll = () => dispatch({ type: 'DESELECT_ALL' });

  const isAllSelected =
    state.holdings.length > 0 &&
    state.selectedKeys.size === state.holdings.length;

  const isIndeterminate =
    state.selectedKeys.size > 0 &&
    state.selectedKeys.size < state.holdings.length;

  const selectedHoldings = state.holdings.filter((h) =>
    state.selectedKeys.has(getHoldingKey(h))
  );

  return (
    <HarvestContext.Provider
      value={{
        state,
        toggleHolding,
        selectAll,
        deselectAll,
        isAllSelected,
        isIndeterminate,
        selectedHoldings,
      }}
    >
      {children}
    </HarvestContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useHarvest(): HarvestContextValue {
  const ctx = useContext(HarvestContext);
  if (!ctx) {
    throw new Error('useHarvest must be used within a HarvestProvider');
  }
  return ctx;
}
