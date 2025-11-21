import type { AlertColor } from "@mui/material";
import type { CartResponse } from "./cart";

export interface SnackbarProps {
  open: boolean;
  message?: string | null;
  severity: AlertColor;
  onClose?: () => void;
  anchorOrigin?: {
    vertical: "top" | "bottom";
    horizontal: "left" | "center" | "right";
  };
}


export interface PricingCardProps {
  cart: CartResponse;
}


