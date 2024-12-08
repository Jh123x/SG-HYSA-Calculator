
import { createTheme } from "@mui/material";

export const primaryColor = '#9550ff'
export const bgColor = '#282828'
export const textColor = '#FFFFFF'

export const theme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: bgColor,
        }
    },
});
