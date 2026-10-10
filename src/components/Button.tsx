import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({
  children,
  className,
  type = "button",
  variant = "primary",
  ...buttonProps
}: ButtonProps) {
  const classes = className
    ? `tg-button tg-button--${variant} ${className}`
    : `tg-button tg-button--${variant}`;

  return (
    <button {...buttonProps} className={classes} type={type}>
      {children}
    </button>
  );
}

export default Button;
