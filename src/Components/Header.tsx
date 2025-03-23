import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { primaryColor, textColor } from '../consts/colors.ts';
import { Alert, Box, Button, IconButton, Link, Modal } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import CloseIcon from '@mui/icons-material/Close';

export const Header = () => {
    const [showAlert, setShowAlert] = React.useState(true)
    const [showInfoModal, setShowModal] = React.useState(false)
    return (
        <>
            <AppBar
                position="static"
                sx={{
                    color: textColor,
                    backgroundColor: primaryColor,
                }}
            >
                <Toolbar>
                    <img src="logo.svg" alt="logo" style={{ maxWidth: '50px' }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        HYSA Calculator
                    </Typography>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2 }}
                        onClick={() => {
                            setShowAlert(true)
                        }}
                    >
                        <TipsAndUpdatesIcon />
                    </IconButton>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2 }}
                        onClick={() => {
                            setShowModal(true)
                        }}
                    >
                        <InfoIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Alert
                severity="info"
                sx={{ display: showAlert ? '' : 'none' }}
                onClose={() => setShowAlert(false)}
            >
                You do not need to key in 0 values
            </Alert>
            <Modal
                open={showInfoModal}
                onClose={() => setShowModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '50vw',
                    color: textColor,
                    bgcolor: primaryColor,
                    boxShadow: "20px",
                    padding: '25px',
                    borderRadius: '25px'
                }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography
                            id="modal-modal-title"
                            variant="h6"
                            sx={{
                                margin: "0px",
                                padding: "0px",
                            }}
                        >
                            HYSA Calculator
                        </Typography>
                        <Button
                            onClick={() => setShowModal(false)}
                            sx={{
                                padding: '0px',
                                margin: '0px',
                            }}
                        >
                            <CloseIcon
                                sx={{ color: 'white' }}
                            />
                        </Button>
                    </div>
                    <Typography
                        id="modal-modal-description"
                        sx={{ mt: 2 }}
                    >
                        This is a high yield savings account calculator for Singpore Banks.
                        <br />
                        For any feature requests, suggest a change {" "}
                        <Link color="inherit" href="https://github.com/Jh123x/SG-HYSA-Calculator/issues">
                            here
                        </Link>.
                    </Typography>
                </Box>
            </Modal>
        </>
    );
}