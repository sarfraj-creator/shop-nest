/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // remotePatterns is the correct way in Next.js 13+ (domains is deprecated)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fakestoreapi.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Vercel handles this automatically but being explicit is cleaner
  // No env variables needed — this app uses only public free APIs
};

module.exports = nextConfig;
