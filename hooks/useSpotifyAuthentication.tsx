import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

export enum SPOTIFY_COOKIES {
  ACCESS_TOKEN = 'spotify-access-token',
  REFRESH_TOKEN = 'spotify-refresh-token',
}

type Options = {
  shouldRedirect?: boolean;
};

const useSpotifyAuthentication = (
  options: Options = {
    shouldRedirect: false,
  }
) => {
  const { shouldRedirect = false } = options;

  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [cookies, setCookies] = useCookies([
    SPOTIFY_COOKIES.ACCESS_TOKEN,
    SPOTIFY_COOKIES.REFRESH_TOKEN,
  ]);

  useEffect(() => {
    if (router.query) {
      if (router.query.access_token) {
        const { access_token, refresh_token, expires_in } = router.query;
        setCookies(SPOTIFY_COOKIES.ACCESS_TOKEN, JSON.stringify(access_token), {
          path: '/',
          maxAge: parseInt(expires_in as string),
          sameSite: true,
        });
        setCookies(
          SPOTIFY_COOKIES.REFRESH_TOKEN,
          JSON.stringify(refresh_token),
          {
            path: '/',
            maxAge: 3600 * 24,
            sameSite: true,
          }
        );
      } else {
        if (
          shouldRedirect &&
          router.pathname !== '/' &&
          !isLoading &&
          (!cookies[SPOTIFY_COOKIES.ACCESS_TOKEN] ||
            !cookies[SPOTIFY_COOKIES.REFRESH_TOKEN])
        ) {
          router.replace('/');
        }
      }
      if (isLoading) setIsLoading(false);
    }
  }, [router.query, cookies]);

  return {
    isLoading,
    ACCESS_TOKEN: cookies[SPOTIFY_COOKIES.ACCESS_TOKEN] as string,
    REFRESH_TOKEN: cookies[SPOTIFY_COOKIES.REFRESH_TOKEN] as string,
  };
};

export default useSpotifyAuthentication;
