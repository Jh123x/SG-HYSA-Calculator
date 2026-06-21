import { alpha, IconButton, Tooltip } from "@mui/material";
import { primaryColor } from "../consts/colors";
import { ReactElement } from "react";

interface BaseButtonProps {
  children: ReactElement;

  tooltip?: string;
  size?: "small" | "medium" | "large";
  ariaLabel?: string;
}

interface ButtonHrefProps extends BaseButtonProps {
  href: string;
}

interface ButtonOnClickProps extends BaseButtonProps {
  onClick: () => void;
}

export function ThemeButton(props: ButtonHrefProps): React.JSX.Element;
export function ThemeButton(props: ButtonOnClickProps): React.JSX.Element;

export function ThemeButton(props: ButtonHrefProps | ButtonOnClickProps) {
  return (
    <Tooltip title={props.tooltip} arrow>
      <IconButton
        onClick={"onClick" in props ? props.onClick : () => {}}
        size={props.size}
        aria-label={props.ariaLabel ?? props.tooltip}
        target={"href" in props ? "_blank" : "_self"}
        rel="noopener noreferrer"
        sx={{
          "&:hover": {
            backgroundColor: alpha(primaryColor, 0.15),
            color: primaryColor,
          },
        }}
        href={"href" in props ? props.href : "#"}
      >
        {props.children}
      </IconButton>
    </Tooltip>
  );
}
