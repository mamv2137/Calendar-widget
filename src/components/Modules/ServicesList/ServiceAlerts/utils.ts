import { ServiceStatus } from "@/types";
import AlertError from "./AlertError";
import AlertFailed from "./AlertFailed";
import AlertSuccess from "./AlertSuccess";

export const alertsByStatus = {
  success: AlertSuccess,
  failed: AlertFailed,
  error: AlertError,
}

export const getServiceAlertByStatus = (status: ServiceStatus) => {
  return alertsByStatus[status] || null;
}