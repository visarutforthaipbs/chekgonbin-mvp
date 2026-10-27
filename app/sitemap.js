import { ROUNDS } from "@/data/rounds";
import { COUNTRIES } from "@/data/countries";

export default function sitemap() {
  const baseUrl = "https://thaimigrantwatch.org";
  const lastModified = new Date();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/rounds`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...COUNTRIES.map((c) => ({
      url: `${baseUrl}/countries/${c.slug}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    })),
    { url: `${baseUrl}/emergency`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/women`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    ...ROUNDS.map((r) => ({
      url: `${baseUrl}/rounds/${r.slug}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    })),
    {
      url: `${baseUrl}/agencies`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/media-hub`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/report-scam`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
