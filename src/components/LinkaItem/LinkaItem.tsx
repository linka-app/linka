import { doDelete, doUpdate, getBookmark } from '@/api/linkding';
import { BookmarkForm } from '@/components/BookmarkForm';
import { LoadingIcon } from '@/components/LoadingIcon/LoadingIcon';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useContexts } from '@/hooks/useContexts';
import { I18nLocals, i18n } from '@/i18n';
import { BookmarkItem } from '@/types';
import { getConfig } from '@/utils';
import { shortenURL } from '@/utils/shortenURL/shortenURL';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import {
  Button,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import _ from 'lodash';
import React, { useState } from 'react';
import { FormContainer } from 'react-hook-form-mui';

export const LinkaItem: React.FC<{
  item: BookmarkItem;
  selected: boolean;
  showLeftAvatar: boolean;
}> = (props) => {
  const config = getConfig();
  const translation = i18n[(config?.language as I18nLocals) || 'en'];

  const [isDrawerLoading, setIsDrawerLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { doToast, doDrawer } = useContexts();
  const { getTheBookmarks } = useBookmarks();
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('md'));

  if (!_.get(props, 'item.url')) {
    return <></>;
  }

  const getDrawerData = async () => {
    if (props.item.id != null) {
      const deleteBookmark = async () => {
        doDelete({
          id: props.item.id as number,
        })
          .then((res: any) => {
            doToast({
              open: true,
              title: translation.statusSuccess,
            });

            doDrawer({
              open: false,
              children: <></>,
            });

            getTheBookmarks();
          })
          .catch((reason) => {
            doToast({
              open: true,
              type: 'error',
              title: translation.statusFailed,
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
                        title: translation.statusSuccess,
                      });

                      doDrawer({
                        open: false,
                        children: <></>,
                      });

                      getTheBookmarks();
                    })
                    .catch((reason) => {
                      doToast({
                        open: true,
                        type: 'error',
                        title: translation.statusFailed,
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
                      {translation.linkaItemDelete}
                    </Button>
                  }
                />
              </FormContainer>
            </Stack>
          );
        })
        .catch((reason) => {
          console.log('reason: ', reason);
          return (
            <Stack direction={'column'} spacing={2}>
              <Typography variant="h6">{translation.linkaItemOops}</Typography>
              <Typography variant="body1">
                {translation.linkaItemNotYourBookmark}
              </Typography>
            </Stack>
          );
        });
    }
  };

  return (
    <ListItem
      divider
      disablePadding
      secondaryAction={
        <IconButton
          disabled={isDrawerLoading}
          edge="end"
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
      <ListItemButton
        component="a"
        href={props.item.url}
        selected={props.selected}
        target="_blank"
        dense
      >
        {isDesktop && props.showLeftAvatar && (
          <ListItemAvatar>
            {props.selected ? <KeyboardArrowRightOutlinedIcon /> : null}
          </ListItemAvatar>
        )}
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

export default LinkaItem;
