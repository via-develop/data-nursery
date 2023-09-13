/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    // CSS 모듈을 사용하기 위한 로더 설정
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  images: {
    domains: ["192.168.2.102", "192.168.2.103", "b.datanursery.kr", "192.168.1.69", "192.168.2.100"],
  },
};

module.exports = nextConfig;
