module.exports = {
    productionBrowserSourceMaps: true,
    reactStrictMode: true,
    images: {
        domains: ['minio', 'openstead.app'],
    },
    rewrites: async () => {
        return [
            {
                source: '/api/:path*',
                destination:
                    process.env.NODE_ENV === 'development'
                        ? 'http://127.0.0.1:8000/api/:path*'
                        : '/api/',
            },
        ]
    },
}
