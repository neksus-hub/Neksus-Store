import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import styles from './Input.module.css';

type InputSize = 'default' | 'sm' | 'lg';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    /** Состояние ошибки */
    error?: boolean;
    /** Размер инпута */
    size?: InputSize;
    /** Дополнительный CSS-класс */
    className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, size = 'default', ...props }, ref) => {
        const sizeClass = styles[`size-${size}`] || styles['size-default'];

        return (
            <input
                ref={ref}
                className={cn(styles.input, sizeClass, error && styles.error, className)}
                {...props}
            />
        );
    }
);

Input.displayName = 'Input';