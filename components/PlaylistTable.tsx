import { PlaylistTableRow } from './PlaylistTableRow';
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Box,
  Text,
  Heading,
  Button,
  Center,
} from '@chakra-ui/react';
import Spotify from 'spotify-web-api-js';

type Props = {
  tracks: SpotifyApi.TrackObjectFull[];
  spotify: Spotify.SpotifyWebApiJs;
  onCreatePlaylist: () => void;
};

const PlaylistTable = ({ tracks, spotify, onCreatePlaylist }: Props) => {
  const isPlaylist = tracks.length > 0;
  return (
    <>
      <Center p={[4, 4, 8]}>
        <Button onClick={onCreatePlaylist} size='lg' mb={4}>
          {isPlaylist ? 'Create New Playlist' : 'Create Playlist'}
        </Button>
      </Center>
      {isPlaylist && (
        <TableContainer>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th fontFamily='body'>#</Th>
                <Th fontFamily='body'></Th>
                <Th fontFamily='body'>Title</Th>
                <Th fontFamily='body'>Album</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tracks.map((track, i) => (
                <PlaylistTableRow
                  key={track.id}
                  number={i + 1}
                  track={track}
                  spotify={spotify}
                />
              ))}
            </Tbody>
            {/* <Tfoot>
          <Tr>
          <Th>To convert</Th>
          <Th>into</Th>
          <Th isNumeric>multiply by</Th>
          </Tr>
        </Tfoot> */}
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default PlaylistTable;
