import { Divider, Stack } from '@mui/material';
import * as React from 'react';
import { PreferenceSwitcher } from './ColorModeSwitcher';
import { SettingsForm } from './SettingsForm';

export const Settings: React.FC = () => {
  return (
    <Stack
      direction={'column'}
      spacing={2}
      divider={<Divider orientation="horizontal" flexItem />}
    >
      <PreferenceSwitcher />
      <SettingsForm />
    </Stack>
  );
};

export default Settings;
