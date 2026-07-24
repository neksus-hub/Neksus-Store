import { useState } from 'react';
import { useDeleteProductMutation } from '@/entities';
import { Button } from '@/shared/ui/Button/Button';
import { Trash2, AlertTriangle } from 'lucide-react';
import styles from './DeleteProductButton.module.css';

interface DeleteProductButtonProps {
    productId: string;
    productName?: string;
    onSuccess?: () => void;
    className?: string;
    variant?: 'default' | 'destructive' | 'outline';
    size?: 'default' | 'sm' | 'lg';
}

export function DeleteProductButton({
    productId,
    productName,
    onSuccess,
    className,
    variant = 'destructive',
    size = 'sm',
}: DeleteProductButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteProduct, { isLoading }] = useDeleteProductMutation();

    const handleDelete = async () => {
        try {
            await deleteProduct(productId).unwrap();
            setIsModalOpen(false);
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
    };

    return (
        <>
            {/* Кнопка удаления */}
            <Button
                variant={variant}
                size={size}
                onClick={() => setIsModalOpen(true)}
                className={className}
            >
                <Trash2 size={16} />
                <span className="hidden sm:inline">Удалить</span>
            </Button>

            {/* Модальное окно подтверждения */}
            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <AlertTriangle className={styles.modalIcon} />
                        <h3 className={styles.modalTitle}>Подтверждение удаления</h3>
                        <p className={styles.modalDescription}>
                            Вы уверены, что хотите удалить товар{' '}
                            <strong>{productName || productId}</strong>?
                            <br />
                            <span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                                Это действие нельзя отменить.
                            </span>
                        </p>
                        <div className={styles.modalActions}>
                            <Button
                                variant="outline"
                                onClick={() => setIsModalOpen(false)}
                                className={styles.cancelButton}
                                disabled={isLoading}
                            >
                                Отмена
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                className={styles.deleteButton}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Удаление...' : 'Удалить'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}