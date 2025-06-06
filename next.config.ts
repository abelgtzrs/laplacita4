/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.isacoil.org",
      },
      {
        protocol: "https",
        hostname: "content.govdelivery.com", // From your error message
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
