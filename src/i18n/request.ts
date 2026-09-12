import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale, Locale } from './config';

export default getRequestConfig(async (params: any) => {
  // Support both next-intl requestLocale (v3.24+) and legacy locale param
  let rawLocale = params?.requestLocale;
  if (rawLocale && typeof rawLocale.then === 'function') {
    rawLocale = await rawLocale;
  }
  if (!rawLocale) {
    rawLocale = params?.locale;
  }

  const currentLocale: Locale = (rawLocale && locales.includes(rawLocale as Locale))
    ? (rawLocale as Locale)
    : defaultLocale;

  return {
    locale: currentLocale,
    messages: {
      common: (await import(`@/locales/${currentLocale}/common.json`)).default,
      navigation: (await import(`@/locales/${currentLocale}/navigation.json`)).default,
      home: (await import(`@/locales/${currentLocale}/home.json`)).default,
      spots: (await import(`@/locales/${currentLocale}/spots.json`)).default,
      about: (await import(`@/locales/${currentLocale}/about.json`)).default,
      contact: (await import(`@/locales/${currentLocale}/contact.json`)).default,
      admin: (await import(`@/locales/${currentLocale}/admin.json`)).default,
      auth: (await import(`@/locales/${currentLocale}/auth.json`)).default,
    },
  };
});
