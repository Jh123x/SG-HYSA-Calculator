import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useTheme,
  Menu,
  MenuItem,
  useMediaQuery,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { textColor, primaryColor } from "../consts/colors";

const TAB_CONFIG = {
  current: { path: "/", label: "Current Rates" },
  history: { path: "/history", label: "Rate History" },
  faq: { path: "/faq", label: "FAQ" },
} as const;

type TabKey = keyof typeof TAB_CONFIG;

/**
 * Simplified header matching the Excalidraw design:
 * - Left: "SG High Yield Savings Accounts" title
 * - Right: FAQ link + mobile hamburger menu
 *
 * Tab navigation has moved into the main content area (TabbedContent).
 */
export const Header = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const activeTab =
    (Object.keys(TAB_CONFIG) as TabKey[]).find(
      (key) => location.pathname === TAB_CONFIG[key].path,
    ) ?? "current";

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
        }}
      >
        {/* Left: title */}
        <Typography
          variant={isMobile ? "h6" : "h5"}
          component="h1"
          sx={{
            color: textColor,
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          SG High Yield Savings Accounts
        </Typography>

        {/* Right: FAQ link (desktop) or hamburger (mobile) */}
        <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          {isMobile ? (
            <>
              <IconButton
                size="large"
                onClick={handleMenu}
                color="inherit"
                sx={{ color: textColor }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      backgroundColor: theme.palette.background.paper,
                      borderRadius: 2,
                    },
                  },
                }}
              >
                {(Object.keys(TAB_CONFIG) as TabKey[]).map((key) => (
                  <MenuItem
                    key={key}
                    onClick={() => {
                      navigate(TAB_CONFIG[key].path);
                      handleClose();
                    }}
                    selected={activeTab === key}
                  >
                    {TAB_CONFIG[key].label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <Button
              onClick={() => navigate("/faq")}
              startIcon={<HelpOutlineOutlinedIcon />}
              sx={{
                color: textColor,
                textTransform: "none",
                fontWeight: 500,
                fontSize: "0.9rem",
                "&:hover": { color: primaryColor },
              }}
            >
              FAQs
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
