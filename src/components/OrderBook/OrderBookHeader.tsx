import React from 'react';
import { observer } from 'mobx-react';
import getStore from '../../store/store';
import { dictionary } from '../../i18n';

export const OrderBookHeader: React.FC = observer(() => {
  const store = getStore();

  // Đọc từ điển ngôn ngữ động ('en' hoặc 'vi') từ hệ thống i18n
  const t = dictionary[store.currentLanguage];

  // Trích xuất tên đồng coin cơ sở (Ví dụ: BTCUSDT -> BTC)
  const baseAsset = store.selectedSymbol.replace(/(USDT|BTC|ETH)$/, '');

  return (
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
      {/* Cột Giá kèm mã coin gốc */}
      <div>
        {t.price || 'Price'} ({baseAsset})
      </div>

      {/* Cột Kích thước / Số lượng */}
      <div style={{ textAlign: 'right' }}>
        {t.size || 'Size'}
      </div>

      {/* Cột Tổng tích lũy */}
      <div style={{ textAlign: 'right' }}>
        {t.total || 'Total'}
      </div>
    </div>
  );
});

export default OrderBookHeader;