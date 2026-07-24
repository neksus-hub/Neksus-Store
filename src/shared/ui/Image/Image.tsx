import { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import styles from './Image.module.css';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    fallbackSrc?: string;
    className?: string;
}

export function Image({
    src,
    alt,
    fallbackSrc = 'https://picsum.photos/seed/fallback/200/200',
    className,
    ...props
}: ImageProps) {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            setImgSrc(fallbackSrc);
        }
    };

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={cn(styles.image, className)}
            onError={handleError}
            {...props}
        />
    );
}