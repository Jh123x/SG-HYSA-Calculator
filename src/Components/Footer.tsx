import { Container, Typography, Link, Box } from "@mui/material";
import { bgColor } from "../consts/colors";
import Socials from "./Socials";

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: bgColor,
        py: 1.5,
        borderTop: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0,
      }}
    >
      <Container maxWidth="sm" sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1, flexWrap: "wrap" }}>
        <Socials />
        <Typography variant="body2" color="textSecondary">
          {"Copyright © "}
          <Link color="inherit" href="https://jh123x.com/">
            Jh123x
          </Link>{" "}
          {new Date().getFullYear()}
        </Typography>
      </Container>
    </Box>
  );
};
