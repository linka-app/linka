import * as React from 'react';
import { TextFieldElement } from 'react-hook-form-mui';

export const FormPartLinkdingSettings: React.FC = () => {
  return (
    <>
      <TextFieldElement
        name="url"
        label="linkding site base url"
        fullWidth
        required
        autoFocus
      />
      <TextFieldElement name="token" label="Token" fullWidth required />
    </>
  );
};

export default FormPartLinkdingSettings;
