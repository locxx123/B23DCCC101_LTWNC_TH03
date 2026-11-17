import type { MetadataRoute } from 'next';

const BASE = 'http://localhost:3000';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    BASE,
    `${BASE}/books`,
    ...Array.from({ length: 24 }, (_, i) => `${BASE}/books/${i + 1}`),
  ].map((url) => ({ url }));
}
