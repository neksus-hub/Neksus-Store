import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from './app/providers/storeProvider';
import { useGetProductsQuery } from './entities/product/api/productApi';
import './App.css';

// Временный компонент для проверки
function ProductsTest() {
  const { data: products, isLoading, error } = useGetProductsQuery();

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка загрузки</div>;

  return (
    <div>
      <h2>Товары (проверка Redux):</h2>
      <ul>
        {products?.slice(0, 3).map(product => (
          <li key={product.id}>
            {product.name} - ${product.price}
          </li>
        ))}
      </ul>
      <p className="text-muted">✅ Redux работает! (но MSW ещё не настроен)</p>
    </div>
  );
}

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <div className="app">
          <div className="container">
            <h1>Neksus-Store</h1>
            <p className="text-muted">Магазин товаров</p>
            <ProductsTest />
          </div>
        </div>
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;