/** @type {import('next').NextConfig} */
const nextConfig = {
  // webpack: (config) => {
  //   config.cache = false;
  //   return config;
  // },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["res.cloudinary.com"],
    domains: ["images.unsplash.com"],
  },
};

module.exports = nextConfig;
