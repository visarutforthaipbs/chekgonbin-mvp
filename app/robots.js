export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin"],
    },
    host: "https://checkgonbin.in.th",
    sitemap: "https://checkgonbin.in.th/sitemap.xml",
  };
}
