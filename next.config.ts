import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tunedessays.com",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/static/**",
      },
      {
        protocol: "https",
        hostname: "tunedessays.com",
        pathname: "/static/**",
      },
    ],
  },

  typedRoutes: true,

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_API_URL|| 'http://localhost:5000'}/api/:path*`, 
      },
    ];
  },
};

export default nextConfig;
