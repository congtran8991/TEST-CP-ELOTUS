import React, { useMemo } from 'react';
import { observer } from 'mobx-react';
import TickerRow from './TicketRow';
import { setSearchQueryAction, setActiveTabAction, getStore, setSelectedSymbolAction } from '../../store';

export const Markets: React.FC = observer(() => {
  const store = getStore();

  console.log(store.tickers, "store123")

  // Memoize filtering for performance
  const filteredSymbols = useMemo(() => {
    const list: string[] = [];
    const query = store.searchQuery.toUpperCase().replace('/', '');
    const tab = store.activeTab;

    store.tickers.forEach((_, symbol) => {
      // Tab filter
      if (tab === 'USDT' && !symbol.endsWith('USDT')) return;
      if (tab === 'BTC' && !symbol.endsWith('BTC')) return;

      // Search filter
      if (query && !symbol.includes(query)) return;

      list.push(symbol);
    });

    // Sort primarily by volume descending
    return list.sort((a, b) => {
      const volA = parseFloat(store.tickers.get(a)?.quoteVolume || '0');
      const volB = parseFloat(store.tickers.get(b)?.quoteVolume || '0');
      return volB - volA;
    });
  }, [store.tickers, store.searchQuery, store.activeTab]);


  return (
    <div className="sidebar-area">
      {/* Search Input Box */}
      <div style={{ padding: '12px' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="custom-input"
            placeholder="Search markets..."
            value={store.searchQuery}
            onChange={(e) => setSearchQueryAction(e.target.value)}
            style={{ width: '100%', paddingLeft: '12px' }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', padding: '0 12px 12px 12px', gap: '6px' }}>
        {(['USDT', 'BTC', 'ALL'] as const).map((tab) => (
          <button
            key={tab}
            className={`custom-btn ${store.activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTabAction(tab)}
            style={{ padding: '6px 0', fontSize: '12px', borderRadius: '6px' }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Ticker List Container */}
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
            No markets found
          </div>
        )}
      </div>
    </div>
  );
});

export default Markets;