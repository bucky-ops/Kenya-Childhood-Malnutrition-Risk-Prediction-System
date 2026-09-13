import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import NavBar from '@/components/NavBar';
import './globals.css';

const siteUrl = 'https://web-amber-xi-94.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Kenya Childhood Malnutrition Risk Prediction System',
    template: '%s · Kenya Malnutrition',
  },
  description:
    'An open-source Digital Public Good for predicting acute childhood malnutrition risk in Kenya using machine learning and WHO Data Quality Review standards.',
  keywords: [
    'Kenya', 'malnutrition', 'childhood', 'machine learning',
    'WHO', 'UNICEF', 'risk prediction', 'public health', 'Digital Public Good',
  ],
  authors: [{ name: 'Bucky Ops' }],
  creator: 'Bucky Ops',
  openGraph: {
    title: 'Kenya Childhood Malnutrition Risk Prediction System',
    description: 'County-level malnutrition case predictions using Random Forest ML.',
    type: 'website',
    url: siteUrl,
    siteName: 'Kenya Malnutrition Risk Prediction',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kenya Childhood Malnutrition Risk Prediction',
    description: 'County-level malnutrition case predictions using Random Forest ML.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#10b981' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Skip link for keyboard + screen-reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-emerald-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg"
        >
          Skip to main content
        </a>
        <NavBar />
        {children}
        {/* Vercel Analytics — privacy-friendly real-user monitoring */}
        <Analytics />
        {/* Vercel Speed Insights — Core Web Vitals (LCP, FID, CLS) tracking */}
        <SpeedInsights />
      </body>
    </html>
  );
}
