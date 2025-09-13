import React from 'react';
import { Dialog, Portal, Button, TextInput } from 'react-native-paper';

interface NewListDialogProps {
  visible: boolean;
  onDismiss: () => void;
  listName: string;
  onListNameChange: (name: string) => void;
  onCreate: () => void;
}

export const NewListDialog: React.FC<NewListDialogProps> = ({
  visible,
  onDismiss,
  listName,
  onListNameChange,
  onCreate,
}) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Create New List</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="List Name"
            value={listName}
            onChangeText={onListNameChange}
            mode="outlined"
            autoFocus
            onSubmitEditing={onCreate}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button
            onPress={onCreate}
            disabled={!listName.trim()}
          >
            Create
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
