import React from 'react';
import { observer } from 'mobx-react';
import getStore from '../../store/store';
import OrderBookHeader from './OrderBookHeader';
import OrderBookRow from './OrderBookRow';
import MidMarketPrice from './MidMaketPrice';
import { dictionary } from '../../i18n';

export const OrderBook: React.FC = observer(() => {
  const store = getStore();

  // Đọc từ điển ngôn ngữ động ('en' hoặc 'vi') từ hệ thống i18n
  const t = dictionary[store.currentLanguage];

  const displayLimit = 10;
  const slicedBids = store.orderBook.bids.slice(0, displayLimit);
  const slicedAsks = store.orderBook.asks.slice(0, displayLimit);
  const reversedAsks = [...slicedAsks].reverse();

  const maxBidTotal = store.orderBook.bids.length > 0 ? parseFloat(store.orderBook.bids[Math.min(store.orderBook.bids.length, displayLimit) - 1].total || '0') : 0;
  const maxAskTotal = store.orderBook.asks.length > 0 ? parseFloat(store.orderBook.asks[Math.min(store.orderBook.asks.length, displayLimit) - 1].total || '0') : 0;
  const maxTotal = Math.max(maxBidTotal, maxAskTotal);

  return (
    <div className="orderbook-area">
      {/* Tiêu đề vùng Sổ lệnh */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(22, 26, 30, 0.4)'
      }}>
        <span style={{ fontWeight: 600, fontSize: '14px' }}>
          {t.orderBookTitle || 'Order Book'}
        </span>
        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
          {t.depth || 'Depth'}: 20
        </span>
      </div>

      <OrderBookHeader />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Asks Section (Sells) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden', paddingBottom: '4px' }}>
          {reversedAsks.length > 0 ? (
            reversedAsks.map((ask, idx) => (
              <OrderBookRow
                key={`ask-${idx}-${ask.price}`}
                price={ask.price}
                quantity={ask.quantity}
                total={ask.total || '0'}
                maxTotal={maxTotal}
                type="sell"
              />
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '16px', color: 'var(--color-text-muted)', fontSize: '12px' }}>
              {t.waitingAsks || 'Waiting for order book asks...'}
            </div>
          )}
        </div>

        {/* Trung tâm: Giá thị trường & Spread */}
        <MidMarketPrice />

        {/* Bids Section (Buys) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', overflow: 'hidden', paddingTop: '4px' }}>
          {slicedBids.length > 0 ? (
            slicedBids.map((bid, idx) => (
              <OrderBookRow
                key={`bid-${idx}-${bid.price}`}
                price={bid.price}
                quantity={bid.quantity}
                total={bid.total || '0'}
                maxTotal={maxTotal}
                type="buy"
              />
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '16px', color: 'var(--color-text-muted)', fontSize: '12px' }}>
              {t.waitingBids || 'Waiting for order book bids...'}
            </div>
          )}
        </div>

      </div>
    </div>
  );
});

export default OrderBook;