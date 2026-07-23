import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from './app/providers/storeProvider';
import { ProductList } from '@/features/product-list';
import { AddProductForm } from '@/features/add-product';
import { EditProductForm } from '@/features/edit-product';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card/Card';
import './App.css';

function App() {
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
                <CardTitle>Создание товара</CardTitle>
              </CardHeader>
              <CardContent>
                <AddProductForm />
              </CardContent>
            </Card>

            <Card style={{ marginTop: '1.5rem' }}>
              <CardHeader>
                <CardTitle>Редактирование товара (ID: 1)</CardTitle>
              </CardHeader>
              <CardContent>
                <EditProductForm productId="1" />
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