import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import useStore, { SpotifyAPI } from 'state/store';

const getSpotifySavedTracks = async (
  spotify: SpotifyAPI,
  ACCESS_TOKEN: string,
  tracks: SpotifyApi.TrackObjectFull[]
) => {
  spotify.setAccessToken(ACCESS_TOKEN);

  const trackIDs = tracks.map((track) => track.id);
  const favoritedTrackBooleanList = await spotify.containsMySavedTracks(
    trackIDs
  );

  return trackIDs.filter((id, i) => favoritedTrackBooleanList[i]);
};

const useSpotifySavedTracks = (ACCESS_TOKEN: string) => {
  const { spotify, tracks } = useStore((store) => ({
    spotify: store.spotify,
    tracks: store.playlist.tracks,
  }));
  const query = useQuery(
    ['spotify-saved-tracks', spotify, ACCESS_TOKEN, tracks],
    () => getSpotifySavedTracks(spotify, ACCESS_TOKEN, tracks),
    {
      enabled: !!ACCESS_TOKEN && tracks.length > 0,
    }
  );

  return query.data || [];
};

export default useSpotifySavedTracks;
