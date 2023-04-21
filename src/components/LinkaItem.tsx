import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import {
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { doArchive, doDelete, doShare } from '../api';
import { ToastContext } from '../contexts/ToastContext';
import { BookmarkItem } from '../types';
import { shortenURL } from '../utils/url';
import { LoadingIcon } from './LoadingIcon';

export const LinkaItem: React.FC<{
  item: BookmarkItem;
  key: string;
  onItemUpdate: () => void;
}> = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const token = localStorage.getItem('token');
  const url = localStorage.getItem('url');
  const { doToast } = React.useContext(ToastContext);

  const archiveAction = async () => {
    if (token != null && url != null) {
      setIsLoading(true);
      doArchive({ token: token, url: url, id: props.item.id })
        .then((res: any) => {
          doToast({
            open: true,
            title: 'Archived Successfully.',
          });
          console.log(res);
        })
        .catch((reason) => {
          console.log('reason: ', reason);
          doToast({
            open: true,
            type: 'error',
            title: 'Failed to archive',
            description: reason,
          });
        })
        .finally(() => {
          setIsLoading(false);
          props.onItemUpdate();
        });
    }
  };

  const deleteAction = async () => {
    if (token != null && url != null) {
      setIsLoading(true);
      doDelete({ token: token, url: url, id: props.item.id })
        .then((res: any) => {
          doToast({
            open: true,
            title: 'Deleted Successfully.',
          });
          console.log(res);
        })
        .catch((reason) => {
          console.log('reason: ', reason);
          doToast({
            open: true,
            type: 'error',
            title: 'Failed to delete',
            description: reason,
          });
        })
        .finally(() => {
          setIsLoading(false);
          props.onItemUpdate();
        });
    }
  };

  const shareAction = async () => {
    if (token != null && url != null) {
      setIsLoading(true);
      doShare({ token: token, url: url, id: props.item.id })
        .then((res: any) => {
          doToast({
            open: true,
            title: 'Shared Successfully.',
          });
          console.log(res);
        })
        .catch((reason) => {
          console.log('reason: ', reason);
          doToast({
            open: true,
            type: 'error',
            title: 'Failed to share',
            description: reason,
          });
        })
        .finally(() => {
          setIsLoading(false);
          props.onItemUpdate();
        });
    }
  };

  return (
    <ListItem
      key={props.item.id}
      dense
      divider
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      secondaryAction={
        isHovered && (
          <Stack spacing={1} direction={'row'}>
            <Tooltip title="Archive" arrow>
              <IconButton
                size={'small'}
                disabled={isLoading}
                aria-label="archive"
                onClick={archiveAction}
              >
                <LoadingIcon loading={isLoading} icon={<ArchiveIcon />} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete" arrow>
              <IconButton
                size={'small'}
                disabled={isLoading}
                aria-label="delete"
                onClick={deleteAction}
              >
                <LoadingIcon loading={isLoading} icon={<DeleteIcon />} />
              </IconButton>
            </Tooltip>
            {!props.item.shared && (
              <Tooltip title="Share" arrow>
                <IconButton
                  size={'small'}
                  disabled={isLoading}
                  aria-label="Share"
                  onClick={shareAction}
                >
                  <LoadingIcon
                    loading={isLoading}
                    icon={<FolderSharedIcon />}
                  />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        )
      }
    >
      <ListItemButton component="a" href={props.item.url} target="_blank">
        <ListItemText
          primary={props.item.title || shortenURL(props.item.url)}
          secondary={props.item.tag_names.map((e, index) => (
            <Typography mr={1} variant="caption" key={index}>
              #{e}
            </Typography>
          ))}
        />
      </ListItemButton>
    </ListItem>
  );
};
