import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import styles from './Label.module.css';

type LabelSize = 'default' | 'sm' | 'lg';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    /** Поле обязательно */
    required?: boolean;
    /** Состояние ошибки */
    error?: boolean;
    /** Состояние disabled */
    disabled?: boolean;
    /** Размер */
    size?: LabelSize;
    /** Дополнительный CSS-класс */
    className?: string;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
    ({ className, required, error, disabled, size = 'default', children, ...props }, ref) => {
        const sizeClass = styles[`size-${size}`] || '';

        return (
            <label
                ref={ref}
                className={cn(
                    styles.label,
                    required && styles.required,
                    error && styles.error,
                    disabled && styles.disabled,
                    sizeClass,
                    className
                )}
                {...props}
            >
                {children}
            </label>
        );
    }
);

Label.displayName = 'Label';