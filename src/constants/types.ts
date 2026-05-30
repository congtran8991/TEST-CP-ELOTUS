export type Language = 'en' | 'vi';

export interface TickerInfo {
  symbol: string;
  price: string;
  priceChange: string;
  priceChangePercent: string;
  volume: string;
  quoteVolume: string;
  high: string;
  low: string;
  // Used for flashing animations in UI
  changeDirection?: 'up' | 'down' | null;
  lastUpdated?: number;
}

export interface AppState {
  currentLanguage: Language;
  tickers: Map<string, TickerInfo>;
  selectedSymbol: string;
  selectedInterval: string;
  searchQuery: string;
  activeTab: 'USDT' | 'BTC' | 'ALL';
  wsStatus: 'connecting' | 'connected' | 'disconnected';
  klineWsStatus: 'connecting' | 'connected' | 'disconnected';
}