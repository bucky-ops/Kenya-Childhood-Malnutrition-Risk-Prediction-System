import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://kmal.vercel.app';
  const lastModified = new Date();

  return [
    { url: baseUrl, lastModified, changeFrequency: 'monthly', priority: 1 },
    { url: `${baseUrl}/map`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/assess`, lastModified, changeFrequency: 'yearly', priority: 0.9 },
    { url: `${baseUrl}/alerts`, lastModified, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${baseUrl}/qa`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/stories`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
  ];
}
