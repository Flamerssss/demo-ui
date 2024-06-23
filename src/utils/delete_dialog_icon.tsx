import React, { useState } from "react";

// material-ui
import {
  Avatar,
  Box,
  Button,
  Dialog,
  IconButton,
  styled,
  Typography,
} from "@mui/material";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";

import { observer } from "mobx-react-lite";
// import firebase from "firebase/compat/app";
// import "firebase/compat/firestore";
// import carStore from "@/store/car_store";
import snackbar from "@/components/Snackbars/Snackbar";
import { del } from './db_service';

const AvatarError = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.error.lighter};
      color: ${theme.colors.error.main};
      width: ${theme.spacing(12)};
      height: ${theme.spacing(12)};

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(45)};
      }
`
);

const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
     }
    `
);

// ===============================|| UI DIALOG - SWEET ALERT ||=============================== //
// @ts-ignore
export function DeleteDialogIcon({ e, document, onSuccess }) {
  // function DeleteDialog({ delFunc }) {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const { showLoading, showSuccess, showError } = snackbar();

  const onDelete = async () => {
    showLoading();
    try {
      const result = await del(`/${e}`, document);
      console.log('delete result', result);

      if (result.success === true) {
        showSuccess(t("deleted"));
        if (onSuccess) {
          onSuccess(); // вызываем переданную функцию
        }
      }
    } catch (error) {
      console.error('Error during delete property', error);
      showError(error);
    }
  };

  return (
    <>
      <IconButton onClick={handleClickOpen} color="error">
        <DeleteTwoToneIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ p: 3 }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          p={5}
        >
          <AvatarError>
            <CloseIcon />
          </AvatarError>

          <Typography
            align="center"
            sx={{
              py: 4,
              px: 6,
            }}
            variant="h3"
          >
            {t("confirm_delete_title")}
            {t("confirm_delete_body")}
          </Typography>

          <Box>
            <Button
              variant="text"
              size="large"
              sx={{
                mx: 1,
              }}
              onClick={handleClose}
            >
              {t("back")}
            </Button>
            <ButtonError
              onClick={onDelete}
              size="large"
              sx={{
                mx: 1,
                px: 3,
              }}
              variant="contained"
            >
              {t("delete")}
            </ButtonError>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

export default observer(DeleteDialogIcon);
