/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.dummyjson.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "fakestoreapi.com",
        port: "",
        pathname: "/**",
      },
      {
        // BOB staging backend — event thumbnails are served from here.
        // Required for next/image to work; <img> tags work without it
        // but this future-proofs if you switch to next/image.
        protocol: "https",
        hostname: "staging-backend.thebobproject.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;