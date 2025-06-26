/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'big-boy-food-server.onrender.com',
        pathname: '/static/**',
      },
      // Nếu vẫn muốn dùng localhost khi dev:
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/static/**',
      },
    ],
  },
};

export default nextConfig;
