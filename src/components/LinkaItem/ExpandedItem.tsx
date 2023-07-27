import { shortenURL } from '@/utils/shortenURL/shortenURL';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import {
  Grid,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
  useMediaQuery,
} from '@mui/material';
import moment from 'moment';
import React from 'react';
import LinkaItemProps from './LinkaItemProps';
import { openURLInDefaultBrowser } from '@/utils/openURL';

export const ExpandedItem: React.FC<LinkaItemProps> = (props) => {
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('md'));

  const theTime = moment(props.item.date_added).fromNow();

  const theTags =
    props.item.tag_names &&
    props.item.tag_names.map((e, index) => (
      <Typography mr={1} variant="caption" key={index}>
        #{e}
      </Typography>
    ));

  return (
    <ListItemButton
      component="a"
      onClick={() => {
        openURLInDefaultBrowser(props.item.url);
      }}
      selected={props.selected}
      dense
    >
      {isDesktop && props.showLeftAvatar && (
        <ListItemAvatar sx={{ display: 'flex' }}>
          {props.selected ? <OpenInNewOutlinedIcon /> : null}
        </ListItemAvatar>
      )}
      <Grid container spacing={0}>
        <Grid item xs={11}>
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
              <>
                {theTags}{' '}
                {props.item.description && (
                  <>
                    <Typography variant="caption" mr={1}>
                      |
                    </Typography>
                    <Typography variant="caption">
                      {props.item.description}
                    </Typography>
                  </>
                )}
              </>
            }
            secondaryTypographyProps={{
              sx: {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
            }}
          />
        </Grid>
        <Grid item xs={11}>
          <ListItemText
            pt={0}
            disableTypography
            secondary={<Typography variant="caption">{theTime}</Typography>}
          />
        </Grid>
      </Grid>
    </ListItemButton>
  );
};

export default ExpandedItem;
