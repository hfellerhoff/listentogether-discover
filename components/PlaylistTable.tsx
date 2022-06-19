import { PlaylistTableRow } from './PlaylistTableRow';
import { TableContainer, Table, Thead, Tr, Th, Tbody } from '@chakra-ui/react';
import Spotify from 'spotify-web-api-js';
import PlaylistMetadata from './PlaylistMetadata';
import { HeartFilledIcon } from '@radix-ui/react-icons';

type Props = {
  tracks: SpotifyApi.TrackObjectFull[];
  savedTracks: string[];
  spotify: Spotify.SpotifyWebApiJs;
};

const PlaylistTable = ({ tracks, savedTracks, spotify }: Props) => {
  return (
    <>
      <TableContainer py={4}>
        <Table variant='simple'>
          <Thead>
            <Tr>
              <Th fontFamily='body'>#</Th>
              <Th fontFamily='body'></Th>
              <Th fontFamily='body'>Title</Th>
              <Th fontFamily='body'>Album</Th>
              <Th fontFamily='body'>
                <HeartFilledIcon color='#1CD760' />
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {tracks.map((track, i) => (
              <PlaylistTableRow
                key={track.id}
                number={i + 1}
                track={track}
                spotify={spotify}
                isSaved={savedTracks.includes(track.id)}
              />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default PlaylistTable;
