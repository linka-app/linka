import { doCreate } from "@/api/linkding/doCreate";
import { BookmarkForm } from "@/components/BookmarkForm";
import { useContexts } from "@/hooks";
import { BookmarkItem } from "@/types";
import { Stack } from "@mui/material";
import React, { useState } from "react";
import { FormContainer } from "react-hook-form-mui";

export const AddBookmark: React.FC = () => {
  const { doDrawer, doToast, theBookmarks } = useContexts();
  const { getTheBookmarks } = theBookmarks();

  const [isLoading, setIsLoading] = useState(false);

  return (
    <Stack direction={"column"} spacing={2}>
      <FormContainer
        defaultValues={{
          url: "",
          title: undefined,
          description: undefined,
          tag_names: [],
          is_archived: false,
          unread: false,
          shared: false,
        }}
        onSuccess={(data: BookmarkItem) =>
          doCreate({
            payload: data,
          })
            .then((res: any) => {
              doToast({
                open: true,
                title: "Success.",
              });

              doDrawer({
                open: false,
                children: <></>,
              });

              getTheBookmarks();
            })
            .catch((reason) => {
              doToast({
                open: true,
                type: "error",
                title: "Failed",
                description: reason,
              });
            })
            .finally(() => {
              setIsLoading(false);
            })
        }
      >
        <BookmarkForm loading={isLoading} actions={<></>} />
      </FormContainer>
    </Stack>
  );
};

export default AddBookmark;
