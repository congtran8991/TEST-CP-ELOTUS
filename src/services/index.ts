import type { TickerInfo } from "../constants/types";


const REST_BASE = 'https://api.binance.com/api/v3';
export const WS_BASE = 'wss://stream.binance.com:9443/ws';

export async function fetchInitialTickers(): Promise<TickerInfo[]> {
  try {
    console.log('[REST] Fetching initial 24h ticker info...');
    const response = await fetch(`${REST_BASE}/ticker/24hr`);
    console.log('[REST] 24h ticker info response', response);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    console.log(data, "data_24h")

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