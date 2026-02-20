import { withContentlayer } from "next-contentlayer2";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  webpack: (config) => {
    config.optimization = {
      ...config.optimization,
      minimize: false,
    };

    return config;
  },
};

export default withContentlayer(nextConfig);
