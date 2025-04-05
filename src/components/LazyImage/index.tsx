// components/LazyImage.tsx

import { useState, useEffect } from 'react';

const LazyImage: React.FC<{
    src: string;
    alt: string;
    style?: any;
    onMouseEnter?: any;
    onMouseLeave?: any;
    width?: any;
    height?: any;
    className?: any;
    sizes?: any;
}> = ({
    src,
    alt,
    style,
    onMouseEnter,
    onMouseLeave,
    width,
    height,
    className,
    sizes
}) => {
        const [isVisible, setIsVisible] = useState(false);

        useEffect(() => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.unobserve(entry.target);
                    }
                },
                { rootMargin: '0px 0px 100px 0px' } // Adjust root margin as needed
            );

            observer.observe(document.getElementById('lazy-image')!);

            return () => {
                observer.disconnect();
            };
        }, []);

        return (
            <img
                id="lazy-image"
                src={src !== null && src !== "" ? src : "assets/images/brandDam.png"}
                alt={alt}
                loading="lazy"
                style={style}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                width={width}
                height={height}
                className={className}
                sizes={sizes}
            />
        );
    };

export default LazyImage;
