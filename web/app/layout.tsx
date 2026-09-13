import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kenya Childhood Malnutrition Risk Prediction System',
  description:
    'An open-source Digital Public Good for predicting acute childhood malnutrition risk in Kenya using machine learning and WHO Data Quality Review standards.',
  keywords: [
    'Kenya', 'malnutrition', 'childhood', 'machine learning',
    'WHO', 'UNICEF', 'risk prediction', 'public health', 'Digital Public Good',
  ],
  authors: [{ name: 'Bucky Ops' }],
  openGraph: {
    title: 'Kenya Childhood Malnutrition Risk Prediction System',
    description: 'County-level malnutrition case predictions using Random Forest ML.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
