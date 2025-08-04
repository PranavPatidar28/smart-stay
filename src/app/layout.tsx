import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import ToastProvider from "@/components/providers/ToastProvider";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'SmartStay - Find Your Perfect Student Accommodation',
    template: '%s | SmartStay'
  },
  description: 'Discover verified hostels, PGs, and flats near your campus. SmartStay connects students with trusted accommodation options across India. Find your perfect student home today!',
  keywords: [
    'student accommodation',
    'hostel booking',
    'PG accommodation',
    'student housing',
    'university accommodation',
    'student flats',
    'campus housing',
    'student rental',
    'verified accommodation',
    'student living',
    'college housing',
    'student apartments',
    'academic housing',
    'student residence',
    'campus living'
  ],
  authors: [{ name: 'Pranav Patidar' }],
  creator: 'Pranav Patidar',
  publisher: 'Pranav Patidar',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://smartstay.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://smartstay.com',
    siteName: 'SmartStay',
    title: 'SmartStay - Find Your Perfect Student Accommodation',
    description: 'Discover verified hostels, PGs, and flats near your campus. SmartStay connects students with trusted accommodation options across India.',
    images: [
      {
        url: '/images/Gemini_Generated_Image_LandingPage.png',
        width: 1200,
        height: 630,
        alt: 'SmartStay - Student Accommodation Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SmartStay - Find Your Perfect Student Accommodation',
    description: 'Discover verified hostels, PGs, and flats near your campus. SmartStay connects students with trusted accommodation options across India.',
    images: ['/images/Gemini_Generated_Image_LandingPage.png'],
    creator: '@smartstay',
    site: '@smartstay',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your actual verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
  category: 'education',
  classification: 'Student Accommodation Platform',
  other: {
    'application-name': 'SmartStay',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'SmartStay',
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
    'msapplication-config': '/browserconfig.xml',
    'msapplication-TileColor': '#8B5CF6',
    'msapplication-tap-highlight': 'no',
    'theme-color': '#8B5CF6',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#8B5CF6" />
        <meta name="msapplication-TileColor" content="#8B5CF6" />
        <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
        
        {/* Structured Data for Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "SmartStay",
              "url": "https://smartstay.com",
              "description": "Find your perfect student accommodation near campus",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://smartstay.com/listings?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
                             "@type": "Organization",
               "name": "SmartStay",
               "url": "https://smart-stay-navy.vercel.app",
               "logo": "https://smart-stay-navy.vercel.app/images/logo.png",
               "description": "Student accommodation platform connecting students with verified properties",
               "founder": {
                 "@type": "Person",
                 "name": "Pranav Patidar"
               },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": "English"
              },
              "sameAs": [
                /* "https://facebook.com/smartstay",
                "https://twitter.com/smartstay",
                "https://instagram.com/smartstay",
                "https://linkedin.com/company/smartstay" */
              ]
            })
          }}
        />
      </head>
      <body className={``}>
        <AuthProvider>
          {children}
          <ToastProvider />
        </AuthProvider>
        <Analytics/>
        <SpeedInsights/>
      </body>
    </html>
  );
}
