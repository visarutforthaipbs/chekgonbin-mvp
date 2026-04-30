export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin"],
    },
    sitemap: "https://checkgonbin.in.th/sitemap.xml",
  };
}
