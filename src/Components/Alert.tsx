import React from "react";
import { Check, Close } from "@mui/icons-material";
import { Alert, AlertColor, Collapse, IconButton } from "@mui/material";

interface AlertProps {
    children: string,
    severity: AlertColor,
    hideModel: boolean,
    onClose?: () => void,
}

export const WebAlert = ({ children, severity, hideModel, onClose = () => { } }: AlertProps) => (
    <Collapse in={!hideModel}>
        <Alert
            severity={severity}
            icon={<Check fontSize="inherit" />}
            sx={{
                position: "fixed",
                bottom: "10px",
                right: "10px",
                color: "#fff",
                borderRadius: "8px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            }}
            action={
                <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={onClose}
                >
                    <Close fontSize="inherit" />
                </IconButton>
            }
        >
            {children}
        </Alert>
    </Collapse>
);
