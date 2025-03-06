/** @type {import('next').NextConfig} */
const nextConfig = {
    assetPrefix: '/chatbot-static',
    // reactStrictMode: true,
    // basePath: '/chatbot',
    async rewrites() {
        return {
          beforeFiles: [
            {
              source: '/chatbot-static/_next/:path*',
              destination: '/_next/:path*',
            },
          ],
        };
      }
      
};

export default nextConfig;
