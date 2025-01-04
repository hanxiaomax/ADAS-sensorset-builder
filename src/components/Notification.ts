import { EnqueueSnackbar } from "notistack";

const notifier = {
  enqueueSnackbar: null as EnqueueSnackbar | null, // 保存 enqueueSnackbar

  init(enqueueSnackbar: EnqueueSnackbar) {
    this.enqueueSnackbar = enqueueSnackbar;
  },

  success(msg: string) {
    if (this.enqueueSnackbar) {
      this.enqueueSnackbar(msg, { variant: "success" });
    }
  },

  error(msg: string) {
    if (this.enqueueSnackbar) {
      this.enqueueSnackbar(msg, { variant: "error" });
    }
  },

  warning(msg: string) {
    if (this.enqueueSnackbar) {
      this.enqueueSnackbar(msg, { variant: "warning" });
    }
  },

  info(msg: string) {
    if (this.enqueueSnackbar) {
      this.enqueueSnackbar(msg, { variant: "info" });
    }
  },

  default(msg: string) {
    if (this.enqueueSnackbar) {
      this.enqueueSnackbar(msg, { variant: "default" });
    }
  },
};

export default notifier;
