import { Skeleton, Stack } from '@mui/material';
import React from 'react';

export const AddBookmarkSkeleton: React.FC = () => {
  return (
    <Stack direction={'column'} spacing={2} sx={{ width: '100%' }}>
      <Skeleton sx={{ width: '100%' }} />
      <Skeleton sx={{ width: '100%' }} />
      <Skeleton sx={{ width: '100%' }} />
      <Skeleton sx={{ width: '100%' }} />
      <Skeleton sx={{ width: '100%' }} />
      <Skeleton sx={{ width: '100%' }} />
      <Skeleton sx={{ width: '100%' }} />
    </Stack>
  );
};

export default AddBookmarkSkeleton;
