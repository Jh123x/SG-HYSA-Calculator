import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  useMediaQuery,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import { textColor, primaryColor } from "../consts/colors";

/**
 * Header matching the wireframe:
 * - Desktop: "SG High Yield Savings Accounts" title (left) + FAQ button (right)
 * - Mobile: Savings icon (left) + FAQ button (right)
 *
 * Tab navigation lives in TabbedContent (toggle button group above inputs).
 */
export const Header = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ backgroundColor: "transparent" }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 1, sm: 2 },
        }}
      >
        {/* Left: icon (mobile) or title (desktop) */}
        {isMobile ? (
          <Tooltip title="SG High Yield Savings Accounts">
            <IconButton
              onClick={() => navigate("/")}
              sx={{ color: primaryColor }}
            >
              <SavingsOutlinedIcon sx={{ fontSize: 28 }} />
            </IconButton>
          </Tooltip>
        ) : (
          <Typography
            variant="h5"
            component="h1"
            sx={{
              color: textColor,
              fontWeight: 600,
              flexShrink: 0,
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            SG High Yield Savings Accounts
          </Typography>
        )}

        {/* Right: FAQ button (both mobile and desktop) */}
        <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          <Button
            onClick={() => navigate("/faq")}
            startIcon={<HelpOutlineOutlinedIcon />}
            size={isMobile ? "small" : "medium"}
            sx={{
              color: textColor,
              textTransform: "none",
              fontWeight: 500,
              fontSize: { xs: "0.8rem", sm: "0.9rem" },
              "&:hover": { color: primaryColor },
            }}
          >
            FAQs
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
