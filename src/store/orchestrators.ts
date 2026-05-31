import { orchestrator } from 'satcheljs';
import { initializeApplicationAction, setHistoricalKlinesAction, setKlineConnectionStatusAction, setSelectedIntervalAction, setSelectedSymbolAction, setTickersAction, updateKlineAction, updateOrderBookAction, updateTickersAction } from './actions';
import getStore from './store';
import { fetchHistoricalKlines, fetchInitialTickers, WS_BASE } from '../services';
import type { KlineData, OrderBookItem, TickerInfo } from '../constants/types';

let tickerWs: WebSocket | null = null;
let klineWs: WebSocket | null = null;
let depthWs: WebSocket | null = null;

let tickerBufferMap = new Map<string, TickerInfo>();
let tickerIntervalId: number | any = null;

let depthBuffer: { bids: OrderBookItem[]; asks: OrderBookItem[] } | null = null;
let depthIntervalId: number | any = null;

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

function stopKlineStream() {
  if (klineWs) {
    klineWs.close();
    klineWs = null;
  }
  setKlineConnectionStatusAction('disconnected');
}

function startKlineStream(symbol: string, interval: string) {
  stopKlineStream();
  setKlineConnectionStatusAction('connecting');

  const streamName = `${symbol.toLowerCase()}@kline_${interval}`;
  klineWs = new WebSocket(`${WS_BASE}/${streamName}`);

  klineWs.onopen = () => {
    setKlineConnectionStatusAction('connected');
    console.log(`[WS] Kline stream active for ${symbol} @ ${interval}`);
  };

  klineWs.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log(data, "datadatadatadatadata")
      if (!data || !data.k) return;

      const k = data.k;
      const kline: KlineData = {
        time: k.t / 1000, // Convert ms to seconds for TradingView Lightweight Charts
        open: parseFloat(k.o),
        high: parseFloat(k.h),
        low: parseFloat(k.l),
        close: parseFloat(k.c),
        volume: parseFloat(k.v)
      };

      // Dispatch immediately because candlestick updates represent a single row on screen
      // (no rendering bottleneck since lightweight-charts handles single ticks very efficiently)
      updateKlineAction(kline);
    } catch (err) {
      console.error('[WS Kline] Error parsing message', err);
    }
  };

  klineWs.onclose = () => {
    setKlineConnectionStatusAction('disconnected');
    console.log(`[WS] Kline stream closed for ${symbol}`);
  };
}

function stopDepthStream() {
  if (depthWs) {
    depthWs.close();
    depthWs = null;
  }
  if (depthIntervalId) {
    clearInterval(depthIntervalId);
    depthIntervalId = null;
  }
  depthBuffer = null;
}

// Start live order book depth stream
function startDepthStream(symbol: string) {
  stopDepthStream();

  const streamName = `${symbol.toLowerCase()}@depth20@100ms`;
  depthWs = new WebSocket(`${WS_BASE}/${streamName}`);

  depthWs.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (!data || !data.bids || !data.asks) return;

      const bids: OrderBookItem[] = data.bids.map((b: any) => ({
        price: b[0],
        quantity: b[1]
      }));

      const asks: OrderBookItem[] = data.asks.map((a: any) => ({
        price: a[0],
        quantity: a[1]
      }));

      // Buffer the order book data
      depthBuffer = { bids, asks };
    } catch (err) {
      console.error('[WS Depth] Error parsing message', err);
    }
  };

  // Set up Order Book Throttling: update the MobX state every 250ms rather than every 100ms
  // to save precious browser repaint cycles on massive order book layouts
  depthIntervalId = setInterval(() => {
    if (depthBuffer) {
      updateOrderBookAction(depthBuffer.bids, depthBuffer.asks);
      depthBuffer = null;
    }
  }, 250);
}

orchestrator(initializeApplicationAction, async () => {
  const store = getStore();

  // 1. Fetch initial tickers to populate list immediately
  const initialTickers = await fetchInitialTickers();
  if (initialTickers.length > 0) {
    setTickersAction(initialTickers);
  }

  // 2. Start global websocket stream for continuous sidebar updates
  startTickerStream();

  const klines = await fetchHistoricalKlines(store.selectedSymbol, store.selectedInterval);
  setHistoricalKlinesAction(klines);

  startKlineStream(store.selectedSymbol, store.selectedInterval);
  startDepthStream(store.selectedSymbol);
});

orchestrator(setSelectedSymbolAction, async (actionMessage) => {
  console.log(actionMessage, "actionMessage")
  const store = getStore();
  const symbol = actionMessage.symbol;
  const interval = store.selectedInterval;

  // 1. Unsubscribe from previous streams
  stopKlineStream();
  stopDepthStream();

  // 2. Fetch new historical data
  const klines = await fetchHistoricalKlines(symbol, interval);
  setHistoricalKlinesAction(klines);

  // 3. Subscribe to new streams
  startKlineStream(symbol, interval);
  startDepthStream(symbol);
});

orchestrator(setSelectedIntervalAction, async (actionMessage) => {
  const store = getStore();
  const symbol = store.selectedSymbol;
  const interval = actionMessage.interval;

  // 1. Unsubscribe from previous kline stream
  stopKlineStream();

  // 2. Fetch new historical data
  const klines = await fetchHistoricalKlines(symbol, interval);
  setHistoricalKlinesAction(klines);

  // 3. Subscribe to new kline stream
  startKlineStream(symbol, interval);
  startDepthStream(store.selectedSymbol);
});

