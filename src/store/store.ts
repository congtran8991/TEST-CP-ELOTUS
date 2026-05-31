import { createStore } from 'satcheljs';
import type { AppState, TickerInfo } from '../constants/types';


// Initial State definition
const initialState: AppState = {
  currentLanguage: 'vi',
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
