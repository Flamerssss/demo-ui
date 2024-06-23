// Файл useCustomSnackbar.tsx
import React from 'react';
import { Button } from "@mui/material";
import { useSnackbar } from "notistack";
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

const snackbarButton = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const router = useRouter();

  const showSnackbar = (message, options) => {
    enqueueSnackbar(message, {
      ...options,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
    });
  };

  const showLoading = () => {
    showSnackbar(t('loading'), { variant: 'warning', key: 'loadKey' });
  };

  const showSuccess = (result) => {
    closeSnackbar('loadKey');
    showSnackbar(t("job_run_success"), {
      key: 'successKey',
      variant: 'success',
      autoHideDuration: 6000,
      action: key => (
        <Button color="secondary" size="small" onClick={() => {
          closeSnackbar(key);
          router.push('/audits/details/runs/' + result?.result?.result?.id);
        }}>
          Перейти
        </Button>
      ),
    });
  };

  const showError = (error) => {
    closeSnackbar('loadKey');
    showSnackbar(`${error}`, { variant: 'error', key: 'errorKey' });
  };

  return { showLoading, showSuccess, showError };
};

export default snackbarButton;
