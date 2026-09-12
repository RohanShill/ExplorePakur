import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale, Locale } from './config';

export default getRequestConfig(async ({ locale }) => {
  const currentLocale = locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;

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
