import { doAuth } from "@/api";
import FormPartLinkdingSettings from "@/components/Settings/FormPartLinkdingSettings";
import { useContexts } from "@/hooks/useContexts";
import { LinkaPartialSettings } from "@/types";
import { setConfig } from "@/utils";
import { LoadingButton } from "@mui/lab";
import { Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { FormContainer } from "react-hook-form-mui";
import AuthProps from "./AuthProps";

export const Auth: React.FC<AuthProps> = (props) => {
  const { doToast, config } = useContexts();
  const [submitting, setSubmitting] = useState(false);

  const handleSetToken = (data: LinkaPartialSettings) => {
    setSubmitting(true);

    if (data.token && data.url) {
      doAuth({ token: data.token, url: data.url })
        .then((res) => {
          setConfig(data);
          props.setReady(true);
        })
        .catch((reason) => {
          doToast({
            open: true,
            type: "error",
            title: "Failed to load bookmarks.",
            description: "detail: " + reason,
          });
          props.setReady(false);
          setSubmitting(false);
        });
    }
  };

  return (
    <FormContainer defaultValues={config} onSuccess={handleSetToken}>
      <Stack mt={5} spacing={2}>
        <Typography variant="h2" pl={1}>
          Linka!
        </Typography>
        <FormPartLinkdingSettings />
        <LoadingButton loading={submitting} variant="contained" type="submit">
          Go!
        </LoadingButton>
      </Stack>
    </FormContainer>
  );
};

export default Auth;
