import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Box } from "@mui/material";
import { bgColor } from "../consts/colors.ts";

export const Footer = () => {
    return <Box
        sx={{ backgroundColor: bgColor, p: 6 }}
        component="footer"
    >
        <Container maxWidth="sm">
            <Typography variant="body2" color="text.secondary" align="center">
                {"Copyright © "}
                <Link color="inherit" href="https://jh123x.com/">
                    Jh123x
                </Link>
                {" "}{new Date().getFullYear()}
            </Typography>
        </Container>
    </Box>
}