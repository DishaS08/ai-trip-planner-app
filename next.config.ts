// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   images:{
//     domains:["places.googleapis.com"]
//   }
// };

// export default nextConfig;


// module.exports = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'images.unsplash.com',
//         pathname: '/**',
//       },
//       {
//         protocol: 'https',
//         hostname: 'example.com', // <--- add this!
//         pathname: '/**',
//       },
//       // add any other domains you need
//     ],
//   },
// };

/** @type {import('next').NextConfig} */
const nextConfig = {
  metadataBase: new URL('https://ai-trip-planner-app-git-main-disha-suryawanshis-projects.vercel.app'),

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com', // add more domains if needed
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;



