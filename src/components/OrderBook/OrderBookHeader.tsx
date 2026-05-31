import React from 'react';
import getStore from '../../store/store';

export const OrderBookHeader: React.FC = () => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    padding: '8px 16px',
    borderBottom: '1px solid var(--border-color)',
    fontSize: '11px',
    color: 'var(--color-text-secondary)',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  }}>
    <div>Price ({getStore().selectedSymbol.replace(/(USDT|BTC|ETH)$/, '')})</div>
    <div style={{ textAlign: 'right' }}>Size</div>
    <div style={{ textAlign: 'right' }}>Total</div>
  </div>
);

export default OrderBookHeader;