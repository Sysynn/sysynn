import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Vercel 최적화 설정
}

export default nextConfig
