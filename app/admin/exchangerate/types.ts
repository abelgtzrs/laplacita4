/**
 * Type definitions for the Exchange Rate feature.
 * 
 * DEVELOPER NOTES:
 * These types are central to the application state.
 * - RateErrors: Maps a bank name to an error message string.
 * - Rates: Maps a bank name to a rate string (kept as string for input handling).
 * - CountryData: Static configuration for a country (currency, flag, banks).
 * - Countries: Map of country names to their data.
 */

export type RateErrors = {
  [key: string]: string;
};

export type Rates = {
  [key: string]: string;
};

export type CountryData = {
  currency: string;
  flag: string;
  banks: string[];
};

export type Countries = {
  [key: string]: CountryData;
};

export type LogEntry = {
  id: string;
  date: string;
  timestamp: string;
  rates: Rates;
  logoType: string;
  selectedCountries: string[];
};
