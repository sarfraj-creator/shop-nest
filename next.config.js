/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fakestoreapi.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Ensure all server components use Node.js runtime (not edge)
  // Edge runtime has restrictions on fetch, timeouts, and external APIs
  experimental: {
    serverComponentsExternalPackages: [],
  },
};

module.exports = nextConfig;
