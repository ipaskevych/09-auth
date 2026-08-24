/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '://cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'sc.goit.global',
      },
    ],
  },
};

module.exports = nextConfig;