import { getTags } from '@/api/linkding/getTags';
import { BookmarkFormFillButton } from '@/components/BookmarkForm/BookmarkFormFillButton';
import { TagItem, Tags } from '@/types';
import { Button, Unstable_Grid2 as Grid, Stack } from '@mui/material';
import React, { ReactNode, useEffect, useState } from 'react';
import {
  AutocompleteElement,
  SwitchElement,
  TextFieldElement,
  TextareaAutosizeElement,
} from 'react-hook-form-mui';

export const BookmarkForm: React.FC<{
  loading: boolean;
  actions: ReactNode;
}> = (props) => {
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    getTags().then((res: Tags) => {
      const theTags = res.results.map((hit: TagItem) => {
        return hit.name;
      });
      setTags(theTags);
    });
  }, []);

  return (
    <Stack spacing={2} pb={2}>
      <Grid container spacing={0}>
        <Grid xs={8}>
          <Stack direction={'row'} spacing={1}>
            <SwitchElement
              label="Unread"
              labelPlacement="start"
              name="unread"
            />
            <SwitchElement
              label="Archived"
              labelPlacement="start"
              name="is_archived"
            />
            <SwitchElement
              label="Shared"
              labelPlacement="start"
              name="shared"
            />
          </Stack>
        </Grid>
        <Grid
          xs={12}
          md={4}
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          {props.actions}
        </Grid>
      </Grid>

      <TextFieldElement
        name="url"
        label="Url"
        fullWidth
        required
        autoComplete="off"
      />
      <BookmarkFormFillButton />
      <TextFieldElement
        name="title"
        label="Title"
        fullWidth
        autoComplete="off"
      />
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
      <TextFieldElement
        name="website_title"
        label="Website Title"
        autoComplete="off"
        fullWidth
      />
      <TextareaAutosizeElement
        autoComplete="off"
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

export default BookmarkForm;
