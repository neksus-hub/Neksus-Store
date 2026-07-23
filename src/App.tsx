import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from './app/providers/storeProvider';
import './App.css';


function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <div className="app">
          <div className="container">
            <h1>Neksus-Store</h1>
            <p className="text-muted">Магазин товаров</p>
          </div>
        </div>
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;