import { createBrowserRouter } from 'react-router-dom';
import { ProductsPage } from '@/pages/ProductsPage/index';
import { AddProductPage } from '@/pages/AddProductPage/index';
import { EditProductPage } from '@/pages/EditProductPage/index';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <ProductsPage />,
    },
    {
        path: '/add',
        element: <AddProductPage />,
    },
    {
        path: '/edit/:id',
        element: <EditProductPage />,
    },
]);