export default function sitemap() {
  const baseUrl = "https://checkgonbin.in.th";

  return [
    {
      url: baseUrl,
      lastModified: "2026-04-30",
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/agencies`,
      lastModified: "2026-04-30",
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/media-hub`,
      lastModified: "2026-04-30",
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/report-scam`,
      lastModified: "2026-04-30",
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: "2026-04-30",
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: "2026-04-30",
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
