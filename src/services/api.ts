import type { Holding, CapitalGainsResponse } from '../types';
import { holdingsData } from '../data/holdings';
import { capitalGainsData } from '../data/capitalGains';

/**
 * Mock API: Fetches holdings data
 * Simulates a 900ms network delay
 */
export const fetchHoldings = (): Promise<Holding[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate occasional network error (5% chance) — disabled for demo
      const simulateError = false;
      if (simulateError) {
        reject(new Error('Failed to fetch holdings. Please try again.'));
        return;
      }
      resolve(holdingsData);
    }, 900);
  });
};

/**
 * Mock API: Fetches capital gains data
 * Simulates a 700ms network delay
 */
export const fetchCapitalGains = (): Promise<CapitalGainsResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(capitalGainsData);
    }, 700);
  });
};
