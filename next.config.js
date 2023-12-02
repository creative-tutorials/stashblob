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
      {
        source: "/status",
        destination: "https://stashblob.instatus.com/",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/dashboard",
        destination: "/",
      },
      {
        source: "/docs",
        destination: "https://stashblob.gitbook.io/docs/",
      },
      {
        source: "/docs/getting-started/appdir",
        destination: "https://stashblob.gitbook.io/docs/getting-started/appdir",
      },
      {
        source: "/docs/getting-started/pagedir",
        destination:
          "https://stashblob.gitbook.io/docs/getting-started/pagedir",
      },
      {
        source: "/docs/backend-adapters/express",
        destination:
          "https://stashblob.gitbook.io/docs/backend-adapters/express",
      },
      {
        source: "/docs/backend-adapters/curl",
        destination: "https://stashblob.gitbook.io/docs/backend-adapters/curl",
      },
      {
        source: "/docs/errors",
        destination: "https://stashblob.gitbook.io/docs/errors",
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
  },
};

module.exports = nextConfig;
