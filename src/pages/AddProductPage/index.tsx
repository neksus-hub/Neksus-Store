import { AddProductForm } from '@/features/add-product';
import styles from './AddProductPage.module.css';

export function AddProductPage() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <AddProductForm />
            </div>
        </div>
    );
}