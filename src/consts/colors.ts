
import { createTheme } from "@mui/material";

export const primaryColor = '#555'
export const secondaryColor = '#bbb'
export const textColor = '#000'

export const theme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: secondaryColor,
        }
    },
});
