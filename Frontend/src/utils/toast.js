import { toast } from "sonner";

export const successToast = (message) =>
  toast.success(message);

export const errorToast = (message) =>
  toast.error(message);

export const infoToast = (message) =>
  toast(message);