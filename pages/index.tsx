import API from '@/lib/api';
import {
  Box,
  Button,
  Center,
  Grid,
  GridItem,
  Heading,
  Text,
} from '@chakra-ui/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';
import Spotify from 'spotify-web-api-js';
import { useEffect, useState } from 'react';
import PlaylistTable from 'components/PlaylistTable';
import useSpotifyWebPlayback from 'hooks/useSpotifyWebPlayback';
import FilterCheckboxGroup from 'components/FilterCheckboxGroup';

const spotify = new Spotify();

export default function Home() {
  const router = useRouter();
  const ACCESS_TOKEN = router.query.access_token as string;

  const [topArtists, setTopArtists] = useState<
    SpotifyApi.UsersTopArtistsResponse['items']
  >([]);
  const [topTracks, setTopTracks] = useState<
    SpotifyApi.UsersTopTracksResponse['items']
  >([]);

  const [playlistTracks, setPlaylistTracks] = useState<
    SpotifyApi.TrackObjectFull[]
  >([]);

  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);

  useSpotifyWebPlayback();

  useEffect(() => {
    const getTopArtists = async () => {
      spotify.setAccessToken(ACCESS_TOKEN);
      const res = await spotify.getMyTopArtists();
      setTopArtists(res.items);
    };

    if (ACCESS_TOKEN) getTopArtists();
  }, [ACCESS_TOKEN]);

  useEffect(() => {
    const getTopTracks = async () => {
      spotify.setAccessToken(ACCESS_TOKEN);
      const res = await spotify.getMyTopTracks();
      setTopTracks(res.items);
    };

    if (ACCESS_TOKEN) getTopTracks();
  }, [ACCESS_TOKEN]);

  const handleCreatePlaylist = async () => {
    console.log(selectedArtists.slice(0, 5));

    spotify.setAccessToken(ACCESS_TOKEN);
    const recommendation_res = await spotify.getRecommendations({
      seed_artists: selectedArtists.slice(0, 5),
      seed_tracks: selectedTracks.slice(0, 5),
    });

    const tracks_res = await spotify.getTracks(
      recommendation_res.tracks.map((track) => track.id)
    );

    setPlaylistTracks(tracks_res.tracks);
  };

  const artistOptions = topArtists.map((artist) => ({
    value: artist.id,
    label: artist.name,
  }));

  const trackOptions = topTracks.map((track) => ({
    value: track.id,
    label: track.name,
  }));

  return (
    <div className={styles.container}>
      <Head>
        <title>Discover new artists</title>
        <meta
          name='description'
          content='Create a Spotify playlist with new music, inspired by what you already like.'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Box
        padding={[4, 4, 10, 12]}
        as='main'
        maxWidth='80rem'
        margin='0 auto'
        mt={[4, 4, 8, 16]}
      >
        <Box margin='0 auto' textAlign='center' mb={8}>
          <Heading size='lg'>Discover</Heading>
          <Text size='xl'>by Listen Together</Text>
        </Box>
        {ACCESS_TOKEN ? (
          <>
            <Heading size='md' mb={4} width='100%'>
              Top Artists
            </Heading>
            <FilterCheckboxGroup
              max={5}
              options={artistOptions}
              onUpdate={setSelectedArtists}
            />
            <Heading size='md' mb={4} width='100%'>
              Top Tracks
            </Heading>
            <FilterCheckboxGroup
              max={5}
              options={trackOptions}
              onUpdate={setSelectedTracks}
            />
            <PlaylistTable
              onCreatePlaylist={handleCreatePlaylist}
              tracks={playlistTracks}
              spotify={spotify}
            />
          </>
        ) : (
          <Center>
            <Link href={API.Routes.authLogin.get()}>
              <Button as='a' size='lg' cursor='pointer' colorScheme='green'>
                Login with Spotify
              </Button>
            </Link>
          </Center>
        )}
      </Box>
    </div>
  );
}
