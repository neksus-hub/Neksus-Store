import { configureStore } from '@reduxjs/toolkit';
import { productApi } from '@/entities/product/api/productApi';

/**
 * Конфигурация Redux Store
 */
export const store = configureStore({
    reducer: {
        [productApi.reducerPath]: productApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
            },
        }).concat(productApi.middleware),
    devTools: process.env.NODE_ENV !== 'production',
});

/**
 * Тип корневого состояния
 * Используется для типизации useSelector
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * Тип диспетчера
 * Используется для типизации useDispatch
 */
export type AppDispatch = typeof store.dispatch;