/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        os: false,
        path: false,
        crypto: false,
      };

      const webpack = require("webpack");
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
          process: "process/browser",
        })
      );
    }
    return config;
  },
  // Necessário para pacotes Solana que usam módulos Node no browser
  experimental: {
    serverComponentsExternalPackages: ["@coral-xyz/anchor", "@solana/web3.js"],
  },
};

module.exports = nextConfig;
