import React, { useEffect, useRef, useState, ReactNode } from 'react';

interface AnimatedSectionProps {
    children: ReactNode;
    className?: string;
    animationClass?: string;
    delay?: string;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, className, animationClass = 'fade-in-up', delay = '0s' }) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return (
        <div
            ref={ref}
            className={`${className || ''} scroll-animate ${animationClass} ${isVisible ? 'visible' : ''}`}
            style={{ animationDelay: delay }}
        >
            {children}
        </div>
    );
};