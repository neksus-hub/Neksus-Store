import { useParams } from 'react-router-dom';
import { EditProductForm } from '@/features/edit-product';
import styles from './EditProductPage.module.css';

export function EditProductPage() {
    const { id } = useParams<{ id: string }>();

    if (!id) {
        return (
            <div className={styles.page}>
                <div className={styles.container}>
                    <p>Неверный ID товара</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <EditProductForm productId={id} />
            </div>
        </div>
    );
}