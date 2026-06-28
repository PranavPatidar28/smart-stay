# SmartStay Metadata Setup

This document outlines the comprehensive metadata configuration for the SmartStay website.

## What's Included

### 1. Global Metadata (layout.tsx)
- **Title**: Dynamic title with template support
- **Description**: SEO-optimized description for student accommodation
- **Keywords**: Comprehensive list of relevant keywords
- **Open Graph**: Social media sharing optimization
- **Twitter Cards**: Twitter-specific metadata
- **Robots**: Search engine crawling instructions
- **Structured Data**: JSON-LD for rich snippets

### 2. Web App Manifest (manifest.json)
- App name and description
- Theme colors matching brand
- Icon configurations
- Display settings for PWA

### 3. Search Engine Files
- **robots.txt**: Crawler instructions
- **sitemap.xml**: Page discovery for search engines
- **browserconfig.xml**: Windows tile configuration

## Production Checklist

### Required Actions:
1. **Replace placeholder URLs**: the code currently uses two different domains that must both be unified to your production domain — `https://smartstay.com` (in `metadataBase`, Open Graph, and the WebSite JSON-LD) and `https://smart-stay-navy.vercel.app` (in the Organization JSON-LD `url`/`logo`), all in `layout.tsx`.
2. **Add verification codes**: Uncomment and add actual verification codes in layout.tsx
3. **Create favicon files**: Generate proper favicon.ico and icon files
4. **Update contact info**: Add actual phone numbers and social media links
5. **Add logo**: Create and reference actual logo files

### Creator Information:
- **Developer**: Pranav Patidar
- **Organization**: SmartStay
- **Platform**: Student Accommodation Platform

### Icon Files Needed:
- `/favicon.ico` (16x16, 32x32)
- `/apple-touch-icon.png` (180x180)
- `/android-chrome-192x192.png`
- `/android-chrome-512x512.png`
- `/mstile-150x150.png`

### Social Media Accounts:
- Facebook: `https://facebook.com/smartstay`
- Twitter: `@smartstay`
- Instagram: `https://instagram.com/smartstay`
- LinkedIn: `https://linkedin.com/company/smartstay`

## SEO Benefits

1. **Search Engine Optimization**: Comprehensive meta tags for better ranking
2. **Social Media Sharing**: Rich previews when shared on social platforms
3. **Mobile Optimization**: Proper mobile app-like experience
4. **Rich Snippets**: Structured data for enhanced search results
5. **Crawler Guidance**: Clear instructions for search engine bots

## Testing

Use these tools to verify your metadata:
- Google Rich Results Test
- Facebook Sharing Debugger
- Twitter Card Validator
- Google Search Console
- Lighthouse SEO Audit

## Notes

- All metadata is configured for a student accommodation platform
- Colors match the existing brand (#8B5CF6 purple theme)
- Mobile-first approach with responsive design considerations
- Structured data includes both WebSite and Organization schemas 