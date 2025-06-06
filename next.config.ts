/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add this eslint block
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.isacoil.org",
      },
      {
        protocol: "https",
        hostname: "content.govdelivery.com",
      },
      {
        protocol: "https",
        hostname: "www.fpua.com",
      },
      {
        protocol: "https",
        hostname: "www.fpl.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "sinpin.com",
      },
      {
        protocol: "https",
        hostname: "lasultanaautobuses.com",
      },
      {
        protocol: "https",
        hostname: "tornadobus.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
    ],
  },
};

module.exports = nextConfig;
