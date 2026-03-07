import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**'
      }
    ]
  }
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'galaxypfp.com'
      }
    ]
  }
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**'
      }
    ]
  }
};

export default nextConfig;
