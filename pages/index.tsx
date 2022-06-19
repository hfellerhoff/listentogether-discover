import API from '@/lib/api';
import { Box, Button, Center, Heading, Text } from '@chakra-ui/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';
import Spotify from 'spotify-web-api-js';
import { useEffect, useState } from 'react';
import PlaylistTable from 'components/PlaylistTable';
import useSpotifyWebPlayback from 'hooks/useSpotifyWebPlayback';
import FilterCheckboxGroup from 'components/FilterCheckboxGroup';
import PlaylistMetadata from 'components/PlaylistMetadata';
import useSpotifyUser from 'hooks/useSpotifyUser';
import useStore from 'state/store';
import PlaylistCreateSuccessAlert from 'components/PlaylistCreateSuccessAlert';
import useSpotifySavedTracks from 'hooks/useSpotifySavedTracks';

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

  const { playlist, setPlaylist } = useStore((store) => ({
    playlist: store.playlist,
    setPlaylist: store.setPlaylist,
  }));

  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);

  const [isGeneratingPlaylist, setIsGeneratingPlaylist] = useState(false);
  const [isSavingPlaylist, setIsSavingPlaylist] = useState(false);

  useSpotifyWebPlayback();

  const { data: user } = useSpotifyUser(ACCESS_TOKEN);
  const savedTracks = useSpotifySavedTracks(ACCESS_TOKEN);

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

  const handleGeneratePlaylist = async () => {
    setIsGeneratingPlaylist(true);

    try {
      spotify.setAccessToken(ACCESS_TOKEN);
      const recommendation_res = await spotify.getRecommendations({
        seed_artists: selectedArtists.slice(0, 5),
        seed_tracks: selectedTracks.slice(0, 5),
      });

      const tracks_res = await spotify.getTracks(
        recommendation_res.tracks.map((track) => track.id)
      );

      setPlaylist({
        id: '',
        name: 'My New Playlist',
        tracks: tracks_res.tracks,
      });
      setIsGeneratingPlaylist(false);
    } catch {
      setIsGeneratingPlaylist(false);
    }
  };

  const handleSavePlaylist = async () => {
    if (!user) return;
    setIsSavingPlaylist(true);

    spotify.setAccessToken(ACCESS_TOKEN);

    const res = await spotify.createPlaylist(user.id, {
      name: playlist.name,
      description: 'Created with https://studio.listentogether.app',
      public: true,
    });

    await spotify.addTracksToPlaylist(
      res.id,
      playlist.tracks.map((track) => track.uri)
    );

    setPlaylist({
      ...playlist,
      id: res.id,
      name: res.name,
    });

    setIsSavingPlaylist(false);
  };

  const artistOptions = topArtists.map((artist) => ({
    value: artist.id,
    label: artist.name,
  }));

  const trackOptions = topTracks.map((track) => ({
    value: track.id,
    label: track.name,
  }));

  const isPlaylist = playlist.tracks.length > 0;
  const hasCreatedPlaylist = !!playlist.id;

  return (
    <div>
      <Head>
        <title>
          Playlist Studio - Discover new music and create perfect Spotify
          playlists
        </title>
        <meta
          name='description'
          content='Create a Spotify playlist with new music, inspired by what you already like.'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Box as='main' maxWidth='80rem' margin='0 auto' mt={[8, 8, 8, 16]}>
        <Box margin='0 auto' textAlign='center'>
          <Heading size='lg'>Playlist Studio</Heading>
          <Text size='xl'>Find new music and create the perfect playlist</Text>
        </Box>
        {ACCESS_TOKEN ? (
          <>
            <Box padding={[6, 8]}>
              <Heading size='md' mb={4} width='100%' mt={4}>
                Top Artists
              </Heading>
              <FilterCheckboxGroup
                max={5}
                options={artistOptions}
                onUpdate={setSelectedArtists}
              />
              <Heading size='md' mb={4} width='100%' mt={10}>
                Top Tracks
              </Heading>
              <FilterCheckboxGroup
                max={5}
                options={trackOptions}
                onUpdate={setSelectedTracks}
              />
            </Box>
            {hasCreatedPlaylist && <PlaylistCreateSuccessAlert />}
            {!hasCreatedPlaylist && (
              <Center
                px={[4, 4, 8]}
                pb={[4, 4, 8]}
                gap={4}
                flexDir={['column', 'row']}
                mb={4}
                my={4}
              >
                <Button
                  onClick={handleGeneratePlaylist}
                  size={'lg'}
                  isLoading={isGeneratingPlaylist}
                >
                  {isPlaylist ? 'Generate New Playlist' : 'Generate Playlist'}
                </Button>
                {isPlaylist && (
                  <Button
                    onClick={handleSavePlaylist}
                    size={'lg'}
                    colorScheme='green'
                    isLoading={isSavingPlaylist}
                  >
                    Save To Spotify
                  </Button>
                )}
              </Center>
            )}
            {isPlaylist && (
              <>
                <PlaylistMetadata editable={!hasCreatedPlaylist} />
                <PlaylistTable
                  tracks={playlist.tracks}
                  savedTracks={savedTracks}
                  spotify={spotify}
                />
              </>
            )}
          </>
        ) : (
          <Center mt={4}>
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
