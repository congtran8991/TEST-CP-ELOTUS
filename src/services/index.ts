import type { KlineData, TickerInfo } from "../constants/types";


const REST_BASE = 'https://api.binance.com/api/v3';
export const WS_BASE = 'wss://stream.binance.com:9443/ws';

export async function fetchInitialTickers(): Promise<TickerInfo[]> {
  try {
    console.log('[REST] Fetching initial 24h ticker info...');
    const response = await fetch(`${REST_BASE}/ticker/24hr`);

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    return data
      .filter((t: any) => t.symbol.endsWith('USDT') || t.symbol.endsWith('BTC') || t.symbol.endsWith('ETH'))
      .map((t: any) => {
        const close = parseFloat(t.lastPrice);
        const open = parseFloat(t.openPrice);
        const diff = close - open;

        return {
          symbol: t.symbol,
          price: t.lastPrice,
          priceChange: diff.toString(),
          priceChangePercent: t.priceChangePercent,
          volume: parseFloat(t.volume).toFixed(2),
          quoteVolume: parseFloat(t.quoteVolume).toFixed(2),
          high: t.highPrice,
          low: t.lowPrice
        };
      });
  } catch (err) {
    console.error('[REST] Failed to fetch initial ticker info', err);
    return [];
  }
}

export async function fetchHistoricalKlines(symbol: string, interval: string): Promise<KlineData[]> {
  try {
    const url = `${REST_BASE}/klines?symbol=${symbol}&interval=${interval}&limit=500`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.ok ? await response.json() : [];

    return data.map((k: any) => ({
      time: k[0] / 1000, // Convert to seconds
      open: parseFloat(k[1]),
      high: parseFloat(k[2]),
      low: parseFloat(k[3]),
      close: parseFloat(k[4]),
      volume: parseFloat(k[5])
    }));
  } catch (err) {
    console.error(`[REST] Failed to fetch klines for ${symbol}`, err);
    return [];
  }
}