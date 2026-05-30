import React from 'react';
import { observer } from 'mobx-react';
import getStore from '../../store/store'; // Đảm bảo import đúng action changeLanguage từ store của bạn
import { dictionary } from '../../i18n';
import { changeLanguage } from '../../store';

export const Header: React.FC = observer(() => {
  const store = getStore();
  const t = dictionary[store.currentLanguage];

  return (
    <header className="header-area">
      {/* Brand Logo & Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #00b4d8, #02c076)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          color: '#080a0c',
          fontSize: '18px',
          boxShadow: '0 0 10px rgba(0, 180, 216, 0.4)'
        }}>
          A
        </div>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '1px', background: 'linear-gradient(to right, #ffffff, #848e9c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t.brandName}
          </h1>
        </div>
      </div>

      {/* Selected Market Info (Giữ nguyên cấu trúc rỗng như cũ) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flex: 1, marginLeft: '40px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#fff' }}>

          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Binance Spot</div>
        </div>

        <div>
          <div className="glow-text" style={{ fontSize: '18px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>

          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{t.lastPrice}</div>
        </div>

        <div>
          <div style={{ fontSize: '14px', fontWeight: 600 }}>

          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{t.change24h}</div>
        </div>

        <div className="hide-md" style={{ display: 'flex', gap: '24px' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>

            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{t.high24h}</div>
          </div>

          <div>
            <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>

            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{t.low24h}</div>
          </div>

          <div>
            <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>

            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{t.vol24h}</div>
          </div>
        </div>
      </div>

      {/* Hành động & Trạng thái (Language Switcher & Connection Status Badges) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

        {/* Bộ nút bấm chuyển đổi ngôn ngữ VI / EN */}
        <div style={{
          display: 'flex',
          gap: '4px',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '3px',
          borderRadius: '6px',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <button
            onClick={() => changeLanguage('vi')}
            style={{
              padding: '4px 10px',
              fontSize: '11px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              background: store.currentLanguage === 'vi' ? '#02c076' : 'transparent',
              color: store.currentLanguage === 'vi' ? '#000' : '#848e9c',
              fontWeight: store.currentLanguage === 'vi' ? 700 : 500,
              transition: 'all 0.2s ease'
            }}
          >
            VI
          </button>
          <button
            onClick={() => changeLanguage('en')}
            style={{
              padding: '4px 10px',
              fontSize: '11px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              background: store.currentLanguage === 'en' ? '#02c076' : 'transparent',
              color: store.currentLanguage === 'en' ? '#000' : '#848e9c',
              fontWeight: store.currentLanguage === 'en' ? 700 : 500,
              transition: 'all 0.2s ease'
            }}
          >
            EN
          </button>
        </div>

        {/* Ticker Stream Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
          }} />
          <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>

          </span>
        </div>

        {/* Kline Stream Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
          }} />
          <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>

          </span>
        </div>
      </div>
    </header>
  );
});

export default Header;