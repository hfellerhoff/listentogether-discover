import { Tr, Td, Box, Heading, Text, Grid } from '@chakra-ui/react';
import useSpotifyAuthentication from 'hooks/useSpotifyAuthentication';
import Spotify from 'spotify-web-api-js';
import { PlayIcon, PauseIcon } from '@radix-ui/react-icons';

import Image from 'next/image';
import { useState } from 'react';

type Props = {
  number: number;
  track: SpotifyApi.TrackObjectFull;
  spotify: Spotify.SpotifyWebApiJs;
};

export function PlaylistTableRow({ number, track, spotify }: Props) {
  const { ACCESS_TOKEN } = useSpotifyAuthentication();
  const [isPlaying, setIsPlaying] = useState(false);

  const playSong = async (uri: string) => {
    spotify.setAccessToken(ACCESS_TOKEN);

    const devices = await spotify.getMyDevices();

    let device_id;
    const activeDevices = devices.devices.filter((d) => d.is_active);
    if (devices.devices.length > 0) {
      if (activeDevices.length === 0) {
        device_id = devices.devices[0].id;
      } else {
        device_id = activeDevices[0].id;
      }
    }

    await spotify.play({
      uris: [uri],
      device_id,
    });

    setIsPlaying(true);
  };

  const pauseSong = async () => {
    spotify.setAccessToken(ACCESS_TOKEN);

    await spotify.pause();

    setIsPlaying(false);
  };

  const togglePlayback = (uri: string) => async () => {
    if (isPlaying) await pauseSong();
    else await playSong(uri);
  };

  return (
    <Tr key={track.id}>
      <Td>{number}</Td>
      <Td p={0}>
        <Box pos='relative'>
          <Image
            width={64}
            height={64}
            layout='fixed'
            src={track.album.images[0].url}
          ></Image>
          <Grid
            as='button'
            pos='absolute'
            inset={0}
            opacity={0}
            width={16}
            height={16}
            placeItems='center'
            background={'rgba(0, 0, 0, 0.5)'}
            _hover={{
              opacity: 1,
            }}
            onClick={togglePlayback(track.uri)}
          >
            {isPlaying ? (
              <PauseIcon color='white' width={20} height={20} />
            ) : (
              <PlayIcon color='white' width={20} height={20} />
            )}
          </Grid>
        </Box>
      </Td>
      <Td>
        <Box>
          <Heading size='sm' noOfLines={1} fontFamily='body'>
            {track.name}
          </Heading>
          <Text>{track.artists[0].name}</Text>
        </Box>
      </Td>
      <Td>
        <Text noOfLines={1}>{track.album.name}</Text>
      </Td>
    </Tr>
  );
}
