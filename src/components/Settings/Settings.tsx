import { Divider, Stack } from '@mui/material';
import * as React from 'react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { LinkdingSettingsForm } from './LinkdingSettingsForm';

export const Settings: React.FC = () => {
  return (
    <Stack
      direction={'column'}
      spacing={2}
      divider={<Divider orientation="horizontal" flexItem />}
    >
      <ColorModeSwitcher />
      <LinkdingSettingsForm />
    </Stack>
  );
};

export default Settings;
