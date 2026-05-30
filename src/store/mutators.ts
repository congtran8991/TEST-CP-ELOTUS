import { mutator } from 'satcheljs';
import { changeLanguageAction, setActiveTabAction, setSearchQueryAction, setSelectedSymbolAction, setTickersAction, updateTickersAction } from './actions';
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
