import React from 'react';
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
  Alert,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArticleIcon from '@mui/icons-material/Article';
import { textColor } from '../consts/colors.ts';

export const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:600px)');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [showAlert, setShowAlert] = React.useState(true)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: 'transparent' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          sx={{
            color: textColor,
            fontWeight: 600,
            flexGrow: 1,
          }}
        >
          SG HYSA Calculator
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                  }
                }}
              >
                <MenuItem>
                  <IconButton
                    href='https://jh123x.com'
                    target='_blank'
                    size='small'
                  >
                    <ArticleIcon sx={{ mr: 1 }} />
                    Blog Post (2024)
                  </IconButton>
                </MenuItem>
                <MenuItem>
                  <IconButton
                    href='https://github.com/jh123x/SG-HYSA-Calculator'
                    target='_blank'
                    size='small'
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
                target='_blank'
                sx={{ color: textColor }}
              >
                <ArticleIcon />
              </IconButton>
              <IconButton
                size="large"
                href="https://github.com/jh123x/SG-HYSA-Calculator"
                target='_blank'
                sx={{ color: textColor }}
              >
                <GitHubIcon />
              </IconButton>
            </>
          )}
        </Box>
      </Toolbar>
      <Alert
        severity="info"
        sx={{
          display: showAlert ? '' : 'none',
          position: 'fixed',
          bottom: "10px",
          color: "#fff",
          right: "10px",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
        onClose={() => setShowAlert(false)}
      >
        You do not need to key in 0 values
      </Alert>
    </AppBar>
  );
};
