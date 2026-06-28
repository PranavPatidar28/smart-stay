# Instant Navigation System

The Instant Navigation System provides immediate feedback and fast page transitions in the SmartStay application. It eliminates navigation delays by combining prefetching, optimized routing, and instant visual feedback.

## Features

- **Instant feedback** — buttons respond immediately on click via loading state.
- **Preloaded pages** — critical pages are prefetched before they're needed.
- **Smart prefetching** — background loading via `requestIdleCallback`, non-blocking.
- **Optimized transitions** — animations tuned for speed (200–300ms).
- **Loading states** — clear visual feedback during navigation.
- **Error handling** — navigation and prefetch errors are caught and logged.

### Performance targets

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Navigation response | 500ms+ | <100ms | ~5x faster |
| Page load time | 2–3s | <1s | ~3x faster |
| Transition speed | 500ms | 200–300ms | ~2x faster |
| User feedback | Delayed | Instant | Immediate |

## Table of contents

1. [Architecture overview](#architecture-overview)
2. [Core components](#core-components)
3. [Implementation details](#implementation-details)
4. [Performance optimizations](#performance-optimizations)
5. [Usage examples](#usage-examples)
6. [Configuration](#configuration)
7. [Troubleshooting](#troubleshooting)
8. [Best practices](#best-practices)
9. [Performance metrics](#performance-metrics)
10. [Quick reference](#quick-reference)

## Architecture overview

The system is built on three pillars:

1. **Prefetching strategy** — critical pages are preloaded in the background.
2. **Instant feedback** — immediate visual response to user interactions.
3. **Optimized routing** — direct router navigation that bypasses default Link behavior.

### System flow

```
User Click → Instant Visual Feedback → Prefetch (if needed) → Router Navigation → Page Load
     ↓              ↓                      ↓                      ↓                ↓
  Immediate     Button State          Background             Instant            Fast
  Response      Changes               Loading                Routing            Rendering
```

## Core components

### 1. Navigation hook (`useInstantNavigation`)

**Location**: `src/lib/navigation.ts`

A custom React hook that provides instant navigation with built-in prefetching and loading state.

Features:
- Instant navigation feedback
- Automatic prefetching (per-call, on by default)
- Loading state management
- Error handling
- Scroll behavior control

API:

```typescript
interface NavigationOptions {
  prefetch?: boolean;    // Enable/disable prefetching (default: true)
  replace?: boolean;     // Use replace instead of push (default: false)
  scroll?: boolean;      // Scroll to top after navigation (default: true)
}

const {
  navigateTo,        // Main navigation function: (href, options?) => Promise<void>
  prefetchPage,      // Prefetch a specific page: (href) => Promise<void>
  isNavigating,      // Current navigation state (boolean)
  setIsNavigating    // Manual state control
} = useInstantNavigation();
```

### 2. Navigation wrapper (`InstantNavigationWrapper`)

**Location**: `src/components/ui/InstantNavigationWrapper.tsx`

A client component wrapper that prefetches critical pages when it mounts, using the hook's `prefetchPage`. Background loading is non-blocking.

### 3. Optimized navbar

**Location**: `src/components/ui/Navbar.tsx`

Enhanced navbar with instant navigation:
- Replaced nav action links with optimized buttons (the logo intentionally keeps a `next/link` `<Link href="/" prefetch>`)
- Instant navigation using `router.push()`
- Loading state management
- Role-based access control

## Implementation details

### 1. Prefetching strategy

HTML prefetching — critical pages declared in `src/app/layout.tsx`:

```html
<link rel="prefetch" href="/listings" />
<link rel="prefetch" href="/favorites" />
<link rel="prefetch" href="/owner-dashboard" />
<link rel="prefetch" href="/settings" />
```

JavaScript prefetching — an inline script at the bottom of `src/app/layout.tsx` (in `<body>`) schedules background prefetch via `requestIdleCallback`, falling back to `setTimeout`, appending `<link rel="prefetch">` tags for the critical pages. (Note: `src/lib/navigation.ts` also exports an equivalent `prefetchCriticalPages()` helper, but it is currently imported into `layout.tsx` and never called — the inline script is what actually runs.)

```javascript
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    prefetchPages(criticalPages);
  });
} else {
  // Fallback for older browsers
  setTimeout(() => {
    prefetchPages(criticalPages);
  }, 1000);
}
```

### 2. Navigation state management

The hook sets `isNavigating` true for immediate feedback, performs the navigation, then resets the flag after a brief delay. A typical role-aware handler in a component looks like:

```typescript
const [isNavigating, setIsNavigating] = useState(false);

const handleInstantNavigation = (href: string, requiresRole?: string | null) => {
  if (requiresRole && session && session.user.role !== requiresRole) {
    setShowRoleModal(true);
    return;
  }

  setIsNavigating(true);
  router.push(href);

  if (isMenuOpen) {
    setIsMenuOpen(false);
  }

  setTimeout(() => setIsNavigating(false), 100);
};
```

### 3. CSS transition optimizations

Transition durations were reduced for responsiveness:

```css
/* Before: slow transitions */
transition-all duration-500

/* After: fast, responsive transitions */
transition-all duration-200
transition-all duration-300
```

## Performance optimizations

### 1. Critical page prefetching

Pages prefetched:
- `/listings` — main property listings
- `/favorites` — user favorites
- `/owner-dashboard` — property owner dashboard
- `/settings` — user settings

Methods: HTML `<link rel="prefetch">` tags, JavaScript background prefetching, and router-level prefetching.

### 2. Non-blocking loading

Background prefetch runs through `requestIdleCallback` so it doesn't block the main thread or user interactions.

### 3. Optimized transitions

- Reduced transition durations from 500ms to 200–300ms.
- Maintained visual quality while improving responsiveness.
- Optimized hover effects and animations.

## Usage examples

### 1. Basic instant navigation

```typescript
import { useInstantNavigation } from '@/lib/navigation';

function MyComponent() {
  const { navigateTo, isNavigating } = useInstantNavigation();

  return (
    <button
      onClick={() => navigateTo('/listings')}
      disabled={isNavigating}
      className={isNavigating ? 'opacity-75' : ''}
    >
      {isNavigating ? 'Loading...' : 'Go to Listings'}
    </button>
  );
}
```

### 2. Custom navigation options

```typescript
const { navigateTo } = useInstantNavigation();

// Navigate without prefetching
navigateTo('/settings', { prefetch: false });

// Replace current page
navigateTo('/login', { replace: true });

// Navigate without scrolling to top
navigateTo('/profile', { scroll: false });
```

### 3. Manual prefetching

```typescript
const { prefetchPage } = useInstantNavigation();

useEffect(() => {
  prefetchPage('/advanced-search');
}, []);
```

### 4. Batch prefetching

```typescript
import { prefetchPages } from '@/lib/navigation';

useEffect(() => {
  prefetchPages(['/help', '/contact', '/about']);
}, []);
```

## Configuration

### Critical pages

**Location**: `src/lib/navigation.ts`

```typescript
const criticalPages = [
  '/listings',
  '/favorites',
  '/owner-dashboard',
  '/settings'
];
```

### Prefetching strategy

- **HTML prefetching** — enabled by default via `<link rel="prefetch">` in `src/app/layout.tsx`.
- **JavaScript prefetching** — an inline script in `src/app/layout.tsx` uses `requestIdleCallback` with a `setTimeout` fallback (the `prefetchCriticalPages()` export in `src/lib/navigation.ts` is currently unused).
- **Router prefetching** — `navigateTo` calls `router.prefetch(href)` unless `prefetch: false`.

### Transition durations

- **Fast (200ms)** — immediate feedback.
- **Standard (300ms)** — smooth animations.
- **Slow (>300ms)** — avoided.

## Troubleshooting

### Navigation not working

Symptoms: clicking navigation buttons does nothing.
- Check that `useInstantNavigation` is imported correctly.
- Verify the router is available in the component context.
- Ensure the component is wrapped in the proper providers.

### Prefetching not working

Symptoms: pages still load slowly on first visit.
- Check the browser console for prefetch errors.
- Verify the critical pages array is correct.
- Ensure the prefetch links are present in the HTML head.

### Performance issues

Symptoms: slow navigation or laggy interactions.
- Check transition durations in CSS.
- Verify prefetching isn't blocking the main thread.
- Monitor the network tab for prefetch requests.

### Debug mode

Navigation and prefetch errors are logged to the browser console automatically via `console.error` (see the `catch` blocks in `src/lib/navigation.ts`). Open the browser console to inspect them; there is no separate debug flag to enable.

## Best practices

### Do

- Use `useInstantNavigation` for all navigation.
- Implement loading states for better UX.
- Prefetch critical pages on component mount.
- Use fast transitions (200–300ms).
- Use `requestIdleCallback` for background prefetch tasks.
- Handle errors gracefully.

### Don't

- Mix Link components with instant navigation.
- Use slow transitions (>300ms).
- Block the main thread with heavy prefetching.
- Prefetch too many pages at once.
- Ignore loading states or error handling.

## Performance metrics

Key indicators:

1. **Navigation response time**: < 100ms
2. **Time to Interactive (TTI)**: < 3.8s
3. **First Contentful Paint (FCP)**: < 1.8s
4. **Largest Contentful Paint (LCP)**: < 2.5s
5. **Prefetch success rate**: > 95%

Monitoring example:

```typescript
const { navigateTo } = useInstantNavigation();

const handleNavigation = async (href: string) => {
  const startTime = performance.now();
  try {
    await navigateTo(href);
    console.log(`Navigation to ${href} took ${performance.now() - startTime}ms`);
  } catch (error) {
    console.error('Navigation failed:', error);
  }
};
```

## Quick reference

### Related files

- **Hook + utilities**: `src/lib/navigation.ts` (`useInstantNavigation`, `prefetchPages`, `prefetchCriticalPages`)
- **Wrapper component**: `src/components/ui/InstantNavigationWrapper.tsx`
- **Navbar**: `src/components/ui/Navbar.tsx`
- **Layout (HTML prefetch links)**: `src/app/layout.tsx`
- **Landing page**: `src/app/page.tsx`

### API cheat-sheet

```typescript
// Hook
const { navigateTo, prefetchPage, isNavigating, setIsNavigating } = useInstantNavigation();

// navigateTo(href, options?)
navigateTo('/settings', { prefetch: false, replace: true, scroll: false });

// Standalone util — prefetch many pages at once
import { prefetchPages } from '@/lib/navigation';
prefetchPages(['/help', '/contact', '/about']);
```

### Prefetch on hover

```typescript
const { navigateTo, prefetchPage } = useInstantNavigation();

return (
  <button
    onMouseEnter={() => prefetchPage('/profile')}
    onClick={() => navigateTo('/profile')}
  >
    Profile
  </button>
);
```

### CSS classes

```css
/* Disabled state during navigation */
.opacity-75 { opacity: 0.75; }
.cursor-not-allowed { cursor: not-allowed; }
```

```
/* Transition durations — use Tailwind utilities directly (no custom classes) */
duration-200   /* preferred for instant feedback (Navbar links) */
duration-300   /* nav/logo transitions */
```
