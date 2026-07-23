import { Provider } from 'react-redux';
import { store } from '../store/store';

interface StoreProviderProps {
    children: React.ReactNode;
}

/**
 * Провайдер Redux Store для приложения
 * Оборачивает всё приложение в Provider
 * 
 * @example
 * <StoreProvider>
 *   <App />
 * </StoreProvider>
 */
export function StoreProvider({ children }: StoreProviderProps) {
    return <Provider store={store}>{children}</Provider>;
}