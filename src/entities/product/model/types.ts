
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
}

export type CreateProductDto = Omit<Product, 'id'>;

export type UpdateProductDto = Partial<CreateProductDto>;

export interface UploadImageResponse {
    imageUrl: string;
}

export interface DeleteProductResponse {
    success: boolean;
}