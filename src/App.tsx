import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from './app/providers/storeProvider';
import { ProductList } from '@/features/product-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';
import { ImageUpload } from '@/features/image-upload';
import './App.css';

function App() {
  const handleImageUpload = (url: string) => {
    console.log('Изображение загружено:', url);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(`Удалить товар ${id}?`)) {
      console.log('Удаление товара:', id);
    }
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

            <Card style={{ marginTop: '1.5rem' }}>
              <CardHeader>
                <CardTitle>Список товаров</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductList onDelete={handleDelete} />
              </CardContent>
            </Card>
          </div>
        </div>
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;