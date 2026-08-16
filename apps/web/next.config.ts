import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@dokumenty-id/shared'],
  async rewrites() {
    const internalApiBase = process.env.INTERNAL_API_BASE_URL ?? 'http://127.0.0.1:4001/api/v1';
    return [
      {
        source: '/api/v1/:path*',
        destination: `${internalApiBase}/:path*`,
      },
    ];
  },
};

export default nextConfig;
