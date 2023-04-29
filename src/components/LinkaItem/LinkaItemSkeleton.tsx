import {
  Box,
  ListItem,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';

export const LinkaItemSkeleton: React.FC = () => {
  return (
    <ListItem divider disablePadding dense>
      <ListItemText
        primary={
          <Box sx={{ width: '80%' }}>
            <Skeleton />
          </Box>
        }
        primaryTypographyProps={{
          sx: {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
        }}
        secondary={
          <Typography mr={1} variant="caption">
            <Stack direction={'row'} sx={{ width: '50%' }}>
              {[3, 2, 6, 4, 2].map((e, index) => (
                <Skeleton
                  key={index}
                  width={3 * e + '%'}
                  sx={{ marginRight: 1 }}
                />
              ))}
            </Stack>
          </Typography>
        }
        secondaryTypographyProps={{
          sx: {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
        }}
      />
    </ListItem>
  );
};

export default LinkaItemSkeleton;
