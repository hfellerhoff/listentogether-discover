import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import useStore, { SpotifyAPI } from 'state/store';

const getSpotifyUser = async (spotify: SpotifyAPI, ACCESS_TOKEN: string) => {
  spotify.setAccessToken(ACCESS_TOKEN);
  const res = await spotify.getMe();

  return res;
};

const useSpotifyUser = (ACCESS_TOKEN: string) => {
  const spotify = useStore((store) => store.spotify);
  const query = useQuery(
    ['spotify-user', spotify, ACCESS_TOKEN],
    () => getSpotifyUser(spotify, ACCESS_TOKEN),
    {
      enabled: !!ACCESS_TOKEN,
    }
  );

  return query;
};

export default useSpotifyUser;
