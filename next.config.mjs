import { withSentryConfig } from "@sentry/nextjs";

const nextConfig = {
  experimental: {
    serverActions: true
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "res.cloudinary.com" }
    ]
  },
  i18n: {
    locales: ["es-PE", "en"],
    defaultLocale: "es-PE"
  }
};

export default withSentryConfig(nextConfig, {
  silent: true
});
