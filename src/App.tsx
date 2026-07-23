import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from './app/providers/storeProvider';
import { useGetProductsQuery } from './entities/product/api/productApi';
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';
import './App.css';

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
      <p className="text-muted">✅ Redux работает!</p>
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

            {/* Тестовые UI компоненты */}
            <Card style={{ marginTop: '2rem' }}>
              <CardHeader>
                <CardTitle>Тестовые UI компоненты</CardTitle>
              </CardHeader>
              <CardContent style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Button>Default</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button size="sm">Small</Button>
                <Button size="lg">Large</Button>

                <div style={{ width: '100%', marginTop: '1rem' }}>
                  <Label>Имя пользователя</Label>
                  <Input placeholder="Введите имя" />
                </div>

                <div style={{ width: '100%' }}>
                  <Label error>Email</Label>
                  <Input error placeholder="Введите email" />
                </div>
              </CardContent>
            </Card>

            <ProductsTest />
          </div>
        </div>
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;