import React from 'react';

interface OrderBookRowProps {
  price: string;
  quantity: string;
  total: string;
  maxTotal: number;
  type: 'buy' | 'sell';
}

export const OrderBookRow = React.memo(({
  price,
  quantity,
  total,
  maxTotal,
  type
}: OrderBookRowProps) => {
  const parsedPrice = parseFloat(price);
  const formattedPrice = parsedPrice.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8
  });

  const formattedQty = parseFloat(quantity).toFixed(4);
  const formattedTotal = parseFloat(total).toFixed(2);

  const depthWidth = maxTotal > 0 ? (parseFloat(total) / maxTotal) * 100 : 0;

  const rowColor = type === 'buy' ? 'var(--color-buy)' : 'var(--color-sell)';
  const barBg = type === 'buy' ? 'var(--color-buy-bg)' : 'var(--color-sell-bg)';

  return (
    <div style={{
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      padding: '4px 16px',
      fontSize: '12px',
      fontFamily: 'var(--font-mono)',
      cursor: 'pointer',
      userSelect: 'none',
      alignItems: 'center',
      height: '22px'
    }}>
      <div style={{
        position: 'absolute',
        top: 0, right: 0, bottom: 0,
        width: `${depthWidth}%`,
        backgroundColor: barBg,
        zIndex: 1,
        transition: 'width 0.2s ease',
        pointerEvents: 'none'
      }} />

      <div style={{ color: rowColor, zIndex: 2, fontWeight: 500 }}>{formattedPrice}</div>
      <div style={{ textAlign: 'right', color: 'var(--color-text-primary)', zIndex: 2 }}>{formattedQty}</div>
      <div style={{ textAlign: 'right', color: 'var(--color-text-secondary)', zIndex: 2 }}>{formattedTotal}</div>
    </div>
  );
});

export default OrderBookRow;