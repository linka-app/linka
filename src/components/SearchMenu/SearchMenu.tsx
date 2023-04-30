import { i18n, I18nLocals } from "@/i18n";
import { QueryBookmarkMode, ViewMode } from "@/types";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";
import { Divider, IconButton, Menu, MenuItem } from "@mui/material";
import React from "react";
import { useFormContext } from "react-hook-form-mui";
import { useContexts } from "@/hooks";

export const SearchMenu: React.FC = () => {
  const { config } = useContexts();
  const translation = i18n[(config?.language as I18nLocals) || "en"];

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { watch, setValue } = useFormContext();
  const defaultBookmarkQuery = watch("defaultBookmarkQuery", "");
  const resultViewMode = watch("resultViewMode", "condensed");

  const handleSelect = (query: QueryBookmarkMode = "") => {
    setValue("defaultBookmarkQuery", query);
    setAnchorEl(null);
  };

  const handleViewModeSelect = (viewMode: ViewMode) => {
    setValue("resultViewMode", viewMode);
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="more"
        id="bookmark-query-select-menu-button"
        aria-controls={open ? "bookmark-query-select-menu-button" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertSharpIcon />
      </IconButton>
      <Menu
        id="bookmark-query-select-menu-button"
        MenuListProps={{
          "aria-labelledby": "bookmark-query-select-menu-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          selected={defaultBookmarkQuery === ""}
          onClick={() => {
            handleSelect("");
          }}
        >
          {translation.mainBookMarksToShowMine}
        </MenuItem>
        <MenuItem
          selected={defaultBookmarkQuery === "shared"}
          onClick={() => {
            handleSelect("shared/");
          }}
        >
          {translation.mainBookMarksToShowIncludeShared}
        </MenuItem>
        <MenuItem
          selected={defaultBookmarkQuery === "archived"}
          onClick={() => {
            handleSelect("archived/");
          }}
        >
          {translation.mainBookMarksToShowArchived}
        </MenuItem>
        <Divider />
        <MenuItem
          selected={resultViewMode === "condensed"}
          onClick={() => {
            handleViewModeSelect("condensed");
          }}
        >
          {translation.settingsViewModeCondensed}
        </MenuItem>
        <MenuItem
          selected={resultViewMode === "expanded"}
          onClick={() => {
            handleViewModeSelect("expanded");
          }}
        >
          {translation.settingsViewModeExpanded}
        </MenuItem>
      </Menu>
    </>
  );
};

export default SearchMenu;
