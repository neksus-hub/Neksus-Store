import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import {
    productSchema,
    type ProductFormData,
    useGetProductByIdQuery,
    useUpdateProductMutation
} from '@/entities';
import { Button } from '@/shared/ui/Button/Button';
import { Input } from '@/shared/ui/Input/Input';
import { Label } from '@/shared/ui/Label/Label';
import { Card, CardContent } from '@/shared/ui/Card/Card';
import { ImageUpload } from '@/features/image-upload';
import { Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import styles from './EditProductForm.module.css';

interface EditProductFormProps {
    productId: string;
}

export function EditProductForm({ productId }: EditProductFormProps) {
    const navigate = useNavigate();
    const { data: product, isLoading: isLoadingProduct, error: productError } = useGetProductByIdQuery(productId);
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isDirty, isValid },
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        values: product
            ? {
                name: product.name,
                description: product.description,
                price: product.price,
                imageUrl: product.imageUrl || '',
            }
            : undefined,
        mode: 'onChange',
    });

    const imageUrl = watch('imageUrl');

    const onSubmit = async (data: ProductFormData) => {
        try {
            const productData = {
                name: data.name,
                description: data.description,
                price: data.price,
                imageUrl: data.imageUrl || '',
            };
            await updateProduct({ id: productId, data: productData }).unwrap();
            navigate('/');
        } catch (error) {
            console.error('Failed to update product:', error);
        }
    };

    // Состояние загрузки
    if (isLoadingProduct) {
        return (
            <Card>
                <CardContent className={styles.loadingContainer}>
                    <div className={styles.loadingSpinner} />
                    <p className={styles.loadingText}>Загрузка товара...</p>
                </CardContent>
            </Card>
        );
    }

    // Состояние ошибки
    if (productError || !product) {
        return (
            <Card variant="destructive">
                <CardContent className={styles.errorContainer}>
                    <AlertCircle className={styles.errorIcon} />
                    <p className={styles.errorTitle}>Товар не найден</p>
                    <p className={styles.errorSubtext}>Пожалуйста, проверьте ID товара</p>
                    <Button onClick={() => navigate('/')} style={{ marginTop: '1rem' }}>
                        Вернуться к списку
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    {/* Заголовок */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Редактирование товара</h2>
                            <p className="text-muted text-sm mt-1">
                                Измените данные товара
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/')}
                        >
                            <ArrowLeft size={16} />
                            Назад
                        </Button>
                    </div>

                    {/* Поля формы */}
                    <div className={styles.fieldGroup}>
                        <Label className={styles.fieldLabel} required>
                            Название товара
                        </Label>
                        <Input
                            {...register('name')}
                            placeholder="Введите название товара"
                            error={!!errors.name}
                            className={errors.name && styles.error}
                        />
                        {errors.name && (
                            <p className={styles.errorMessage}>
                                <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div className={styles.fieldGroup}>
                        <Label className={styles.fieldLabel} required>
                            Описание
                        </Label>
                        <textarea
                            {...register('description')}
                            className={cn(
                                styles.input,
                                styles.textarea,
                                errors.description && styles.error
                            )}
                            placeholder="Введите подробное описание товара"
                        />
                        {errors.description && (
                            <p className={styles.errorMessage}>
                                <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    <div className={styles.fieldGroup}>
                        <Label className={styles.fieldLabel} required>
                            Цена
                        </Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">
                                $
                            </span>
                            <Input
                                type="number"
                                step="0.01"
                                min="0.01"
                                {...register('price', { valueAsNumber: true })}
                                placeholder="0.00"
                                error={!!errors.price}
                                className={cn(
                                    'pl-8',
                                    errors.price && styles.error
                                )}
                            />
                        </div>
                        {errors.price && (
                            <p className={styles.errorMessage}>
                                <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                                {errors.price.message}
                            </p>
                        )}
                    </div>

                    <div className={styles.fieldGroup}>
                        <Label className={styles.fieldLabel}>Изображение</Label>
                        <ImageUpload
                            onImageUploaded={(url) => setValue('imageUrl', url)}
                            initialImage={imageUrl}
                        />
                        {errors.imageUrl && (
                            <p className={styles.errorMessage}>
                                <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                                {errors.imageUrl.message}
                            </p>
                        )}
                        <p className={styles.helperText}>
                            Поддерживаемые форматы: JPEG, PNG, WebP. Максимальный размер: 5MB
                        </p>
                    </div>

                    {/* Кнопки */}
                    <div className={styles.actions}>
                        <Button
                            type="submit"
                            disabled={isUpdating || !isDirty || !isValid}
                            className={styles.submitButton}
                        >
                            {isUpdating ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Сохранение...
                                </>
                            ) : (
                                'Сохранить изменения'
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/')}
                            className={styles.cancelButton}
                        >
                            Отмена
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}