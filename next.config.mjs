/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  distDir: process.env.NODE_ENV === 'development' ? '.next' : 'out',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
