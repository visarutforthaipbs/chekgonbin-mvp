/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  // Old domain -> new brand domain (permanent), keeps path + query.
  async redirects() {
    return ["checkgonbin.in.th", "www.checkgonbin.in.th"].map((host) => ({
      source: "/:path*",
      has: [{ type: "host", value: host }],
      destination: "https://thaimigrantwatch.org/:path*",
      permanent: true,
    }));
  },
};

export default nextConfig;
