# Instant Navigation Quick Reference

## 🚀 Quick Start

### 1. Basic Navigation
```typescript
import { useInstantNavigation } from '@/lib/navigation';

function MyComponent() {
  const { navigateTo, isNavigating } = useInstantNavigation();
  
  return (
    <button 
      onClick={() => navigateTo('/listings')}
      disabled={isNavigating}
    >
      Go to Listings
    </button>
  );
}
```

### 2. Navigation with Options
```typescript
const { navigateTo } = useInstantNavigation();

// Custom options
navigateTo('/settings', { 
  prefetch: false,    // Skip prefetching
  replace: true,      // Replace current page
  scroll: false       // Don't scroll to top
});
```

## 📚 API Reference

### useInstantNavigation Hook

```typescript
const {
  navigateTo,        // Main navigation function
  prefetchPage,      // Prefetch specific page
  isNavigating,      // Loading state
  setIsNavigating    // Manual state control
} = useInstantNavigation();
```

### Navigation Options

```typescript
interface NavigationOptions {
  prefetch?: boolean;    // Enable prefetching (default: true)
  replace?: boolean;     // Use replace (default: false)
  scroll?: boolean;      // Scroll to top (default: true)
}
```

## 🎯 Common Patterns

### 1. Navigation with Loading State
```typescript
const { navigateTo, isNavigating } = useInstantNavigation();

return (
  <button 
    onClick={() => navigateTo('/dashboard')}
    disabled={isNavigating}
    className={`${isNavigating ? 'opacity-75 cursor-not-allowed' : ''}`}
  >
    {isNavigating ? 'Loading...' : 'Go to Dashboard'}
  </button>
);
```

### 2. Prefetch on Hover
```typescript
const { prefetchPage } = useInstantNavigation();

return (
  <button 
    onMouseEnter={() => prefetchPage('/profile')}
    onClick={() => navigateTo('/profile')}
  >
    Profile
  </button>
);
```

### 3. Batch Prefetching
```typescript
import { prefetchPages } from '@/lib/navigation';

useEffect(() => {
  prefetchPages(['/help', '/contact', '/about']);
}, []);
```

## 🔧 Configuration

### Critical Pages (Auto-prefetched)
```typescript
// src/lib/navigation.ts
const criticalPages = [
  '/listings',
  '/favorites', 
  '/owner-dashboard',
  '/settings'
];
```

### HTML Prefetching
```html
<!-- src/app/layout.tsx -->
<link rel="prefetch" href="/listings" />
<link rel="prefetch" href="/favorites" />
<link rel="prefetch" href="/owner-dashboard" />
<link rel="prefetch" href="/settings" />
```

## 🎨 CSS Classes

### Loading States
```css
/* Disabled state during navigation */
.opacity-75 { opacity: 0.75; }
.cursor-not-allowed { cursor: not-allowed; }

/* Loading indicators */
.loading-spinner { /* Your spinner styles */ }
```

### Transition Durations
```css
/* Fast transitions for instant feedback */
.transition-fast { transition-duration: 200ms; }
.transition-normal { transition-duration: 300ms; }

/* Avoid slow transitions */
.transition-slow { transition-duration: 500ms; } /* ❌ Don't use */
```

## 🚨 Error Handling

### Basic Error Handling
```typescript
const { navigateTo } = useInstantNavigation();

const handleNavigation = async (href: string) => {
  try {
    await navigateTo(href);
  } catch (error) {
    console.error('Navigation failed:', error);
    // Handle error (show toast, fallback, etc.)
  }
};
```

### Role-Based Access Control
```typescript
const handleNavigation = (href: string, requiresRole?: string) => {
  if (requiresRole && session?.user?.role !== requiresRole) {
    setShowRoleModal(true);
    return;
  }
  
  navigateTo(href);
};
```

## 📱 Mobile Considerations

### Touch Feedback
```typescript
// Add touch feedback for mobile
const [isPressed, setIsPressed] = useState(false);

return (
  <button
    onTouchStart={() => setIsPressed(true)}
    onTouchEnd={() => setIsPressed(false)}
    className={`${isPressed ? 'scale-95' : ''} transition-transform duration-100`}
  >
    Navigate
  </button>
);
```

### Prefetch on Mobile
```typescript
// Reduce prefetching on mobile for better performance
const isMobile = window.innerWidth < 768;

useEffect(() => {
  if (!isMobile) {
    prefetchPages(criticalPages);
  }
}, []);
```

## 🔍 Debugging

### Enable Debug Mode
```bash
# .env.local
NEXT_PUBLIC_DEBUG_NAVIGATION=true
```

### Performance Monitoring
```typescript
const { navigateTo } = useInstantNavigation();

const handleNavigation = async (href: string) => {
  const startTime = performance.now();
  
  try {
    await navigateTo(href);
    const duration = performance.now() - startTime;
    console.log(`Navigation took ${duration}ms`);
  } catch (error) {
    console.error('Navigation failed:', error);
  }
};
```

## 📊 Performance Metrics

### Target Metrics
- **Navigation Response**: < 100ms
- **Page Load**: < 2 seconds
- **Prefetch Success**: > 95%
- **TTI**: < 3.8 seconds

### Monitoring Tools
```typescript
// Web Vitals monitoring
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## 🚀 Best Practices

### ✅ Do
- Use `useInstantNavigation` for all navigation
- Implement loading states
- Prefetch critical pages
- Use fast transitions (200-300ms)
- Handle errors gracefully

### ❌ Don't
- Mix Link components with instant navigation
- Use slow transitions (>300ms)
- Block main thread with heavy prefetching
- Ignore loading states
- Forget error handling

## 🔗 Related Files

- **Main Hook**: `src/lib/navigation.ts`
- **Wrapper Component**: `src/components/ui/InstantNavigationWrapper.tsx`
- **Navbar**: `src/components/ui/Navbar.tsx`
- **Layout**: `src/app/layout.tsx`
- **Landing Page**: `src/app/page.tsx`

## 📞 Support

For issues or questions:
1. Check the troubleshooting section in main documentation
2. Review browser console for errors
3. Verify component imports and providers
4. Check network tab for prefetch requests

---

**Remember**: The goal is **instant feedback** and **fast navigation** while maintaining **beautiful UX**! 🎨✨
