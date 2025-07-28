import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'robohash.org',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Prevent MIME sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Control referrer information
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          // Prevent XSS and control resource loading
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.com https://*.clerk.accounts.dev https://challenges.cloudflare.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: https://img.clerk.com",
              "connect-src 'self' https://clerk.com https://*.clerk.accounts.dev https://clerk-telemetry.com https://*.convex.cloud wss://*.convex.cloud",
              "frame-src 'self' https://clerk.com https://*.clerk.accounts.dev https://challenges.cloudflare.com",
              "worker-src 'self' blob:",
              "form-action 'self'",
            ].join('; '),
          },
          // Prevent browsers from caching sensitive pages
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
