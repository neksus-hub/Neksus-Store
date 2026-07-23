import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import styles from './Button.module.css';

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
        const variantClass = styles[variant] || styles.default;
        const sizeClass = styles[`size-${size}`] || styles['size-default'];

        return (
            <button
                ref={ref}
                className={cn(styles.button, variantClass, sizeClass, className)}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';