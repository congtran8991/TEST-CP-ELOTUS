import React from 'react';
import { observer } from 'mobx-react';
import getStore from '../../store/store';
import { setSelectedIntervalAction } from '../../store';
import { dictionary } from '../../i18n';

const INTERVALS = ['1m', '5m', '15m', '1h', '4h', '1d'] as const;

export const Toolbar: React.FC = observer(() => {
  const store = getStore();

  // Đọc từ điển ngôn ngữ động ('en' hoặc 'vi') từ hệ thống i18n
  const t = dictionary[store.currentLanguage];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      borderBottom: '1px solid var(--border-color)',
      background: 'var(--bg-panel)',
      transition: 'background 0.25s ease, border-color 0.25s ease'
    }}>
      {/* Khối chọn Khung thời gian (Interval) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
          {t.interval || 'Interval'}:
        </span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {INTERVALS.map((interval) => (
            <button
              key={interval}
              className={`custom-btn ${store.selectedInterval === interval ? 'active' : ''}`}
              onClick={() => setSelectedIntervalAction(interval)}
              style={{ padding: '4px 10px', fontSize: '12px', borderRadius: '4px' }}
            >
              {interval}
            </button>
          ))}
        </div>
      </div>

      {/* Khối hiển thị trạng thái dòng dữ liệu trực tiếp (Live Feeds) */}
      <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
        {t.liveFeeds || 'Live Feeds'}: <span style={{ color: 'var(--color-buy)', fontWeight: 600 }}>100ms Ticks</span>
      </div>
    </div>
  );
});

export default Toolbar;