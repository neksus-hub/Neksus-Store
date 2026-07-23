import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetProductsQuery } from '@/entities/product/api/productApi';
import { DeleteProductButton } from '@/features/delete-product/ui/DeleteProductButton';
import { Button } from '@/shared/ui/Button/Button';
import { Card, CardContent } from '@/shared/ui/Card/Card';
import { Pencil, Search, Package, AlertCircle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import styles from './ProductList.module.css';

export function ProductList() {
    const navigate = useNavigate();
    const { data: products = [], isLoading, error, refetch } = useGetProductsQuery();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteSuccess = () => {
        refetch();
    };

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner} />
                <p className={styles.loadingText}>Загрузка товаров...</p>
            </div>
        );
    }

    if (error) {
        return (
            <Card variant="destructive" className={styles.errorCard}>
                <CardContent>
                    <AlertCircle className={styles.errorIcon} />
                    <p className={styles.errorTitle}>Ошибка загрузки товаров</p>
                    <p className={styles.errorSubtext}>Пожалуйста, попробуйте обновить страницу</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className={styles.container}>
            {/* Поиск */}
            <div className={styles.searchWrapper}>
                <Search className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Поиск по названию товара..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm('')}
                        className={styles.clearButton}
                        type="button"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Статистика */}
            <div className={styles.stats}>
                <span>
                    Найдено товаров: <span className={styles.statsCount}>{filteredProducts.length}</span>
                </span>
                {searchTerm && filteredProducts.length === 0 && (
                    <span className={styles.statsEmpty}>По вашему запросу ничего не найдено</span>
                )}
            </div>

            {/* Список товаров */}
            {filteredProducts.length === 0 ? (
                <Card className={styles.emptyCard}>
                    <CardContent>
                        <Package className={styles.emptyIcon} />
                        <p className={styles.emptyTitle}>Товары не найдены</p>
                        <p className={styles.emptySubtext}>
                            {searchTerm ? 'Попробуйте изменить поисковый запрос' : 'Добавьте первый товар'}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* Десктопная таблица */}
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead className={styles.tableHeader}>
                                <tr>
                                    <th className={styles.imageCell}>Изображение</th>
                                    <th>Название</th>
                                    <th>Описание</th>
                                    <th>Цена</th>
                                    <th style={{ textAlign: 'right' }}>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className={styles.tableRow}>
                                        <td className={cn(styles.tableCell, styles.imageCell)}>
                                            <div className={styles.imageWrapper}>
                                                <img
                                                    src={product.imageUrl || 'https://via.placeholder.com/56/cccccc/666666?text=No+Image'}
                                                    alt={product.name}
                                                    className={styles.image}
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src =
                                                            'https://via.placeholder.com/56/cccccc/666666?text=No+Image';
                                                    }}
                                                />
                                            </div>
                                        </td>
                                        <td className={styles.tableCell}>
                                            <div className={styles.productName}>{product.name}</div>
                                        </td>
                                        <td className={styles.tableCell}>
                                            <div className={styles.productDescription}>{product.description}</div>
                                        </td>
                                        <td className={styles.tableCell}>
                                            <div className={styles.productPrice}>${product.price.toFixed(2)}</div>
                                        </td>
                                        <td className={styles.tableCell}>
                                            <div className={styles.actions} style={{ justifyContent: 'flex-end' }}>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => navigate(`/edit/${product.id}`)}
                                                >
                                                    <Pencil size={16} />
                                                    <span className="hidden sm:inline">Изменить</span>
                                                </Button>
                                                <DeleteProductButton
                                                    productId={product.id}
                                                    productName={product.name}
                                                    onSuccess={handleDeleteSuccess}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Мобильная сетка */}
                    <div className={styles.mobileGrid}>
                        {filteredProducts.map((product) => (
                            <div key={product.id} className={styles.mobileCard}>
                                <div className={styles.mobileContent}>
                                    <div className={styles.mobileImage}>
                                        <img
                                            src={product.imageUrl || 'https://via.placeholder.com/64/cccccc/666666?text=No+Image'}
                                            alt={product.name}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src =
                                                    'https://via.placeholder.com/64/cccccc/666666?text=No+Image';
                                            }}
                                        />
                                    </div>
                                    <div className={styles.mobileInfo}>
                                        <div className={styles.mobileName}>{product.name}</div>
                                        <div className={styles.mobileDescription}>{product.description}</div>
                                        <div className={styles.mobileFooter}>
                                            <span className={styles.mobilePrice}>${product.price.toFixed(2)}</span>
                                            <div className={styles.mobileActions}>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => navigate(`/edit/${product.id}`)}
                                                >
                                                    <Pencil size={16} />
                                                </Button>
                                                <DeleteProductButton
                                                    productId={product.id}
                                                    productName={product.name}
                                                    onSuccess={handleDeleteSuccess}
                                                    size="sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}