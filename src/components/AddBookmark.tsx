import { Stack } from '@mui/material';
import React, { useState } from 'react';
import { FormContainer } from 'react-hook-form-mui';
import { doCreate } from '../api';
import { DrawerContext } from '../contexts/DrawerContext';
import { ToastContext } from '../contexts/ToastContext';
import { BookmarkItem } from '../types';
import { BookmarkForm } from './BookmarkForm';

export const AddBookmark: React.FC<{
  onItemUpdate: () => void;
}> = (props) => {
  const { doToast } = React.useContext(ToastContext);
  const { doDrawer } = React.useContext(DrawerContext);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Stack direction={'column'} spacing={2}>
      <FormContainer
        defaultValues={{
          url: '',
          title: undefined,
          description: undefined,
          tag_names: [],
          is_archived: false,
          unread: false,
          shared: false,
        }}
        onSuccess={(data: BookmarkItem) =>
          doCreate({
            payload: data,
          })
            .then((res: any) => {
              doToast({
                open: true,
                title: 'Success.',
              });

              doDrawer({
                open: false,
                children: <></>,
              });

              props.onItemUpdate();
            })
            .catch((reason) => {
              doToast({
                open: true,
                type: 'error',
                title: 'Failed',
                description: reason,
              });
            })
            .finally(() => {
              setIsLoading(false);
            })
        }
      >
        <BookmarkForm loading={isLoading} actions={<></>} />
      </FormContainer>
    </Stack>
  );
};
