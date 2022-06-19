import {
  Editable,
  EditablePreview,
  EditableInput,
  useEditableControls,
  ButtonGroup,
  Flex,
  IconButton,
  Input,
} from '@chakra-ui/react';
import { CheckIcon, Cross1Icon, Pencil2Icon } from '@radix-ui/react-icons';
import { FocusEvent, FocusEventHandler } from 'react';
import useStore from 'state/store';

type Props = {
  editable?: boolean;
};

const EditableTitleControls = () => {
  const {
    isEditing,
    getSubmitButtonProps,
    getCancelButtonProps,
    getEditButtonProps,
  } = useEditableControls();

  return isEditing ? (
    <ButtonGroup justifyContent='center' size='sm'>
      <IconButton
        aria-label='Save changes'
        icon={<CheckIcon />}
        {...getSubmitButtonProps()}
      />
      <IconButton
        aria-label='Discard changes'
        icon={<Cross1Icon />}
        {...getCancelButtonProps()}
      />
    </ButtonGroup>
  ) : (
    <Flex justifyContent='center'>
      <IconButton
        aria-label='Edit playlist title'
        size='sm'
        icon={<Pencil2Icon />}
        {...getEditButtonProps()}
      />
    </Flex>
  );
};

const PlaylistMetadata = ({ editable = true }: Props) => {
  const setName = useStore((store) => store.setPlaylistName);

  const handleOnBlur = async (e) => setName(e.target.defaultValue as string);

  return (
    <Editable
      textAlign='center'
      placeholder='Playlist Name'
      fontSize='2xl'
      isPreviewFocusable={false}
      display='flex'
      alignItems='center'
      justifyContent='center'
      gap={4}
      px={6}
    >
      <EditablePreview />
      {/* Here is the custom input */}
      <Input as={EditableInput} variant='filled' onBlur={handleOnBlur} />
      {editable && <EditableTitleControls />}
    </Editable>
  );
};

export default PlaylistMetadata;
