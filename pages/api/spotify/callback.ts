import { serialize } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import * as request from 'request';

import Spotify from 'spotify-web-api-node';
import API from '@/lib/api';

const callbackURI = API.Routes.authCallback;

const client_id = API.Secrets.CLIENT_ID;
const client_secret = API.Secrets.CLIENT_SECRET;

const callback = (req: NextApiRequest, res: NextApiResponse) =>
  new Promise((resolve) => {
    // your application requests refresh and access tokens
    // after checking the state parameter

    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies
      ? req.cookies[API.Cookies.AUTH_STATE_KEY]
      : null;

    if (state === null || state !== storedState) {
      res.redirect(
        callbackURI.withParams({
          error: 'state_mismatch',
        })
      );
      return resolve('');
    }

    res.setHeader(
      'Set-Cookie',
      serialize(API.Cookies.AUTH_STATE_KEY, '', {
        maxAge: -1,
        path: '/',
      })
    );

    const authOptions = {
      url: API.Routes.authToken.get(),
      form: {
        code,
        redirect_uri: API.Routes.authRedirect.get(),
        grant_type: 'authorization_code',
      },
      headers: {
        Authorization:
          'Basic ' +
          new Buffer(client_id + ':' + client_secret).toString('base64'),
      },
      json: true,
    };

    request.post(authOptions, async function (error, response, body) {
      // On successful login
      if (!error && response.statusCode === 200) {
        const { access_token, refresh_token, expires_in } = body;

        // Get user's data from Spotify
        const spotifyAPI = new Spotify();
        spotifyAPI.setAccessToken(access_token);

        // Pass the access token back to the Listen Together client
        // to be able to make client-side API requests
        res.redirect(
          callbackURI.withParams({
            access_token,
            refresh_token,
            expires_in,
          })
        );
        return resolve('');
      } else {
        // On invalid token,
        res.redirect(
          callbackURI.withParams({
            error: 'invalid_token',
          })
        );
        return resolve('');
      }
    });
  });

export default callback;
