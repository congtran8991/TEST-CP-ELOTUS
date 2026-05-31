import React from 'react';
import { observer } from 'mobx-react';
import { changeLanguageAction, getStore } from '../../store';
import { dictionary } from '../../i18n';


export const Header: React.FC = observer(() => {
  const store = getStore();
  const t = dictionary[store.currentLanguage];

  const activeTicker = store.tickers.get(store.selectedSymbol);

  // Format price helper
  const formatPrice = (priceStr: string | undefined) => {
    if (!priceStr) return '--';
    const num = parseFloat(priceStr);
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    });
  };

  const isPositive = activeTicker ? parseFloat(activeTicker.priceChangePercent) >= 0 : true;
  const changePercent = activeTicker ? activeTicker.priceChangePercent : '0.00';

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

      {/* Selected Market Info */}
      {activeTicker ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flex: 1, marginLeft: '40px' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 600, color: '#fff' }}>
              {activeTicker.symbol.replace(/(USDT|BTC|ETH)$/, '/$1')}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{t.binanceSpot}</div>
          </div>

          <div>
            <div className={`glow-text ${isPositive ? 'text-buy' : 'text-sell'}`} style={{ fontSize: '18px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
              {formatPrice(activeTicker.price)}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{t.lastPrice}</div>
          </div>

          <div>
            <div className={isPositive ? 'text-buy' : 'text-sell'} style={{ fontSize: '14px', fontWeight: 600 }}>
              {isPositive ? '+' : ''}{changePercent}%
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{t.change24h}</div>
          </div>

          <div className="hide-md" style={{ display: 'flex', gap: '24px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                {formatPrice(activeTicker.high)}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{t.high24h}</div>
            </div>

            <div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                {formatPrice(activeTicker.low)}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{t.low24h}</div>
            </div>

            <div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                {parseFloat(activeTicker.volume).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{t.vol24h} ({activeTicker.symbol.replace(/(USDT|BTC|ETH)$/, '')})</div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, marginLeft: '40px', color: 'var(--color-text-secondary)', fontSize: '14px' }}>
          {t.loading}
        </div>
      )}

      {/* Connection Status Badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Ticker Stream Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor:
              store.wsStatus === 'connected' ? 'var(--color-buy)' :
                store.wsStatus === 'connecting' ? '#ffb020' : 'var(--color-sell)',
            boxShadow: store.wsStatus === 'connected' ? '0 0 8px var(--color-buy)' : 'none'
          }} />
          <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
            Market WS: {store.wsStatus.toUpperCase()}
          </span>
        </div>

        {/* Kline Stream Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor:
              store.klineWsStatus === 'connected' ? 'var(--color-buy)' :
                store.klineWsStatus === 'connecting' ? '#ffb020' : 'var(--color-sell)',
            boxShadow: store.klineWsStatus === 'connected' ? '0 0 8px var(--color-buy)' : 'none'
          }} />
          <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
            Chart WS: {store.klineWsStatus.toUpperCase()}
          </span>
        </div>
      </div>



      {/* Bộ nút bấm chuyển đổi ngôn ngữ VI / EN */}
      <div style={{
        display: 'flex',
        gap: '4px',
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '3px',
        borderRadius: '6px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        marginLeft: '16px',
      }}>
        <button
          onClick={() => changeLanguageAction('vi')}
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
          onClick={() => changeLanguageAction('en')}
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

    </header>
  );
});

export default Header;
