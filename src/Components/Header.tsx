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
 * Shared header with app title and navigation tabs.
 *
 * Tabs navigate between /current and /history routes,
 * replacing the old in-page ToggleButtonGroup from MainPage.
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

  // Determine active tab from current path
  const tabValue = location.pathname.startsWith("/history")
    ? "history"
    : "current";

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ backgroundColor: "transparent" }}
    >
      <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          sx={{
            color: textColor,
            fontWeight: 600,
          }}
        >
          SG HYSA Calculator
        </Typography>

        {/* Tab navigation — replaces in-page toggle */}
        {!isMobile && (
          <Tabs
            value={tabValue}
            onChange={(_, v) => navigate(`/${v}`)}
            sx={{
              minHeight: "auto",
              "& .MuiTabs-indicator": {
                backgroundColor: primaryColor,
              },
            }}
          >
            <Tab label="Current Rates" value="current" sx={tabSx} />
            <Tab label="Rate History" value="history" sx={tabSx} />
          </Tabs>
        )}

        <Box sx={{ display: "flex", alignItems: "center" }}>
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
                <MenuItem onClick={() => { navigate("/current"); handleClose(); }}>
                  Current Rates
                </MenuItem>
                <MenuItem onClick={() => { navigate("/history"); handleClose(); }}>
                  Rate History
                </MenuItem>
                <MenuItem>
                  <IconButton
                    href="https://jh123x.com"
                    target="_blank"
                    size="small"
                  >
                    <ArticleIcon sx={{ mr: 1 }} />
                    Blog Post (2024)
                  </IconButton>
                </MenuItem>
                <MenuItem>
                  <IconButton
                    href="https://github.com/jh123x/SG-HYSA-Calculator"
                    target="_blank"
                    size="small"
                  >
                    <GitHubIcon sx={{ mr: 1 }} />
                    GitHub
                  </IconButton>
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
