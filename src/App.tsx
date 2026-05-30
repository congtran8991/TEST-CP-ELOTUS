import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { initializeApplication } from './store';
import Header from './components/Layout/Header';

export const App = observer(() => {
  useEffect(() => {
    // Fire application initialization action on mount
    initializeApplication();
  }, []);

  return (
    <div className="dashboard-grid">
      {/* Header Panel */}
      <Header />
    </div>
  );
});

export default App;
