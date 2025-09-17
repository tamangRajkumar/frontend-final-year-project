/** @type {import('next').NextConfig} */
const nextConfig = {
  // webpack: (config) => {
  //   config.cache = false;
  //   return config;
  // },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["res.cloudinary.com", "images.unsplash.com"],
  },
   eslint: {
    // ignore ESLint errors during build
    ignoreDuringBuilds: true,
  },
    typescript: {
    // ignore type errors during build.
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
