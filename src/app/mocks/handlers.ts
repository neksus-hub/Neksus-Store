import { http, HttpResponse } from 'msw';
import { Product } from '@/entities';

// ✅ Функция для создания SVG-заглушек (как fallback)
const createPlaceholderSVG = (text: string, bgColor = '#f1f5f9', textColor = '#64748b') => {
    const displayText = text.length > 20 ? text.slice(0, 17) + '...' : text;
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='${encodeURIComponent(bgColor)}'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial, sans-serif' font-size='${displayText.length > 10 ? 16 : 20}' font-weight='500' fill='${encodeURIComponent(textColor)}' text-anchor='middle' dy='.3em'%3E${encodeURIComponent(displayText)}%3C/text%3E%3C/svg%3E`;
};

// ✅ Локальные изображения из public/images/products/
const LOCAL_IMAGES = {
    iphone: '/images/products/iphone.jpg',
    macbook: '/images/products/macbook.jpg',
    airpods: '/images/products/airpods.jpg',
};

let products: Product[] = [
    {
        id: '1',
        name: 'iPhone 15 Pro',
        description: 'Смартфон с титановым корпусом и динамическим островком',
        price: 999.99,
        imageUrl: LOCAL_IMAGES.iphone, // ✅ Реальное изображение
    },
    {
        id: '2',
        name: 'MacBook Pro 16"',
        description: 'Ноутбук с чипом M3 Pro для профессиональной работы',
        price: 2499.99,
        imageUrl: LOCAL_IMAGES.macbook, // ✅ Реальное изображение
    },
    {
        id: '3',
        name: 'AirPods Pro 2',
        description: 'Наушники с активным шумоподавлением',
        price: 249.99,
        imageUrl: LOCAL_IMAGES.airpods, // ✅ Реальное изображение
    },
];

let nextId = 4;

export const handlers = [
    http.get('/api/products', () => {
        console.log('MSW: GET /api/products');
        return HttpResponse.json(products);
    }),

    http.get('/api/products/:id', ({ params }) => {
        const { id } = params;
        console.log('MSW: GET /api/products/:id', id);
        const product = products.find((p) => p.id === id);
        if (!product) {
            return new HttpResponse(
                JSON.stringify({ error: 'Product not found' }),
                { status: 404 }
            );
        }
        return HttpResponse.json(product);
    }),

    http.post('/api/products', async ({ request }) => {
        console.log('MSW: POST /api/products');
        try {
            const body = await request.json() as Omit<Product, 'id'>;
            const newProduct: Product = {
                ...body,
                id: String(nextId++),
                imageUrl: body.imageUrl || createPlaceholderSVG(body.name || 'New Product', '#e0e7ff', '#4f46e5'),
            };
            products.push(newProduct);
            return HttpResponse.json(newProduct, { status: 201 });
        } catch (error) {
            console.error('MSW: POST error:', error);
            return new HttpResponse(
                JSON.stringify({ error: 'Failed to create product' }),
                { status: 500 }
            );
        }
    }),

    http.put('/api/products/:id', async ({ params, request }) => {
        const { id } = params;
        console.log('MSW: PUT /api/products/:id', id);
        try {
            const updates = await request.json() as Partial<Product>;
            const index = products.findIndex((p) => p.id === id);
            if (index === -1) {
                return new HttpResponse(
                    JSON.stringify({ error: 'Product not found' }),
                    { status: 404 }
                );
            }
            products[index] = { ...products[index], ...updates };
            return HttpResponse.json(products[index]);
        } catch (error) {
            console.error('MSW: PUT error:', error);
            return new HttpResponse(
                JSON.stringify({ error: 'Failed to update product' }),
                { status: 500 }
            );
        }
    }),

    http.delete('/api/products/:id', ({ params }) => {
        const { id } = params;
        console.log('MSW: DELETE /api/products/:id', id);
        const index = products.findIndex((p) => p.id === id);
        if (index === -1) {
            return new HttpResponse(
                JSON.stringify({ error: 'Product not found' }),
                { status: 404 }
            );
        }
        products.splice(index, 1);
        return HttpResponse.json({ success: true });
    }),

    http.post('/api/upload/image', async ({ request }) => {
        console.log('MSW: POST /api/upload/image');

        try {
            const formData = await request.formData();
            const file = formData.get('image') as File;

            if (file) {
                console.log('MSW: File received:', file.name, file.type, file.size);

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

                const imageUrl = URL.createObjectURL(file);
                console.log('MSW: Real image URL created:', imageUrl);

                return HttpResponse.json(
                    { imageUrl },
                    { status: 200 }
                );
            }

            console.log('MSW: No file found');
            return HttpResponse.json(
                { imageUrl: '' },
                { status: 200 }
            );

        } catch {
            return HttpResponse.json(
                { imageUrl: '' },
                { status: 200 }
            );
        }
    }),
];