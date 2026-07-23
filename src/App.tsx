import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from './app/providers/storeProvider';
import { useGetProductsQuery } from './entities/product/api/productApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';
import { ImageUpload } from '@/features/image-upload';
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
  const handleImageUpload = (url: string) => {
    console.log('Изображение загружено:', url);
  };

  return (
    <StoreProvider>
      <BrowserRouter>
        <div className="app">
          <div className="container">
            <h1>Neksus-Store</h1>
            <p className="text-muted">Магазин товаров</p>

            <Card>
              <CardHeader>
                <CardTitle>Тест загрузки изображений</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload onImageUploaded={handleImageUpload} />
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