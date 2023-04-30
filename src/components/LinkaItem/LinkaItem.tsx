import { doDelete, doUpdate, getBookmark } from "@/api/linkding";
import { BookmarkForm } from "@/components/BookmarkForm";
import { LoadingIcon } from "@/components/LoadingIcon/LoadingIcon";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useContexts } from "@/hooks/useContexts";
import { i18n, I18nLocals } from "@/i18n";
import { BookmarkItem } from "@/types";
import { getConfig } from "@/utils";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import { Button, IconButton, ListItem, Stack, Typography } from "@mui/material";
import _ from "lodash";
import React, { useState } from "react";
import { FormContainer, useFormContext } from "react-hook-form-mui";
import CondensedItem from "./CondensedItem";
import ExpandedItem from "./ExpandedItem";
import LinkaItemProps from "./LinkaItemProps";

export const LinkaItem: React.FC<LinkaItemProps> = (props) => {
  const config = getConfig();
  const translation = i18n[(config?.language as I18nLocals) || "en"];

  const { watch } = useFormContext();
  const resultViewMode = watch("resultViewMode", "condensed");

  const [isDrawerLoading, setIsDrawerLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { doToast, doDrawer } = useContexts();
  const { getTheBookmarks } = useBookmarks();

  if (!_.get(props, "item.url")) {
    return <></>;
  }

  const getDrawerData = async () => {
    if (props.item.id != null) {
      const deleteBookmark = async () => {
        doDelete({
          id: props.item.id as number,
        })
          .then((res: any) => {
            doToast({
              open: true,
              title: translation.statusSuccess,
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
              title: translation.statusFailed,
              description: reason,
            });
          })
          .finally(() => {
            setIsLoading(false);
          });
      };

      return await getBookmark({
        id: props.item.id,
      })
        .then((res: BookmarkItem) => {
          return (
            <Stack direction={"column"} spacing={2}>
              <FormContainer
                defaultValues={{
                  url: res.url,
                  title: res.title,
                  description: res.description,
                  tag_names: res.tag_names,
                  is_archived: res.is_archived,
                  unread: res.unread,
                  shared: res.shared,
                  website_title: res.website_title,
                  website_description: res.website_description,
                }}
                onSuccess={(data) =>
                  doUpdate({
                    id: props.item.id as number,
                    payload: data,
                  })
                    .then((res: any) => {
                      doToast({
                        open: true,
                        title: translation.statusSuccess,
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
                        title: translation.statusFailed,
                        description: reason,
                      });
                    })
                    .finally(() => {
                      setIsLoading(false);
                    })
                }
              >
                <BookmarkForm
                  bookmarkId={props.item.id as number}
                  loading={isLoading}
                  actions={
                    <Button
                      variant="contained"
                      color="error"
                      onClick={deleteBookmark}
                    >
                      {translation.linkaItemDelete}
                    </Button>
                  }
                />
              </FormContainer>
            </Stack>
          );
        })
        .catch((reason) => {
          console.log("reason: ", reason);
          return (
            <Stack direction={"column"} spacing={2}>
              <Typography variant="h6">{translation.linkaItemOops}</Typography>
              <Typography variant="body1">
                {translation.linkaItemNotYourBookmark}
              </Typography>
            </Stack>
          );
        });
    }
  };

  return (
    <ListItem
      divider
      disablePadding
      secondaryAction={
        <IconButton
          disabled={isDrawerLoading}
          edge="end"
          onClick={() => {
            setIsDrawerLoading(true);
            getDrawerData().then((res) => {
              setIsDrawerLoading(false);
              doDrawer({
                open: true,
                children: <>{res}</>,
              });
            });
          }}
        >
          <LoadingIcon
            loading={isDrawerLoading}
            icon={<KeyboardArrowRightOutlinedIcon />}
          />
        </IconButton>
      }
    >
      {resultViewMode === "condensed" ? (
        <CondensedItem {...props} />
      ) : (
        <ExpandedItem {...props} />
      )}
    </ListItem>
  );
};

export default LinkaItem;
