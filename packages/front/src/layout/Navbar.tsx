import { AppBar, Box, Drawer, IconButton, Theme, Toolbar, Typography, useMediaQuery } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import { FC, useState } from 'react';
import { Link } from 'react-router-dom';

// Component
export const Navbar: FC = ({ children }) => {
  // State
  const [open, setOpen] = useState(false);

  // Render
  const small = useMediaQuery<Theme>(({ breakpoints }) => breakpoints.down('lg'));

  return (
    <Box display="flex">
      <AppBar
        position="fixed"
      >
        <Toolbar>
          { small && (
            <IconButton edge="start" color="inherit" sx={{ mr: 2 }} onClick={() => setOpen(true)}>
              <MenuIcon />
            </IconButton>
          ) }
          <Typography variant="h6" component={Link} to="/" sx={{ flex: 1, color: 'inherit', textDecoration: 'none' }}>
            Janus
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant={small ? 'temporary' : 'permanent'}
        PaperProps={{ elevation: 3 }}
        open={open} onClose={() => setOpen(false)}
        sx={{
          width: 300,
          flexShrink: 0,

          '& .MuiDrawer-paper': {
            width: 300,
            zIndex: ({ zIndex }) => ({ md: zIndex.appBar - 1 })
          }
        }}
      >
        <Toolbar>
          { small && (
            <>
              <Typography variant="h6" component={Link} to="/" sx={{ flex: 1, color: 'inherit', textDecoration: 'none' }}>
                Janus
              </Typography>
              <IconButton edge="end" color="inherit" onClick={() => setOpen(false)}>
                <ChevronLeftIcon />
              </IconButton>
            </>
          ) }
        </Toolbar>
      </Drawer>
      <Box
        component="main"
        height="100vh"
        flex={1}
        display="flex"
        flexDirection="column"
        overflow="auto"
      >
        <Toolbar />
        { children }
      </Box>
    </Box>
  );
};