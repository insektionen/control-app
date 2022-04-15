const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    async headers() {
        return [{
            source: '/',
            headers: [{
                key: 'Access-Control-Allow-Origin',
                value: '*'
            }]
        }]
    }
});
