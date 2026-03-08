import type { NextConfig } from 'next';
import path from 'path';
import { config } from 'dotenv';

config({ path: path.join(process.cwd(), 'app', '.env'), quiet: true });

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'galaxypfp.com'
      }
    ]
  }
};

export default nextConfig;
