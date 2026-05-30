import { action } from 'satcheljs';

import type { TickerInfo, Language } from '../constants/types';

export const changeLanguageAction = action('CHANGE_LANGUAGE', (lang: Language) => ({ lang }));

export const initializeApplicationAction = action('INITIALIZE_APPLICATION');

export const setActiveTabAction = action('SET_ACTIVE_TAB', (tab: 'USDT' | 'BTC' | 'ALL') => ({ tab }));

export const setSearchQueryAction = action('SET_SEARCH_QUERY', (query: string) => ({ query }));

export const setTickersAction = action('SET_TICKERS', (tickers: TickerInfo[]) => ({ tickers }));

export const updateTickersAction = action('UPDATE_TICKERS', (updatedTickers: TickerInfo[]) => ({
  updatedTickers
}));

export const setSelectedSymbolAction = action('SET_SELECTED_SYMBOL', (symbol: string) => ({ symbol }));
