import { observer } from 'mobx-react';
import getStore from '../../store/store';

interface TickerRowProps {
  symbol: string;
  active: boolean;
  onClick: () => void;
}

const TickerRow = observer(({ symbol, active, onClick }: TickerRowProps) => {
  const store = getStore();
  const ticker = store.tickers.get(symbol);

  if (!ticker) return null;

  const isPositive = parseFloat(ticker.priceChangePercent) >= 0;

  // Decide flash classes
  let flashClass = '';
  if (ticker.changeDirection === 'up') {
    flashClass = 'flash-up';
  } else if (ticker.changeDirection === 'down') {
    flashClass = 'flash-down';
  }

  // Format price based on size
  const formatPrice = (pStr: string) => {
    const p = parseFloat(pStr);
    if (p >= 1) return p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (p >= 0.01) return p.toFixed(4);
    return p.toFixed(6);
  };

  const displaySymbol = symbol.replace(/(USDT|BTC|ETH)$/, '/$1');

  return (
    <div
      onClick={onClick}
      className={`${flashClass}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        borderBottom: '1px solid rgba(43, 49, 57, 0.3)',
        cursor: 'pointer',
        backgroundColor: active ? 'rgba(0, 180, 216, 0.08)' : 'transparent',
        borderLeft: active ? '3px solid var(--color-accent)' : '3px solid transparent',
        transition: 'all 0.15s ease',
        userSelect: 'none'
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontWeight: 600, fontSize: '13.5px', color: active ? '#fff' : 'var(--color-text-primary)' }}>
          {displaySymbol}
        </span>
        <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
          Vol {parseFloat(ticker.volume).toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontFamily: 'var(--font-mono)' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
          {formatPrice(ticker.price)}
        </span>
        <span style={{ fontSize: '11px', fontWeight: 500, color: isPositive ? 'var(--color-buy)' : 'var(--color-sell)' }}>
          {isPositive ? '+' : ''}{ticker.priceChangePercent}%
        </span>
      </div>
    </div>
  );
});

export default TickerRow;