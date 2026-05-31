import { mutator } from 'satcheljs';
import { changeLanguageAction, setActiveTabAction, setConnectionStatusAction, setHistoricalKlinesAction, setSearchQueryAction, setSelectedIntervalAction, setSelectedSymbolAction, setTickersAction, updateKlineAction, updateOrderBookAction, updateTickersAction } from './actions';
import { getStore } from './store';
import type { TickerInfo } from '../constants/types';

mutator(changeLanguageAction, (msg) => {
  getStore().currentLanguage = msg.lang;
});

mutator(setTickersAction, (actionMessage) => {
  const store = getStore();
  const newMap = new Map<string, TickerInfo>();

  actionMessage.tickers.forEach(ticker => {
    newMap.set(ticker.symbol, {
      ...ticker,
      changeDirection: null,
      lastUpdated: Date.now()
    });
  });

  store.tickers = newMap;
});

mutator(setSelectedSymbolAction, (actionMessage) => {
  const store = getStore();
  store.selectedSymbol = actionMessage.symbol;
});

mutator(updateTickersAction, (actionMessage) => {
  const store = getStore();
  const currentTickers = store.tickers;

  actionMessage.updatedTickers.forEach(updated => {
    const existing = currentTickers.get(updated.symbol);
    let direction: 'up' | 'down' | null = null;

    if (existing) {
      const oldPrice = parseFloat(existing.price);
      const newPrice = parseFloat(updated.price);

      if (newPrice > oldPrice) {
        direction = 'up';
      } else if (newPrice < oldPrice) {
        direction = 'down';
      } else {
        // Keep the old direction if price didn't change (prevents flickering off)
        direction = existing.changeDirection || null;
      }
    }

    currentTickers.set(updated.symbol, {
      ...existing,
      ...updated,
      changeDirection: direction,
      lastUpdated: Date.now()
    });
  });
});

mutator(setSearchQueryAction, (actionMessage) => {
  getStore().searchQuery = actionMessage.query;
});

mutator(setActiveTabAction, (actionMessage) => {
  getStore().activeTab = actionMessage.tab;
});

mutator(setSelectedSymbolAction, (actionMessage) => {
  const store = getStore();
  store.selectedSymbol = actionMessage.symbol;
  // Clear previous orderbook and klines to avoid flickering other markets
  store.orderBook = {
    bids: [],
    asks: [],
    spread: '0.00',
    spreadPercent: '0.00%'
  };
  store.klines = [];
});

mutator(setHistoricalKlinesAction, (actionMessage) => {
  getStore().klines = actionMessage.klines;
});

mutator(updateKlineAction, (actionMessage) => {
  const store = getStore();
  const klines = store.klines;
  const newKline = actionMessage.kline;

  if (klines.length === 0) {
    klines.push(newKline);
    return;
  }

  const lastKlineIndex = klines.length - 1;
  const lastKline = klines[lastKlineIndex];

  if (lastKline.time === newKline.time) {
    // Update the current candle (in place to minimize array allocations)
    klines[lastKlineIndex] = newKline;
  } else if (newKline.time > lastKline.time) {
    // New candle interval started, append it
    klines.push(newKline);

    // Keep a maximum of 1000 candles to avoid memory bloating
    if (klines.length > 1000) {
      klines.shift();
    }
  }
});

mutator(setSelectedIntervalAction, (actionMessage) => {
  const store = getStore();
  store.selectedInterval = actionMessage.interval;
  store.klines = [];
});

mutator(updateOrderBookAction, (actionMessage) => {
  const store = getStore();

  // Calculate cumulative depth totals for bids
  let bidAccumulator = 0;
  const bids = actionMessage.bids.map(b => {
    bidAccumulator += parseFloat(b.quantity);
    return {
      ...b,
      total: bidAccumulator.toFixed(4)
    };
  });

  // Calculate cumulative depth totals for asks
  let askAccumulator = 0;
  const asks = actionMessage.asks.map(a => {
    askAccumulator += parseFloat(a.quantity);
    return {
      ...a,
      total: askAccumulator.toFixed(4)
    };
  });

  // Calculate spread and spread percentage
  let spread = '0.00';
  let spreadPercent = '0.00%';

  if (asks.length > 0 && bids.length > 0) {
    const askPrice = parseFloat(asks[0].price);
    const bidPrice = parseFloat(bids[0].price);
    const spreadVal = askPrice - bidPrice;

    spread = spreadVal.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    });

    spreadPercent = ((spreadVal / askPrice) * 100).toFixed(4) + '%';
  }

  store.orderBook = {
    bids,
    asks,
    spread,
    spreadPercent
  };
});

mutator(setConnectionStatusAction, (actionMessage) => {
  getStore().wsStatus = actionMessage.status;
});
