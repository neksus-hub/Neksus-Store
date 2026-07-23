import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { useUploadImageMutation } from '@/entities/product/api/productApi';  // ← ИСПРАВЛЕНО
import { ImagePlus, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import styles from './ImageUpload.module.css';

interface ImageUploadProps {
    onImageUploaded: (url: string) => void;
    initialImage?: string;
    className?: string;
}

export function ImageUpload({ onImageUploaded, initialImage, className }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(initialImage || null);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadImage] = useUploadImageMutation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        await processFile(file);
    };

    const processFile = async (file: File) => {
        setError(null);
        setIsUploading(true);

        // Валидация размера
        if (file.size > 5 * 1024 * 1024) {
            setError('Файл слишком большой. Максимальный размер: 5MB');
            setIsUploading(false);
            return;
        }

        // Валидация формата
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setError('Неверный формат. Используйте JPEG, PNG или WebP');
            setIsUploading(false);
            return;
        }

        // Предпросмотр
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Загрузка на сервер
        try {
            const formData = new FormData();
            formData.append('image', file);
            const result = await uploadImage(formData).unwrap();
            onImageUploaded(result.imageUrl);
        } catch (err) {
            setError('Ошибка загрузки изображения. Попробуйте ещё раз');
            setPreview(null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        setError(null);
        onImageUploaded('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            await processFile(file);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    return (
        <div className={cn(styles.container, className)}>
            <div
                className={cn(
                    styles.dropZone,
                    isDragging && styles.dragging,
                    error && styles.error,
                    preview && styles.hasImage,
                    isUploading && styles.uploading
                )}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
            >
                {preview ? (
                    <>
                        <div className={styles.previewContainer}>
                            <div className={styles.previewWrapper}>
                                <img src={preview} alt="Preview" className={styles.previewImage} />
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove();
                                }}
                                className={styles.removeButton}
                                type="button"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        {isUploading && (
                            <div className={styles.uploadingStatus}>
                                <Loader2 className="animate-spin" size={16} />
                                Загрузка...
                            </div>
                        )}
                    </>
                ) : (
                    <div className={styles.uploadPlaceholder}>
                        <div className={styles.iconWrapper}>
                            <ImagePlus size={32} />
                        </div>
                        <p className={styles.uploadText}>Нажмите или перетащите изображение</p>
                        <p className={styles.uploadSubtext}>JPEG, PNG, WebP (макс. 5MB)</p>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isUploading}
                />
            </div>

            {error && (
                <div className={styles.errorMessage}>
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}

            {preview && !error && !isUploading && (
                <div className={styles.successMessage}>
                    <CheckCircle size={16} />
                    Изображение загружено
                </div>
            )}
        </div>
    );
}