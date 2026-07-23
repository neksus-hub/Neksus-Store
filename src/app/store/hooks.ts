import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * Типизированный хук useDispatch
 * Использовать вместо обычного useDispatch во всём приложении
 * 
 * @example
 * const dispatch = useAppDispatch();
 * dispatch(createProduct(newProduct));
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Типизированный хук useSelector
 * Использовать вместо обычного useSelector во всём приложении
 * 
 * @example
 * const products = useAppSelector(state => state.productApi.queries.getProducts?.data);
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;