import React, { memo } from 'react';
import { observer } from 'mobx-react';
import getStore from '../../store/store';
import { dictionary } from '../../i18n';

interface TickerRowProps {
  symbol: string;
  active: boolean;
  onClick: () => void;
}

export const TickerRow = observer(({ symbol, active, onClick }: TickerRowProps) => {
  const store = getStore();
  const ticker = store.tickers.get(symbol);

  // Đọc từ điển ngôn ngữ động ('en' hoặc 'vi') từ tệp JSON
  const t = dictionary[store.currentLanguage];

  if (!ticker) return null;

  const isPositive = parseFloat(ticker.priceChangePercent) >= 0;

  // Quyết định hiệu ứng nhấp nháy màu khi giá nhảy
  let flashClass = '';
  if (ticker.changeDirection === 'up') {
    flashClass = 'flash-up';
  } else if (ticker.changeDirection === 'down') {
    flashClass = 'flash-down';
  }

  // Hàm định dạng hiển thị giá tiền
  const formatPrice = (pStr: string) => {
    const p = parseFloat(pStr);
    if (p >= 1) return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (p >= 0.01) return p.toFixed(4);
    return p.toFixed(6);
  };

  // Định dạng lại tên coin (Ví dụ: BTCUSDT thành BTC/USDT)
  const displaySymbol = symbol.replace(/(USDT|BTC|ETH)$/, '/$1');

  return (
    <div
      onClick={onClick}
      // Thêm class 'active' nếu dòng này đang được chọn để ăn theo css hệ thống nếu cần, kết hợp hiệu ứng nhấp nháy
      className={`ticker-row-item ${active ? 'active' : ''} ${flashClass}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        borderBottom: '1px solid var(--border-color)',
        cursor: 'pointer',
        // THAY ĐỔI TẠI ĐÂY: Dùng màu nền accent mờ động theo hệ thống
        backgroundColor: active ? 'var(--color-accent-glow)' : 'transparent',
        borderLeft: active ? '3px solid var(--color-accent)' : '3px solid transparent',
        transition: 'all 0.15s ease',
        userSelect: 'none'
      }}
    >
      {/* Cột Tên Coin và Khối lượng */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* THAY ĐỔI TẠI ĐÂY: Bỏ màu #fff cứng để không bị tàng hình ở Light Theme */}
        <span style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--color-text-primary)' }}>
          {displaySymbol}
        </span>
        <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
          {t.volShort || 'Vol'} {parseFloat(ticker.volume).toLocaleString('en-US', { maximumFractionDigits: 0 })}
        </span>
      </div>

      {/* Cột Giá hiện tại và % Thay đổi */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontFamily: 'var(--font-mono)' }}>
        {/* THAY ĐỔI TẠI ĐÂY: Đưa màu chữ về biến hệ thống động */}
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
          {formatPrice(ticker.price)}
        </span>
        <span style={{ fontSize: '11px', fontWeight: 500, color: isPositive ? 'var(--color-buy)' : 'var(--color-sell)' }}>
          {isPositive ? '+' : ''}{ticker.priceChangePercent}%
        </span>
      </div>
    </div>
  );
});

// Xuất bản kết hợp bọc bộ đệm memo để tối ưu chống re-render flood từ cha
export default memo(TickerRow, (prevProps, nextProps) => {
  return prevProps.symbol === nextProps.symbol && prevProps.active === nextProps.active;
});