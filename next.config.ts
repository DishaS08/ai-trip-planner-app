// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   images:{
//     domains:["places.googleapis.com"]
//   }
// };

// export default nextConfig;


module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com', // <--- add this!
        pathname: '/**',
      },
      // add any other domains you need
    ],
  },
};



