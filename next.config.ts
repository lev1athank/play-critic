import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        domains: ['steamcdn-a.akamaihd.net', 'localhost'],
      },
    
};

export default nextConfig;


// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })

// module.exports = withBundleAnalyzer({
//   reactStrictMode: true,
// })