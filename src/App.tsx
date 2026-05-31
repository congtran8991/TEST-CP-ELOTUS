import { useEffect } from 'react';
import { observer } from 'mobx-react';
import Header from './components/Layout/Header';
import Markets from './components/Markets';
import { getStore, initializeApplicationAction } from './store';
import Chart from './components/Chart';
import OrderBook from './components/OrderBook';

export const App = observer(() => {
  const store = getStore();

  useEffect(() => {
    console.log('initializeApplicationAction')
    // Fire application initialization action on mount
    initializeApplicationAction();
  }, []);

  useEffect(() => {
    // Ép thuộc tính data-theme theo store để CSS tự động đổi màu hàng loạt
    document.documentElement.setAttribute('data-theme', store.theme);
  }, [store.theme]);

  return (
    <div className="dashboard-grid">
      <Header />

      <Markets />

      <main className="main-chart-area">
        <Chart />
      </main>

      <OrderBook />

    </div>
  );
});

export default App;
