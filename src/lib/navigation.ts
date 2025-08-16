import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

/**
 * Custom hook for instant navigation with prefetching and loading states
 */
export function useInstantNavigation() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const navigateTo = useCallback(async (href: string, options?: {
    prefetch?: boolean;
    replace?: boolean;
    scroll?: boolean;
  }) => {
    const { prefetch = true, replace = false, scroll = true } = options || {};

    // Set navigating state for immediate feedback
    setIsNavigating(true);

    try {
      // Prefetch the page if enabled
      if (prefetch) {
        await router.prefetch(href);
      }

      // Navigate immediately
      if (replace) {
        router.replace(href);
      } else {
        router.push(href);
      }

      // Scroll to top if enabled
      if (scroll) {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      // Reset navigation state after a brief delay
      setTimeout(() => setIsNavigating(false), 100);
    }
  }, [router]);

  const prefetchPage = useCallback(async (href: string) => {
    try {
      await router.prefetch(href);
    } catch (error) {
      console.error('Prefetch error:', error);
    }
  }, [router]);

  return {
    navigateTo,
    prefetchPage,
    isNavigating,
    setIsNavigating
  };
}

/**
 * Utility function to prefetch multiple pages at once
 */
export async function prefetchPages(hrefs: string[]) {
  const promises = hrefs.map(href => {
    // Create a link element to trigger prefetch
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
    
    return new Promise<void>((resolve) => {
      link.onload = () => resolve();
      link.onerror = () => resolve(); // Resolve even on error to not block
    });
  });

  await Promise.all(promises);
}

/**
 * Prefetch critical pages on app load
 */
export function prefetchCriticalPages() {
  if (typeof window !== 'undefined') {
    // Prefetch main navigation pages
    const criticalPages = [
      '/listings',
      '/favorites',
      '/owner-dashboard',
      '/settings'
    ];

    // Use requestIdleCallback for non-blocking prefetch
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        prefetchPages(criticalPages);
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        prefetchPages(criticalPages);
      }, 1000);
    }
  }
}
