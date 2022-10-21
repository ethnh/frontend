/* eslint-disable no-restricted-properties */
const env = process.env.VERCEL_ENV || process.env.NODE_ENV;
const isDev = env === 'development';
const baseUrl = [
  process.env.NEXT_PUBLIC_APP_PROTOCOL || 'https',
  '://',
  process.env.NEXT_PUBLIC_VERCEL_URL || process.env.NEXT_PUBLIC_APP_HOST,
  process.env.NEXT_PUBLIC_APP_PORT ? ':' + process.env.NEXT_PUBLIC_APP_PORT : '',
].join('');

const DEFAULT_CURRENCY_DECIMALS = 18;

const config = Object.freeze({
  env,
  isDev,
  network: {
    type: process.env.NEXT_PUBLIC_NETWORK_TYPE,
    subtype: process.env.NEXT_PUBLIC_NETWORK_SUBTYPE,
    logo: process.env.NEXT_PUBLIC_NETWORK_LOGO,
    name: process.env.NEXT_PUBLIC_NETWORK_NAME,
    id: process.env.NEXT_PUBLIC_NETWORK_ID,
    shortName: process.env.NEXT_PUBLIC_NETWORK_SHORT_NAME,
    currency: {
      name: process.env.NEXT_PUBLIC_NETWORK_CURRENCY_NAME,
      symbol: process.env.NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL,
      decimals: Number(process.env.NEXT_PUBLIC_NETWORK_CURRENCY_DECIMALS) || DEFAULT_CURRENCY_DECIMALS,
    },
    assetsPathname: process.env.NEXT_PUBLIC_NETWORK_ASSETS_PATHNAME,
    nativeTokenAddress: process.env.NEXT_PUBLIC_NETWORK_TOKEN_ADDRESS,
    basePath: '/' + [ process.env.NEXT_PUBLIC_NETWORK_TYPE, process.env.NEXT_PUBLIC_NETWORK_SUBTYPE ].filter(Boolean).join('/'),
    explorers: process.env.NEXT_PUBLIC_NETWORK_EXPLORERS?.replaceAll('\'', '"'),
    verificationType: process.env.NEXT_PUBLIC_NETWORK_VERIFICATION_TYPE || 'mining',
  },
  footerLinks: {
    github: process.env.NEXT_PUBLIC_FOOTER_GITHUB_LINK,
    twitter: process.env.NEXT_PUBLIC_FOOTER_TWITTER_LINK,
    telegram: process.env.NEXT_PUBLIC_FOOTER_TELEGRAM_LINK,
    staking: process.env.NEXT_PUBLIC_FOOTER_STAKING_LINK,
  },
  featuredNetworks: process.env.NEXT_PUBLIC_FEATURED_NETWORKS?.replaceAll('\'', '"'),
  blockScoutVersion: process.env.NEXT_PUBLIC_BLOCKSCOUT_VERSION,
  isAccountSupported: process.env.NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED?.replaceAll('\'', '"') === 'true',
  marketplaceSubmitForm: process.env.NEXT_PUBLIC_MARKETPLACE_SUBMIT_FORM,
  protocol: process.env.NEXT_PUBLIC_APP_PROTOCOL,
  host: process.env.NEXT_PUBLIC_APP_HOST,
  port: process.env.NEXT_PUBLIC_APP_PORT,
  baseUrl,
  api: {
    endpoint: process.env.NEXT_PUBLIC_API_ENDPOINT || 'https://blockscout.com',
    basePath: process.env.NEXT_PUBLIC_API_BASE_PATH || '',
  },
});

export default config;
