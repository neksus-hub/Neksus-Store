import { http, HttpResponse } from 'msw';
import { Product } from '@/entities/product/model/types';

/**
 * Хранилище товаров в памяти
 * Инициализируется тестовыми данными
 */
let products: Product[] = [
    {
        id: '1',
        name: 'iPhone 15 Pro',
        description: 'Смартфон с титановым корпусом и динамическим островком',
        price: 999.99,
        imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200',
    },
    {
        id: '2',
        name: 'MacBook Pro 16"',
        description: 'Ноутбук с чипом M3 Pro для профессиональной работы',
        price: 2499.99,
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200',
    },
    {
        id: '3',
        name: 'AirPods Pro 2',
        description: 'Наушники с активным шумоподавлением',
        price: 249.99,
        imageUrl: 'https://images.unsplash.com/photo-1603351154351-5e2d0630f185?w=200',
    },
];

let nextId = 4;

export const handlers = [
    // GET /api/products
    http.get('/api/products', () => {
        return HttpResponse.json(products);
    }),

    // GET /api/products/:id
    http.get('/api/products/:id', ({ params }) => {
        const { id } = params;
        const product = products.find((p) => p.id === id);
        if (!product) {
            return new HttpResponse(null, { status: 404 });
        }
        return HttpResponse.json(product);
    }),

    // POST /api/products
    http.post('/api/products', async ({ request }) => {
        const body = await request.json() as Omit<Product, 'id'>;
        const newProduct: Product = {
            ...body,
            id: String(nextId++),
        };
        products.push(newProduct);
        return HttpResponse.json(newProduct, { status: 201 });
    }),

    // PUT /api/products/:id
    http.put('/api/products/:id', async ({ params, request }) => {
        const { id } = params;
        const updates = await request.json() as Partial<Product>;
        const index = products.findIndex((p) => p.id === id);
        if (index === -1) {
            return new HttpResponse(null, { status: 404 });
        }
        products[index] = { ...products[index], ...updates };
        return HttpResponse.json(products[index]);
    }),

    // DELETE /api/products/:id
    http.delete('/api/products/:id', ({ params }) => {
        const { id } = params;
        const index = products.findIndex((p) => p.id === id);
        if (index === -1) {
            return new HttpResponse(null, { status: 404 });
        }
        products.splice(index, 1);
        return HttpResponse.json({ success: true });
    }),

    // POST /api/upload/image
    http.post('/api/upload/image', async ({ request }) => {
        const formData = await request.formData();
        const file = formData.get('image') as File;

        if (!file) {
            return new HttpResponse(
                JSON.stringify({ error: 'No image provided' }),
                { status: 400 }
            );
        }

        if (file.size > 5 * 1024 * 1024) {
            return new HttpResponse(
                JSON.stringify({ error: 'File too large (max 5MB)' }),
                { status: 400 }
            );
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return new HttpResponse(
                JSON.stringify({ error: 'Invalid file format' }),
                { status: 400 }
            );
        }

        const imageUrl = `/uploads/${Date.now()}-${file.name}`;
        return HttpResponse.json({ imageUrl });
    }),
];