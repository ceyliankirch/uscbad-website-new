import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === "development", 
  workboxOptions: {
    disableDevLogs: true,
  },
});

/** @type {import('next').Config} */
const nextConfig = {
  // Cette ligne indique à Next.js qu'il peut utiliser Turbopack sans bloquer
  // à cause de la configuration Webpack du plugin PWA.
  turbopack: {},
};

export default withPWA(nextConfig);