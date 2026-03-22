import React, { useEffect, useRef, useState } from 'react';

interface LazyLoadWrapperProps {
  children: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  placeholder?: React.ReactNode;
}

export default function LazyLoadWrapper({
  children,
  threshold = 0.1,
  rootMargin = '100px',
  className = '',
  placeholder = null,
}: LazyLoadWrapperProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, rootMargin]);

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : placeholder}
    </div>
  );
}