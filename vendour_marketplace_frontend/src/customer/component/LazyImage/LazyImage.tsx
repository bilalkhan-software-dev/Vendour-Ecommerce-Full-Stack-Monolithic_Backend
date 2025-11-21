import React, { useState, useRef, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
    style?: React.CSSProperties;
    placeholder?: string;
    onClick?: React.MouseEventHandler<HTMLImageElement>;
}

const LazyImage = ({
    src,
    alt,
    className = "",
    style = {},
    placeholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjM1MCIgdmlld0JveD0iMCAwIDI1MCAzNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjI1MCIgaGVpZ2h0PSIzNTAiIGZpbGw9IiNGMEYwRjAiLz48cGF0aCBkPSJNMTI1IDE3NUwxMzUgMTY1TDE0NSAxNzVMMTM1IDE4NUwxMjUgMTc1WiIgZmlsbD0iI0QwRDBEMCIvPjwvc3ZnPg=="
    , onClick
}: LazyImageProps) => {
    console.log('imG:',src);
    
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        const imgElement = imgRef.current;

        if (!imgElement) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.unobserve(imgElement);
                }
            },
            {
                rootMargin: '50px', // Start loading when 50px away from viewport
                threshold: 0.1,
            }
        );

        observer.observe(imgElement);
        observerRef.current = observer;

        return () => {
            if (imgElement) {
                observer.unobserve(imgElement);
            }
        };
    }, []);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = () => {
        setHasError(true);
        setIsLoaded(true); // Stop loading indicator even on error
    };

    return (
        <Box className="relative w-full h-full">
            {/* Loading placeholder */}
            {!isLoaded && (
                <Box
                    className={`absolute inset-0 flex items-center justify-center bg-gray-100 ${className}`}
                    style={style}
                >
                    <CircularProgress size={24} sx={{ color: '#1DB954' }} />
                </Box>
            )}

            {/* Actual image */}
            <img
                ref={imgRef}
                src={isInView ? (hasError ? placeholder : src) : placeholder}
                alt={alt}
                className={`card-media ${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                style={{
                    ...style,
                    transition: 'opacity 0.3s ease-in-out',
                }}
                onClick={onClick}
                onLoad={handleLoad}
                onError={handleError}
                loading="lazy"
            />
        </Box>
    );
};

export default LazyImage;