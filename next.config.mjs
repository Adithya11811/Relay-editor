
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['utfs.io', 'res.cloudinary.com'],
  },
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**',
    },
  ],
}

export default nextConfig
