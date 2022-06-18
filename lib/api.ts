import { createAPIRoute } from '@/utils/api/createAPIRoute';

export const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : process.env.VERCEL_ENV === 'preview'
    ? process.env.VERCEL_URL
    : 'https://www.listentogether.app';

export const buildListenTogetherAPIUrl = (url: string) => `${BASE_URL}${url}`;

const API = {
  Routes: {
    authToken: createAPIRoute('https://accounts.spotify.com/api/token'),
    authAuthorize: createAPIRoute('https://accounts.spotify.com/authorize'),
    authLogin: createAPIRoute(buildListenTogetherAPIUrl('/api/spotify/login')),
    authRedirect: createAPIRoute(
      buildListenTogetherAPIUrl('/api/spotify/callback')
    ),
    authCallback: createAPIRoute(buildListenTogetherAPIUrl('/')),
  },
  Cookies: {
    AUTH_STATE_KEY: 'spotify_auth_state',
  },
  Secrets: {
    CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  },
};

export default API;
