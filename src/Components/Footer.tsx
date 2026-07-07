import { Box, Typography } from "@mui/material";
import { mutedColor, borderColor } from "../consts/theme";
import Socials from "./Socials";

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        height: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        px: 2,
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
