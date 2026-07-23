// ===== Store Экспорты =====
export { store } from './store/store';
export type { RootState, AppDispatch } from './store/store';
export { useAppDispatch, useAppSelector } from './store/hooks';

// ===== Providers Экспорты =====
export { StoreProvider } from './providers/storeProvider';

// ===== Router Экспорты =====
export { router } from './router';

// ===== Mocks Экспорты =====
export { worker, handlers } from './mocks';