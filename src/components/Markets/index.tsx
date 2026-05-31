import React, { useMemo } from 'react';
import { observer } from 'mobx-react';
import TickerRow from './TickerRow'; // Sửa lại chữ TicketRow thành TickerRow cho đúng tên file bạn vừa tạo
import { setSearchQueryAction, setActiveTabAction, getStore, setSelectedSymbolAction } from '../../store';
import { dictionary } from '../../i18n';
import { useSearchDebounce } from '../../hooks/useSearchDebounce'; // 1. Import hook mới

export const Markets: React.FC = observer(() => {
  const store = getStore();

  const [searchVal, setSearchVal] = useSearchDebounce(store.searchQuery, setSearchQueryAction, 300);

  // Đọc từ điển ngôn ngữ động ('en' hoặc 'vi') từ tệp JSON
  const t = dictionary[store.currentLanguage];

  // Giữ nguyên logic Memoize filtering & sorting phục vụ hiệu năng
  const filteredSymbols = useMemo(() => {
    const list: string[] = [];
    const query = store.searchQuery.toUpperCase().replace('/', '');
    const tab = store.activeTab;

    store.tickers.forEach((_, symbol) => {
      if (tab === 'USDT' && !symbol.endsWith('USDT')) return;
      if (tab === 'BTC' && !symbol.endsWith('BTC')) return;
      if (query && !symbol.includes(query)) return;

      list.push(symbol);
    });

    return list.sort((a, b) => {
      const volA = parseFloat(store.tickers.get(a)?.quoteVolume || '0');
      const volB = parseFloat(store.tickers.get(b)?.quoteVolume || '0');
      return volB - volA;
    });
  }, [store.tickers, store.searchQuery, store.activeTab]);

  return (
    <div className="sidebar-area">
      {/* Search Input Box - Đa ngôn ngữ phần Placeholder */}
      <div style={{ padding: '12px' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="custom-input"
            placeholder={t.searchPlaceholder || "Search markets..."}
            value={searchVal} // Gắn trực tiếp biến từ hook trả về
            onChange={(e) => setSearchVal(e.target.value)} // Gắn trực tiếp hàm từ hook trả về
            style={{ width: '100%', paddingLeft: '12px' }}
          />
        </div>
      </div>

      {/* Tabs danh mục thị trường */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', padding: '0 12px 12px 12px', gap: '6px' }}>
        {(['USDT', 'BTC', 'ALL'] as const).map((tab) => (
          <button
            key={tab}
            className={`custom-btn ${store.activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTabAction(tab)}
            style={{ padding: '6px 0', fontSize: '12px', borderRadius: '6px' }}
          >
            {/* Nếu tab là 'ALL', dịch thành 'Tất cả' hoặc 'All' tùy ngôn ngữ */}
            {tab === 'ALL' ? (t.tabAll || 'ALL') : tab}
          </button>
        ))}
      </div>

      {/* Ticker List Container - Đa ngôn ngữ phần trạng thái trống */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filteredSymbols.length > 0 ? (
          filteredSymbols.map((symbol) => (
            <TickerRow
              key={symbol}
              symbol={symbol}
              active={store.selectedSymbol === symbol}
              onClick={() => setSelectedSymbolAction(symbol)}
            />
          ))
        ) : (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>
            {t.noMarkets || "No markets found"}
          </div>
        )}
      </div>
    </div>
  );
});

export default Markets;