import { action } from 'satcheljs';

import type { TickerInfo, Language, KlineData, OrderBookItem } from '../constants/types';

export const changeLanguageAction = action('CHANGE_LANGUAGE', (lang: Language) => ({ lang }));

export const toggleThemeAction = action('toggleTheme');

export const initializeApplicationAction = action('INITIALIZE_APPLICATION');

export const setActiveTabAction = action('SET_ACTIVE_TAB', (tab: 'USDT' | 'BTC' | 'ALL') => ({ tab }));

export const setSearchQueryAction = action('SET_SEARCH_QUERY', (query: string) => ({ query }));

export const setTickersAction = action('SET_TICKERS', (tickers: TickerInfo[]) => ({ tickers }));

export const updateTickersAction = action('UPDATE_TICKERS', (updatedTickers: TickerInfo[]) => ({
  updatedTickers
}));

export const setSelectedSymbolAction = action('SET_SELECTED_SYMBOL', (symbol: string) => ({ symbol }));

export const setHistoricalKlinesAction = action('SET_HISTORICAL_KLINES', (klines: KlineData[]) => ({
  klines
}));

export const setSelectedIntervalAction = action('SET_SELECTED_INTERVAL', (interval: string) => ({
  interval
}));

export const setKlineConnectionStatusAction = action(
  'SET_KLINE_CONNECTION_STATUS',
  (status: 'connecting' | 'connected' | 'disconnected') => ({ status })
);

export const setConnectionStatusAction = action(
  'SET_CONNECTION_STATUS',
  (status: 'connecting' | 'connected' | 'disconnected') => ({ status })
);

export const updateKlineAction = action('UPDATE_KLINE', (kline: KlineData) => ({ kline }));

export const updateOrderBookAction = action(
  'UPDATE_ORDER_BOOK',
  (bids: OrderBookItem[], asks: OrderBookItem[]) => ({ bids, asks })
);
