import { withContentlayer } from "next-contentlayer2";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  swcMinify: true,

  webpack: (config) => {
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

  turbopack: {},
};

export default withContentlayer(nextConfig);
