// Файл useCustomSnackbar.tsx
import { useSnackbar } from "notistack";
import { useTranslation } from 'react-i18next';

const snackbar = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const showSnackbar = (message, options) => {
    enqueueSnackbar(message, {
      ...options,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
    });
  };

  const showLoading = (title = t('loading')) => {
    showSnackbar(title, { variant: 'warning', key: 'loadKey' });
  };

  const showSuccess = (title) => {
    closeSnackbar('loadKey');
    showSnackbar(t(title), {
      key: 'successKey',
      variant: 'success',
      autoHideDuration: 6000,
    });
  };

  const showError = (error) => {
    closeSnackbar('loadKey');
    showSnackbar(`${error}`, { variant: 'error', key: 'errorKey' });
  };

  return { showLoading, showSuccess, showError, closeSnackbar };
};

export default snackbar;
