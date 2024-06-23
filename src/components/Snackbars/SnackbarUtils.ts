import { useSnackbar, WithSnackbarProps } from "notistack";
import React from "react";
import { Zoom } from "@mui/material";

let useSnackbarRef: WithSnackbarProps;
export const SnackbarUtilsConfigurator: React.FC = () => {
  useSnackbarRef = useSnackbar();
  return null;
};

export default {
  success(msg: string, options: any = {}) {
    this.toast(msg, { ...options, variant: "success" });
  },
  warning(msg: string, options: any = {}) {
    this.toast(msg, { ...options, variant: "warning" });
  },
  info(msg: string, options: any = {}) {
    this.toast(msg, { ...options, variant: "info" });
  },
  error(msg: string, options: any = {}) {
    this.toast(msg, {
      ...options,
      variant: "error",
      anchorOrigin: {
        vertical: options?.anchorOrigin?.vertical || "top",
        horizontal: options?.anchorOrigin?.horizontal || "right",
      },
      preventDuplicate: true,
    });
  },
  toast(msg?: string, options: any = {}) {
    const defaultOptions: object = {
      ...options,
      anchorOrigin: {
        vertical: options?.anchorOrigin?.vertical || "top",
        horizontal: options?.anchorOrigin?.horizontal || "right",
      },
      TransitionComponent: Zoom,
      autoHideDuration: 6000, // Значение по умолчанию
      onClick: () => useSnackbarRef.closeSnackbar(),
    };
    useSnackbarRef.enqueueSnackbar(msg, { ...defaultOptions, ...options });
  }
};
