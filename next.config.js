/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/dashboard",
        destination: "/",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qhgpubnqzskccobolzai.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
    // domains: ["qhgpubnqzskccobolzai.supabase.co", "cloud.appwrite.io"],
  },
};

module.exports = nextConfig;
