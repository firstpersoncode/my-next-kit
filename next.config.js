/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  i18n: {
    locales: ["default", "en", "id", "fr"],
    defaultLocale: "default",
    localeDetection: false
  },
  experimental: {
    outputStandalone: true
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"]
    });
    return config;
  },
  env: {
    NEXTJS_SECRET_KEY: process.env.NEXTJS_SECRET_KEY,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    CMS_ENDPOINT: process.env.CMS_ENDPOINT,
    HCAPTCHA_SECRET_KEY: process.env.HCAPTCHA_SECRET_KEY,
    HCAPTCHA_SITE_KEY: process.env.HCAPTCHA_SITE_KEY
  }
};
