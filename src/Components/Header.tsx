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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArticleIcon from '@mui/icons-material/Article';
import { textColor } from '../consts/colors.ts';

export const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:600px)');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => { setAnchorEl(event.currentTarget); };
  const handleClose = () => { setAnchorEl(null) };

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
    </AppBar>
  );
};
