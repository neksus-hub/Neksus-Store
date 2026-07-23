import { useNavigate } from 'react-router-dom';
import { ProductList } from '@/features/product-list';
import { Button } from '@/shared/ui/Button/Button';
import { Plus, ShoppingBag } from 'lucide-react';
import styles from './ProductsPage.module.css';

export function ProductsPage() {
    const navigate = useNavigate();

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <div className={styles.headerIcon}>
                            <ShoppingBag size={32} />
                        </div>
                        <div>
                            <h1 className={styles.headerTitle}>Каталог товаров</h1>
                            <p className={styles.headerSubtitle}>Управляйте ассортиментом вашего магазина</p>
                        </div>
                    </div>
                    <Button onClick={() => navigate('/add')} size="lg">
                        <Plus size={20} />
                        Добавить товар
                    </Button>
                </div>

                <ProductList />
            </div>
        </div>
    );
}