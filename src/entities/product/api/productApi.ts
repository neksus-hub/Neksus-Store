import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    Product,
    CreateProductDto,
    UpdateProductDto,
    UploadImageResponse,
    DeleteProductResponse
} from '../model/types';

const BASE_URL = import.meta.env.VITE_API_URL || '';

export const productApi = createApi({
    reducerPath: 'productApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    tagTypes: ['Product'],
    endpoints: (builder) => ({
        // GET /api/products
        getProducts: builder.query<Product[], void>({
            query: () => '/api/products',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Product' as const, id })),
                        { type: 'Product', id: 'LIST' },
                    ]
                    : [{ type: 'Product', id: 'LIST' }],
        }),

        // GET /api/products/:id
        getProductById: builder.query<Product, string>({
            query: (id) => `/api/products/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Product', id }],
        }),

        // POST /api/products
        createProduct: builder.mutation<Product, CreateProductDto>({
            query: (body) => ({
                url: '/api/products',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Product', id: 'LIST' }],
        }),

        // PUT /api/products/:id
        updateProduct: builder.mutation<Product, { id: string; data: UpdateProductDto }>({
            query: ({ id, data }) => ({
                url: `/api/products/${id}`,
                method: 'PUT',
                body: data,
            }),

            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Product', id },
                { type: 'Product', id: 'LIST' },
            ],
        }),

        // DELETE /api/products/:id
        deleteProduct: builder.mutation<DeleteProductResponse, string>({
            query: (id) => ({
                url: `/api/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Product', id: 'LIST' }],
        }),

        // POST /api/upload/image
        uploadImage: builder.mutation<UploadImageResponse, FormData>({
            query: (formData) => ({
                url: '/api/upload/image',
                method: 'POST',
                body: formData,
                formData: true,
            }),
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductByIdQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useUploadImageMutation,
} = productApi;