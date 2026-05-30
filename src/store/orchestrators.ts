import { orchestrator } from 'satcheljs';
import { initializeApplicationAction, setSelectedSymbolAction, setTickersAction, updateTickersAction } from './actions';
import getStore from './store';
import { fetchInitialTickers, WS_BASE } from '../services';
import type { TickerInfo } from '../constants/types';

let tickerWs: WebSocket | null = null;
let tickerBufferMap = new Map<string, TickerInfo>();
let tickerIntervalId: number | any = null;

function stopTickerStream() {
  if (tickerWs) {
    tickerWs.close();
    tickerWs = null;
  }
  if (tickerIntervalId) {
    clearInterval(tickerIntervalId);
    tickerIntervalId = null;
  }
  tickerBufferMap.clear();
}

// Start global ticker WebSocket (receives all symbols updates)


function startTickerStream() {

  stopTickerStream();

  // Connect to Binance All Market Mini Ticker WebSocket stream
  tickerWs = new WebSocket(`${WS_BASE}/!miniTicker@arr`);

  tickerWs.onopen = () => {
    console.log('[WS] Global Tickers Connected');
  };

  tickerWs.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      if (!Array.isArray(data)) return;

      data.forEach((t: any) => {
        const symbol = t.s;

        // We only care about major trading pairs to keep sidebar clean (e.g. ending in USDT, BTC, ETH)
        const isTarget = symbol.endsWith('USDT') || symbol.endsWith('BTC') || symbol.endsWith('ETH');
        if (!isTarget) return;

        const close = parseFloat(t.c);
        const open = parseFloat(t.o);
        const diff = close - open;
        const percent = open !== 0 ? (diff / open) * 100 : 0;

        const ticker: TickerInfo = {
          symbol,
          price: t.c,
          priceChange: diff.toString(),
          priceChangePercent: percent.toFixed(2),
          volume: parseFloat(t.v).toFixed(2),
          quoteVolume: parseFloat(t.q).toFixed(2),
          high: t.h,
          low: t.l
        };

        // Buffer the update for batching
        tickerBufferMap.set(symbol, ticker);
      });
    } catch (err) {
      console.error('[WS Tickers] Error parsing message', err);
    }
  };

  tickerWs.onclose = () => {
    console.log('[WS] Global Tickers Closed');
  };

  tickerWs.onerror = (error) => {
    console.error('[WS Tickers] Error:', error);
  };

  // Set up Throttling Dispatcher (Dispatches batched ticker updates every 400ms to avoid clogging React)
  tickerIntervalId = setInterval(() => {
    console.log(tickerBufferMap.size, "tickerBufferMapsize")
    if (tickerBufferMap.size > 0) {
      const updates = Array.from(tickerBufferMap.values());
      updateTickersAction(updates);
      tickerBufferMap.clear();
    }
  }, 400);
}

orchestrator(initializeApplicationAction, async () => {
  console.log("initializeApplication")
  const store = getStore();

  // 1. Fetch initial tickers to populate list immediately
  const initialTickers = await fetchInitialTickers();
  if (initialTickers.length > 0) {
    setTickersAction(initialTickers);
  }

  // 2. Start global websocket stream for continuous sidebar updates
  startTickerStream();
});

orchestrator(setSelectedSymbolAction, async (actionMessage) => {
  console.log(actionMessage, "actionMessage")
});