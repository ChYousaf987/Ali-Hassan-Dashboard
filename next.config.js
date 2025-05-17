/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        domains: ['http://localhost', 'https://localhost', 'localhost'],
    },
};

module.exports = nextConfig;
