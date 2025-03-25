import * as React from "react";
import { CustomAppBar } from "./AppBar.tsx";
import { primaryColor, textColor } from "../consts/colors.ts";
import { Alert } from "@mui/material";

export const Header = () => {
    const [showAlert, setShowAlert] = React.useState(true);
    return (
        <>
            <CustomAppBar />
            {showAlert && (
                <Alert
                    severity="info"
                    sx={{
                        position: "fixed",
                        bottom: "10px",
                        right: "10px",
                        backgroundColor: primaryColor,
                        color: textColor,
                        borderRadius: "8px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                        zIndex: 1200,
                    }}
                    onClose={() => setShowAlert(false)}
                >
                    Tip: Leave fields empty instead of entering zeros
                </Alert>
            )}
        </>
    );
};