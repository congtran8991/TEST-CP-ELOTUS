import { useEffect } from 'react';
import { observer } from 'mobx-react';
import Header from './components/Layout/Header';
import Markets from './components/Markets';
import { initializeApplicationAction } from './store';
import Chart from './components/Chart';
import OrderBook from './components/OrderBook';

export const App = observer(() => {
  useEffect(() => {
    console.log('initializeApplicationAction')
    // Fire application initialization action on mount
    initializeApplicationAction();
  }, []);

  return (
    <div className="dashboard-grid">
      {/* Header Panel */}
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
