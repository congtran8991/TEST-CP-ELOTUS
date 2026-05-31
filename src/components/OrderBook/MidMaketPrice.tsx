import React from 'react';
import { observer } from 'mobx-react';
import getStore from '../../store/store';

export const MidMarketPrice: React.FC = observer(() => {
  const store = getStore();
  const activeTicker = store.tickers.get(store.selectedSymbol);

  const formatPrice = (pStr: string | undefined) => {
    if (!pStr) return '--';
    return parseFloat(pStr).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    });
  };

  const isPositive = activeTicker ? parseFloat(activeTicker.priceChangePercent) >= 0 : true;

  return (
    <div style={{
      padding: '8px 16px',
      borderTop: '1px solid var(--border-color)',
      borderBottom: '1px solid var(--border-color)',
      background: 'rgba(255, 255, 255, 0.02)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2px',
      zIndex: 10
    }}>
      {activeTicker ? (
        <div className={`glow-text ${isPositive ? 'text-buy' : 'text-sell'}`} style={{
          fontSize: '18px',
          fontWeight: 700,
          fontFamily: 'var(--font-mono)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          {formatPrice(activeTicker.price)}
          <span style={{ fontSize: '14px' }}>{isPositive ? '▲' : '▼'}</span>
        </div>
      ) : (
        <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>--</div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '11px', color: 'var(--color-text-secondary)' }}>
        <span>Spread</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'var(--color-text-primary)' }}>
          {store.orderBook.spread} ({store.orderBook.spreadPercent})
        </span>
      </div>
    </div>
  );
});

export default MidMarketPrice;