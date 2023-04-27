import { Box, Divider, Skeleton, Stack } from '@mui/material';
import * as React from 'react';

export const SettingsSkeleton: React.FC = () => {
  return (
    <Stack
      direction={'column'}
      spacing={2}
      divider={<Divider orientation="horizontal" flexItem />}
    >
      <Box sx={{ width: '100%' }}>
        <Skeleton sx={{ width: '30%' }} />
        <Skeleton sx={{ width: '100%' }} />
        <Skeleton sx={{ width: '100%' }} />
      </Box>
      <Box sx={{ width: '100%' }}>
        <Skeleton sx={{ width: '50%' }} />
        <Skeleton sx={{ width: '100%' }} />
        <Skeleton sx={{ width: '100%' }} />
      </Box>
    </Stack>
  );
};

export default SettingsSkeleton;
