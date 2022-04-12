const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    serverRuntimeConfig: {
        db: {
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            cluster: process.env.DB_CLUSTER
        },
    },
    publicRuntimeConfig: {
        apiURL: process.env.API_URL,
        mqttURL: process.env.MQTT_URL
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
