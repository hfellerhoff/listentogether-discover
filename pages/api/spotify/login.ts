import { serialize } from 'cookie';
import API from '@/lib/api';
import generateRandomString from '../../../utils/api/generateRandomString';

const redirect_uri = API.Routes.authRedirect.get();

const scope =
  'user-library-modify user-library-read user-read-recently-played user-read-playback-position user-top-read playlist-read-collaborative playlist-modify-public playlist-read-private playlist-modify-private user-read-playback-state user-modify-playback-state streaming';

const client_id = API.Secrets.CLIENT_ID;

export default function handler(req, res) {
  const state = generateRandomString(16);
  res.setHeader(
    'Set-Cookie',
    serialize(API.Cookies.AUTH_STATE_KEY, state, { path: '/' })
  );

  res.redirect(
    API.Routes.authAuthorize.withParams({
      response_type: 'code',
      client_id,
      scope,
      redirect_uri,
      state,
    })
  );
}
