module.exports = {
    output: 'standalone',

    productionBrowserSourceMaps: false,
    reactStrictMode: true,
    images: {
        domains: [
            'minio',
            'openstead.app',
            's3.openstead.app',
            'assets.openstead.app',
            'cdn.openstead.app',
        ],
    },
}
