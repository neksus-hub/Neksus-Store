// ===== Product Экспорты =====
export {
    productApi,
    useGetProductsQuery,
    useGetProductByIdQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useUploadImageMutation
} from './product/api/productApi';

export type {
    Product,
    CreateProductDto,
    UpdateProductDto,
    UploadImageResponse,
    DeleteProductResponse
} from './product/model/types';

export { productSchema } from './product/model/schema';
export type { ProductFormData } from './product/model/schema';