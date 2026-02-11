import { withContentlayer } from "next-contentlayer2";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  swcMinify: true,
  
  // Webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add GLSL loader for shaders
    config.module.rules.push({
      test: /\.glsl$/,
      exclude: /node_modules/,
      use: ["raw-loader", "glslify-loader"],
    });

    config.optimization = {
      ...config.optimization,
      minimize: false,
    };

    return config;
  },

  // You can add other experimental flags here if needed, but leave turbo off for now
  experimental: {
    // turbo: removed, because Turbopack breaks GLSL loaders
  },
};

export default withContentlayer(nextConfig);
