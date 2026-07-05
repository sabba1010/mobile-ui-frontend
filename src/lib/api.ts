export const API_URL = process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'development'
    ? 'https://client17backend-pkr5.vercel.app'
    : 'https://client17backend-pkr5.vercel.app');
