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
  Tabs,
  Tab,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import GitHubIcon from "@mui/icons-material/GitHub";
import ArticleIcon from "@mui/icons-material/Article";
import { textColor, primaryColor } from "../consts/colors";

/** Navigation tab configuration — single source of truth for routing */
const TAB_CONFIG = {
  current: { path: "/", label: "Current Rates" },
  history: { path: "/history", label: "Rate History" },
  faq: { path: "/faq", label: "FAQ" },
} as const;

type TabKey = keyof typeof TAB_CONFIG;

const tabSx = {
  color: `${textColor}99`,
  textTransform: "none" as const,
  fontWeight: 500,
  fontSize: "0.85rem",
  minWidth: "auto",
  "&.Mui-selected": {
    color: primaryColor,
    fontWeight: 600,
  },
};

/**
 * Shared header with app title (left), centered navigation tabs (middle),
 * and external links (right).
 *
 * Navigation tabs and mobile menu items are generated from TAB_CONFIG
 * so adding a new tab only requires adding a new entry to the map.
 *
 * Desktop: three-column layout — title | tabs | icons
 * Mobile: title + hamburger menu
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

  // Determine active tab from current path using TAB_CONFIG
  const activeTab = (Object.keys(TAB_CONFIG) as TabKey[]).find(
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
          flexWrap: "wrap",
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
          SG HYSA Calculator
        </Typography>

        {/* Center: tab navigation */}
        {!isMobile && (
          <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <Tabs
              value={activeTab}
              onChange={(_, v) => {
                navigate(TAB_CONFIG[v as TabKey].path);
              }}
              sx={{
                minHeight: "auto",
                "& .MuiTabs-indicator": {
                  backgroundColor: primaryColor,
                },
              }}
            >
              {(Object.keys(TAB_CONFIG) as TabKey[]).map((key) => (
                <Tab
                  key={key}
                  label={TAB_CONFIG[key].label}
                  value={key}
                  sx={tabSx}
                />
              ))}
            </Tabs>
          </Box>
        )}

        {/* Right: external links / mobile menu */}
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
                <MenuItem
                  component="a"
                  href="https://jh123x.com"
                  target="_blank"
                  onClick={handleClose}
                >
                  <ArticleIcon sx={{ mr: 1 }} />
                  Blog Post (2024)
                </MenuItem>
                <MenuItem
                  component="a"
                  href="https://github.com/jh123x/SG-HYSA-Calculator"
                  target="_blank"
                  onClick={handleClose}
                >
                  <GitHubIcon sx={{ mr: 1 }} />
                  GitHub
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <IconButton
                size="large"
                href="https://jh123x.com/blog/2024/high-yield-saving-accounts/"
                target="_blank"
                sx={{ color: textColor }}
              >
                <ArticleIcon />
              </IconButton>
              <IconButton
                size="large"
                href="https://github.com/jh123x/SG-HYSA-Calculator"
                target="_blank"
                sx={{ color: textColor }}
              >
                <GitHubIcon />
              </IconButton>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
