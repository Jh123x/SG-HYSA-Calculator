import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Box } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { bgColor } from "../consts/colors";

export const Footer = () => {
  return (
    <Box sx={{ backgroundColor: bgColor, p: 6 }} component="footer">
      <Container maxWidth="sm">
        <Typography variant="body2" color="textSecondary" align="center">
          {"Copyright © "}
          <Link color="inherit" href="https://jh123x.com/">
            Jh123x
          </Link>{" "}
          {new Date().getFullYear()}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          sx={{ mt: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, opacity: 0.7 }}
        >
          <LockOutlinedIcon sx={{ fontSize: "0.9rem" }} />
          All data stored locally on your device. No data is ever sent to a server.
        </Typography>
      </Container>
    </Box>
  );
};
