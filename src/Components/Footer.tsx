import { Box, Typography } from "@mui/material";
import { mutedColor, borderColor } from "../consts/theme";
import Socials from "./Socials";

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5,
        px: { xs: 2, sm: 3 },
        borderTop: `1px solid ${borderColor}`,
        flexShrink: 0,
      }}
    >
      <Typography sx={{ fontSize: "0.7rem", color: mutedColor }}>
        © Jh123x {new Date().getFullYear()}
      </Typography>
      <Socials />
    </Box>
  );
};
