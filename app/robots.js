export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin"],
    },
    host: "https://thaimigrantwatch.org",
    sitemap: "https://thaimigrantwatch.org/sitemap.xml",
  };
}
