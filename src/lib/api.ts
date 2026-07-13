export const API_URL = process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'development'
    ? 'https://mobile-ui-backnend.vercel.app'
    : 'https://mobile-ui-backnend.vercel.app');
