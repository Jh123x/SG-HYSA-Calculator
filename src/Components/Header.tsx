import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { primaryColor, textColor } from '../consts/colors.ts';

export const Header = () => {
    return (
        <AppBar position="static" sx={{
            color: textColor,
            backgroundColor: primaryColor,
        }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    HYSA Calculator
                </Typography>
            </Toolbar>
        </AppBar>
    );
}