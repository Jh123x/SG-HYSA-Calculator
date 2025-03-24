import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { primaryColor, textColor } from "../consts/colors.ts";
import { Alert, Box, IconButton, Link, Modal } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import CloseIcon from "@mui/icons-material/Close";

export const Header = () => {
    const [showAlert, setShowAlert] = React.useState(true);
    const [showInfoModal, setShowModal] = React.useState(false);

    return (
        <>
            <AppBar
                position="static"
                sx={{
                    backgroundColor: primaryColor,
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Toolbar
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img
                            src="logo.svg"
                            alt="logo"
                            style={{ maxWidth: "40px", borderRadius: "50%" }}
                        />
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                fontWeight: "bold",
                                color: textColor,
                            }}
                        >
                            HYSA Calculator
                        </Typography>
                    </Box>
                    <Box>
                        <IconButton
                            size="large"
                            color="inherit"
                            aria-label="tips"
                            onClick={() => setShowAlert(true)}
                            sx={{
                                color: textColor,
                                "&:hover": { color: "#ffffff" },
                            }}
                        >
                            <TipsAndUpdatesIcon />
                        </IconButton>
                        <IconButton
                            size="large"
                            color="inherit"
                            aria-label="info"
                            onClick={() => setShowModal(true)}
                            sx={{
                                color: textColor,
                                "&:hover": { color: "#ffffff" },
                            }}
                        >
                            <InfoIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

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
                    You do not need to key in 0 values.
                </Alert>
            )}

            <Modal
                open={showInfoModal}
                onClose={() => setShowModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "90%",
                        maxWidth: "500px",
                        backgroundColor: primaryColor,
                        color: textColor,
                        borderRadius: "12px",
                        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                        padding: "20px",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "10px",
                        }}
                    >
                        <Typography
                            id="modal-modal-title"
                            variant="h6"
                            sx={{
                                fontWeight: "bold",
                                color: textColor,
                            }}
                        >
                            HYSA Calculator
                        </Typography>
                        <IconButton
                            onClick={() => setShowModal(false)}
                            sx={{
                                color: textColor,
                                "&:hover": { color: "#ffffff" },
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Typography id="modal-modal-description" sx={{ fontSize: "14px", lineHeight: "1.6" }}>
                        This is a high-yield savings account calculator for Singapore Banks.
                        <br />
                        For any feature requests or suggestions, submit an issue{" "}
                        <Link
                            color="inherit"
                            href="https://github.com/Jh123x/SG-HYSA-Calculator/issues"
                            target="_blank"
                            sx={{
                                textDecoration: "none",
                                color: "#ffffff",
                                "&:hover": { textDecoration: "underline" },
                            }}
                        >
                            here
                        </Link>
                        .
                    </Typography>
                </Box>
            </Modal>
        </>
    );
};