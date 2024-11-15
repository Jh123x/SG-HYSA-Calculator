import { Grid2, Link, Typography } from "@mui/material";
import React from "react";


export const Header = () => {
    return <Grid2 justifyContent="center" alignItems="center">
        <Typography variant="h2" gutterBottom>
            Optimize Your Interests
        </Typography>
        <Typography variant="h4" gutterBottom>
            This is a tool to calculate
            the interest gained by each
            particular bank, with your
            information.
            <Link href="https://jh123x.com/blog/2024/high-yield-saving-accounts/" target="_blanks">
                Complementing my blog post
            </Link>
        </Typography>
    </Grid2>
}