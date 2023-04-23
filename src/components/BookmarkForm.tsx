import { Box, Button, Stack } from '@mui/material';
import React, { ReactNode, useEffect, useState } from 'react';
import {
  AutocompleteElement,
  SwitchElement,
  TextFieldElement,
  TextareaAutosizeElement,
} from 'react-hook-form-mui';
import { getTags } from '../api';
import { TagItem, Tags } from '../types';
import { BookmarkFormFillButton } from './BookmarkFormFillButton';

export const BookmarkForm: React.FC<{
  loading: boolean;
  actions: ReactNode;
}> = (props) => {
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const url = localStorage.getItem('url');
    if (token != null && url != null) {
      getTags().then((res: Tags) => {
        const theTags = res.results.map((hit: TagItem) => {
          return hit.name;
        });
        setTags(theTags);
      });
    }
  }, []);

  return (
    <Stack spacing={2}>
      <Stack direction={'row'} spacing={1} sx={{ display: 'flex' }}>
        <SwitchElement label="Unread" labelPlacement="start" name="unread" />
        <SwitchElement
          label="Archived"
          labelPlacement="start"
          name="is_archived"
        />
        <SwitchElement label="Shared" labelPlacement="start" name="shared" />
        <Box sx={{ flexGrow: 1 }}></Box>
        {props.actions}
      </Stack>
      <Stack spacing={2} direction={'row'}>
        <TextFieldElement name="url" label="Url" fullWidth required />
        <BookmarkFormFillButton />
      </Stack>
      <TextFieldElement name="title" label="Title" fullWidth />
      <TextareaAutosizeElement
        name="description"
        label="Description"
        fullWidth
        resizeStyle="vertical"
        rows={3}
      />
      <AutocompleteElement
        label="Tags"
        multiple
        name="tag_names"
        options={tags}
        autocompleteProps={{
          freeSolo: true,
        }}
      />
      <TextFieldElement name="website_title" label="Website Title" fullWidth />
      <TextareaAutosizeElement
        name="website_description"
        label="Website Description"
        fullWidth
        resizeStyle="vertical"
        rows={3}
      />
      <Button
        disabled={props.loading}
        fullWidth
        type="submit"
        variant="contained"
      >
        Submit
      </Button>
    </Stack>
  );
};
