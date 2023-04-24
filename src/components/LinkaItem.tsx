import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import {
  Button,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { FormContainer } from 'react-hook-form-mui';
import { doDelete, doUpdate, getBookmark } from '../api';
import { DrawerContext } from '../contexts/DrawerContext';
import { ToastContext } from '../contexts/ToastContext';
import { BookmarkItem } from '../types';
import { shortenURL } from '../utils/url';
import { BookmarkForm } from './BookmarkForm';
import { LoadingIcon } from './LoadingIcon';

export const LinkaItem: React.FC<{
  item: BookmarkItem;
  key: string;
  onItemUpdate: () => void;
}> = (props) => {
  const [isDrawerLoading, setIsDrawerLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { doToast } = React.useContext(ToastContext);
  const { doDrawer } = React.useContext(DrawerContext);

  const getDrawerData = async () => {
    if (props.item.id != null) {
      const deleteBookmark = async () => {
        doDelete({
          id: props.item.id as number,
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
          });
      };

      return await getBookmark({
        id: props.item.id,
      })
        .then((res: BookmarkItem) => {
          return (
            <Stack direction={'column'} spacing={2}>
              <FormContainer
                defaultValues={{
                  url: res.url,
                  title: res.title,
                  description: res.description,
                  tag_names: res.tag_names,
                  is_archived: res.is_archived,
                  unread: res.unread,
                  shared: res.shared,
                  website_title: res.website_title,
                  website_description: res.website_description,
                }}
                onSuccess={(data) =>
                  doUpdate({
                    id: props.item.id as number,
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
                <BookmarkForm
                  loading={isLoading}
                  actions={
                    <Button
                      variant="contained"
                      color="error"
                      onClick={deleteBookmark}
                    >
                      Delete
                    </Button>
                  }
                />
              </FormContainer>
            </Stack>
          );
        })
        .catch((reason) => {
          console.log('reason: ', reason);
        });
    }
  };

  return (
    <ListItem
      key={props.item.id}
      divider
      disablePadding
      secondaryAction={
        <IconButton
          disabled={isDrawerLoading}
          edge="end"
          aria-label="comments"
          onClick={() => {
            setIsDrawerLoading(true);
            getDrawerData().then((res) => {
              setIsDrawerLoading(false);
              doDrawer({
                open: true,
                children: <>{res}</>,
              });
            });
          }}
        >
          <LoadingIcon
            loading={isDrawerLoading}
            icon={<KeyboardArrowRightOutlinedIcon />}
          />
        </IconButton>
      }
    >
      <ListItemButton component="a" href={props.item.url} target="_blank" dense>
        <ListItemText
          primary={props.item.title || shortenURL(props.item.url)}
          primaryTypographyProps={{
            sx: {
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
          }}
          secondary={
            props.item.tag_names &&
            props.item.tag_names.map((e, index) => (
              <Typography mr={1} variant="caption" key={index}>
                #{e}
              </Typography>
            ))
          }
          secondaryTypographyProps={{
            sx: {
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
          }}
        />
      </ListItemButton>
    </ListItem>
  );
};
