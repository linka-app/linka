import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import {
  Box,
  Button,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import {
  AutocompleteElement,
  FormContainer,
  SwitchElement,
  TextFieldElement,
  TextareaAutosizeElement,
} from 'react-hook-form-mui';
import { doDelete, doUpdate, getBookmark, getTags } from '../api';
import { DrawerContext } from '../contexts/DrawerContext';
import { ToastContext } from '../contexts/ToastContext';
import { BookmarkItem, TagItem, Tags } from '../types';
import { shortenURL } from '../utils/url';

export const LinkaItem: React.FC<{
  item: BookmarkItem;
  key: string;
  onItemUpdate: () => void;
}> = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem('token');
  const url = localStorage.getItem('url');
  const { doToast } = React.useContext(ToastContext);
  const { doDrawer } = React.useContext(DrawerContext);

  const getDrawerData = async () => {
    if (token != null && url != null && props.item.id != null) {
      const tags = await getTags({ token: token, url: url }).then(
        (res: Tags) => {
          return res.results.map((hit: TagItem) => {
            return hit.name;
          });
        }
      );

      const deleteBookmark = async () => {
        doDelete({
          token: token,
          url: url,
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
        token: token,
        url: url,
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
                    token: token,
                    url: url,
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
                <Stack spacing={2}>
                  <Stack direction={'row'} spacing={1} sx={{ display: 'flex' }}>
                    <SwitchElement
                      label="Unread"
                      labelPlacement="start"
                      name="unread"
                    />
                    <SwitchElement
                      label="Archived"
                      labelPlacement="start"
                      name="is_archived"
                    />
                    <SwitchElement
                      label="Shared"
                      labelPlacement="start"
                      name="shared"
                    />
                    <Box sx={{ flexGrow: 1 }}></Box>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={deleteBookmark}
                    >
                      Delete
                    </Button>
                  </Stack>
                  <TextFieldElement name="url" label="Url" fullWidth required />
                  <TextFieldElement name="title" label="Title" fullWidth />
                  <TextareaAutosizeElement
                    name="description"
                    label="Description"
                    fullWidth
                    resizeStyle="vertical"
                    rows={3}
                  />
                  <AutocompleteElement
                    label="Tags"
                    multiple
                    name="tag_names"
                    options={tags}
                    autocompleteProps={{
                      freeSolo: true,
                    }}
                  />
                  <TextFieldElement
                    name="website_title"
                    label="Website Title"
                    fullWidth
                  />
                  <TextareaAutosizeElement
                    name="website_description"
                    label="Website Description"
                    fullWidth
                    resizeStyle="vertical"
                    rows={3}
                  />
                  <Button
                    disabled={isLoading}
                    fullWidth
                    type="submit"
                    variant="contained"
                  >
                    Submit
                  </Button>
                </Stack>
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
          edge="end"
          aria-label="comments"
          onClick={() => {
            getDrawerData().then((res) => {
              doDrawer({
                open: true,
                children: <>{res}</>,
              });
            });
          }}
        >
          <KeyboardArrowRightOutlinedIcon />
        </IconButton>
      }
    >
      <ListItemButton component="a" href={props.item.url} target="_blank" dense>
        <ListItemText
          primary={props.item.title || shortenURL(props.item.url)}
          secondary={
            props.item.tag_names &&
            props.item.tag_names.map((e, index) => (
              <Typography mr={1} variant="caption" key={index}>
                #{e}
              </Typography>
            ))
          }
        />
      </ListItemButton>
    </ListItem>
  );
};
