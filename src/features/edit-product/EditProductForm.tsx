import { useState, useEffect } from 'react';
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
        reset,
        trigger,
        formState: { errors, isValid },
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            imageUrl: '',
        },
        mode: 'onChange',
    });

    const imageUrl = watch('imageUrl');
    const name = watch('name');
    const description = watch('description');
    const price = watch('price');

    const [hasChanges, setHasChanges] = useState(false);
    const [initialValues, setInitialValues] = useState<ProductFormData | null>(null);

    useEffect(() => {
        if (product) {
            const values = {
                name: product.name,
                description: product.description,
                price: product.price,
                imageUrl: product.imageUrl || '',
            };
            reset(values);
            setInitialValues(values);
            setHasChanges(false);
            setTimeout(() => trigger(), 100);
        }
    }, [product, reset, trigger]);

    useEffect(() => {
        if (initialValues) {
            const isChanged =
                name !== initialValues.name ||
                description !== initialValues.description ||
                price !== initialValues.price ||
                imageUrl !== initialValues.imageUrl;

            setHasChanges(isChanged);

            if (isChanged) {
                trigger();
            }
        }
    }, [name, description, price, imageUrl, initialValues, trigger]);

    const onSubmit = async (data: ProductFormData) => {
        try {
            const productData = {
                name: data.name.trim(),
                description: data.description.trim(),
                price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
                imageUrl: data.imageUrl || '',
            };
            await updateProduct({ id: productId, data: productData }).unwrap();
            navigate('/');
        } catch (error) {
            console.error('Failed to update product:', error);
        }
    };

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

    const isButtonDisabled = isUpdating || !hasChanges || !isValid;

    return (
        <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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
                                type="text"
                                {...register('price', {
                                    valueAsNumber: true,
                                    setValueAs: (v) => {
                                        if (!v || v === '') return 0;
                                        let normalized = v.replace(',', '.');
                                        normalized = normalized.replace(/[^0-9.]/g, '');
                                        const num = parseFloat(normalized);
                                        if (isNaN(num) || num < 0) return 0;
                                        return Math.round(num * 100) / 100;
                                    }
                                })}
                                placeholder="0.00"
                                error={!!errors.price}
                                className={cn(
                                    'pl-8',
                                    errors.price && styles.error
                                )}
                                onBlur={(e) => {
                                    let value = e.target.value;
                                    if (value) {
                                        const normalized = value.replace(',', '.');
                                        const num = parseFloat(normalized);
                                        if (!isNaN(num) && num >= 0) {
                                            const rounded = Math.round(num * 100) / 100;
                                            e.target.value = rounded.toString();
                                            setValue('price', rounded, { shouldValidate: true });
                                        }
                                    }
                                }}
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
                            onImageUploaded={(url) => {
                                setValue('imageUrl', url);
                            }}
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

                    <div className={styles.actions}>
                        <Button
                            type="submit"
                            disabled={isButtonDisabled}
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