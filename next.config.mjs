/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Don't bundle ffmpeg-static on the server
      config.externals.push("ffmpeg-static");
    }
    return config;
  },
};

export default nextConfig;
