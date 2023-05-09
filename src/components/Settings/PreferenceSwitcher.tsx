import { useContexts } from "@/hooks";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ImageIcon from "@mui/icons-material/Image";
import HideImageIcon from "@mui/icons-material/HideImage";
import { Button, Stack, useTheme } from "@mui/material";
import * as React from "react";

export const PreferenceSwitcher: React.FC = () => {
  const { config, setConfig } = useContexts();
  const { showBookmarkAvatar } = config;
  const theme = useTheme();
  const { toggleColorMode } = useContexts();
  const [show, setShow] = React.useState(showBookmarkAvatar);

  const toggleShowAvatar = React.useCallback(() => {
    setShow((prev) => {
      setConfig({ showBookmarkAvatar: !prev });
      return !prev;
    });
  }, []);

  return (
    <Stack
      sx={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        color: "text.primary",
      }}
      direction={"row"}
      spacing={2}
    >
      <Button
        variant="outlined"
        endIcon={
          theme.palette.mode === "dark" ? (
            <Brightness7Icon />
          ) : (
            <Brightness4Icon />
          )
        }
        onClick={toggleColorMode}
        color="inherit"
      >
        {theme.palette.mode} mode
      </Button>
      <Button
        variant="outlined"
        endIcon={show ? <ImageIcon /> : <HideImageIcon />}
        onClick={toggleShowAvatar}
        color="inherit"
      >
        bookmark favicon
      </Button>
    </Stack>
  );
};

export default PreferenceSwitcher;
