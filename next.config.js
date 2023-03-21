/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  optimizeFonts: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    minimumCacheTTL: 1500000,
  },
};

module.exports = nextConfig;

// https://res.cloudinary.com/darbhuqcm/image/upload/v1679418921/jkuokbrahvggv1kpr1vb.jpg
