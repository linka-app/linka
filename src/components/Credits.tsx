import { Box, Link, Typography } from '@mui/material';
import * as React from 'react';

export const Credits: React.FC<{ version: string }> = (props) => {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      mb={3}
    >
      <Link
        href="https://github.com/cmsax/linka"
        target="_blank"
        underline="hover"
      >
        <Typography variant="caption">
          Linka! by cmsax & greg on GitHub, version {props.version}
        </Typography>
      </Link>
    </Box>
  );
};
