import {
  Alert,
  AlertIcon,
  Button,
  Center,
  Heading,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import useStore from 'state/store';

type Props = {};

const PlaylistCreateSuccessAlert = (props: Props) => {
  const { playlist, clearPlaylist } = useStore((store) => ({
    playlist: store.playlist,
    clearPlaylist: store.clearPlaylist,
  }));

  return (
    <Alert
      status='success'
      variant='top-accent'
      flexDir='column'
      gap={4}
      py={12}
      mb={8}
    >
      <AlertIcon boxSize='12' mt={8} />
      <Heading size='md' fontFamily='body'>
        Playlist successfully created!
      </Heading>
      <Center>
        <Button
          as='a'
          size='lg'
          cursor='pointer'
          colorScheme='green'
          href={`https://open.spotify.com/playlist/${playlist.id}`}
          target='_blank'
          rel='noopener noreferrer'
        >
          View Playlist
        </Button>
        <Button
          size='lg'
          cursor='pointer'
          variant='outline'
          colorScheme='green'
          ml={2}
          onClick={clearPlaylist}
        >
          Start Again
        </Button>
      </Center>
    </Alert>
  );
};

export default PlaylistCreateSuccessAlert;
