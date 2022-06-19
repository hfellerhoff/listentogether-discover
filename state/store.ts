import create from 'zustand';
import produce from 'immer';
import Spotify from 'spotify-web-api-js';

export enum Modal {
  None = 'none',
  DeviceSelect = 'device-select',
  PlaybackControl = 'playback-control',
  QueueSong = 'queue-song',
}

export type SpotifyAPI = Spotify.SpotifyWebApiJs;

type Playlist = {
  id: string;
  name: string;
  tracks: SpotifyApi.TrackObjectFull[];
};

type VoidMethod = () => void;
type SetMethod<T> = (value: T) => void;
type HandlerMethod<T> = (value: T) => () => void;

export interface Store {
  modal: Modal;
  setModal: SetMethod<Modal>;
  handleSetModal: HandlerMethod<Modal>;

  spotify: SpotifyAPI;

  playlist: Playlist;
  setPlaylist: SetMethod<Playlist>;
  setPlaylistName: SetMethod<string>;
  clearPlaylist: VoidMethod;
}

const EMPTY_PLAYLIST: Playlist = {
  id: '',
  name: '',
  tracks: [],
};

const useStore = create<Store>((set, get) => ({
  modal: Modal.None,
  setModal: (modal) => set({ modal }),
  handleSetModal: (modal) => () => set({ modal }),

  spotify: new Spotify(),

  playlist: EMPTY_PLAYLIST,
  setPlaylist: (playlist) =>
    set((state) => ({
      ...state,
      playlist,
    })),
  setPlaylistName: (name: string) =>
    set((state) => ({ ...state, playlist: { ...state.playlist, name } })),
  clearPlaylist: () => get().setPlaylist(EMPTY_PLAYLIST),
}));

export default useStore;
