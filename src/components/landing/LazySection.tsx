import { useRef, useState, useEffect, ReactNode } from 'react';
import { useInView } from 'framer-motion';

interface LazySectionProps {
  children: ReactNode;
  className?: string;
  /** Margin around the root for triggering earlier */
  rootMargin?: `${number}px ${number}px ${number}px ${number}px`;
  /** Placeholder height before content loads */
  minHeight?: string;
}

export const LazySection = ({ 
  children, 
  className = '',
  rootMargin = "0px 0px 200px 0px",
  minHeight = '400px'
}: LazySectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { 
    once: false,
    margin: rootMargin 
  });
  const [hasBeenInView, setHasBeenInView] = useState(false);

  // Once in view, keep mounted
  useEffect(() => {
    if (isInView && !hasBeenInView) {
      setHasBeenInView(true);
    }
  }, [isInView, hasBeenInView]);

  return (
    <div 
      ref={ref} 
      className={className}
      style={{ minHeight: hasBeenInView ? undefined : minHeight }}
    >
      {hasBeenInView ? children : null}
    </div>
  );
};

