import React from 'react';
import { SnackbarContent, CircularProgress, Zoom } from '@mui/material';
import { useSnackbar, VariantType } from 'notistack';

interface LoadingSnackbarProps {
  message: string;
  open: boolean;
  onClose: () => void;
}

export const LoadingSnackbar: React.FC<LoadingSnackbarProps> = ({ message, open, onClose }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  // Функция для показа снекбара
  const showSnackbar = (message: string, variant: VariantType = 'default') => {
    enqueueSnackbar(message, {
      variant: variant,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
      TransitionComponent: Zoom,
      // Добавляем индикатор загрузки к сообщению
      content: (_key: string) => (
        <SnackbarContent
          style={{ backgroundColor: 'yellow', color: 'black' }} // Настройте цвета по вашему желанию
          message={
            <span id="client-snackbar" style={{ display: 'flex', alignItems: 'center' }}>
              <CircularProgress color="inherit" size={20} style={{ marginRight: 20 }} />
              {message}
            </span>
          }
          action={[]}
        />
      ),
    });
  };

  // Функция для закрытия снекбара
  const handleClose = () => {
    closeSnackbar();
    if (onClose) onClose(); // Вызов функции onClose, если она передана в пропсах
  };

  React.useEffect(() => {
    if (open) {
      showSnackbar(message, 'warning'); // Используем warning вариант для желтого цвета
    } else {
      handleClose();
    }
  }, [open, message]);

  return null; // Компонент не рендерит ничего сам по себе, управление через notistack
};

export default LoadingSnackbar;
