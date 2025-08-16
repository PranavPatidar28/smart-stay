"use client";

import { useEffect } from 'react';
import { useInstantNavigation } from '@/lib/navigation';

interface InstantNavigationWrapperProps {
  children: React.ReactNode;
}

/**
 * Client component wrapper that provides instant navigation functionality
 * and prefetches critical pages on mount
 */
export default function InstantNavigationWrapper({ children }: InstantNavigationWrapperProps) {
  const { prefetchPage } = useInstantNavigation();

  useEffect(() => {
    // Prefetch critical pages when component mounts
    const criticalPages = [
      '/listings',
      '/favorites', 
      '/owner-dashboard',
      '/settings'
    ];

    criticalPages.forEach(page => {
      prefetchPage(page);
    });
  }, [prefetchPage]);

  return <>{children}</>;
}
