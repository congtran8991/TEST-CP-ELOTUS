import { createStore } from 'satcheljs';
import type { AppState, Theme, TickerInfo } from '../constants/types';


// Initial State definition
const initialState: AppState = {
  currentLanguage: 'vi',
  theme: (localStorage.getItem('app-theme') as Theme) || 'dark',
  tickers: new Map<string, TickerInfo>(),
  selectedSymbol: 'BTCUSDT',
  selectedInterval: '15m',
  klines: [],
  orderBook: {
    bids: [],
    asks: [],
    spread: '0.00',
    spreadPercent: '0.00%'
  },
  searchQuery: '',
  activeTab: 'USDT',
  wsStatus: 'disconnected',
  klineWsStatus: 'disconnected'
};



// Create and export the store
export const getStore = createStore<AppState>('AppStore', initialState);

export default getStore;
