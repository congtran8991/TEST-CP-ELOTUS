export type Language = 'en' | 'vi';

export type Theme = 'dark' | 'light';

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

export interface KlineData {
  time: number; // Unix timestamp in seconds for lightweight-charts
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBookItem {
  price: string;
  quantity: string;
  total?: string; // Cumulative total for depth visual bars
}

export interface AppState {
  currentLanguage: Language;
  theme: Theme;
  tickers: Map<string, TickerInfo>;
  selectedSymbol: string;
  selectedInterval: string;
  klines: KlineData[];
  orderBook: {
    bids: OrderBookItem[];
    asks: OrderBookItem[];
    spread: string;
    spreadPercent: string;
  };
  searchQuery: string;
  activeTab: 'USDT' | 'BTC' | 'ALL';
  wsStatus: 'connecting' | 'connected' | 'disconnected';
  klineWsStatus: 'connecting' | 'connected' | 'disconnected';
}