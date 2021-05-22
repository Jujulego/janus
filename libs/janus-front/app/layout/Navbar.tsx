import {
  AppBar,
  Box, Divider, Drawer,
  IconButton, Link,
  List, ListItem, ListItemText, ListSubheader,
  makeStyles,
  Theme,
  Toolbar,
  Typography,
  useMediaQuery
} from '@material-ui/core';
import { Attractions as AttractionsIcon, ChevronLeft as ChevronLeftIcon, Menu as MenuIcon } from '@material-ui/icons';
import { default as NextLink } from 'next/link';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';

import { IService } from '@jujulego/janus-common';
import { gql, useQuery } from '@apollo/client';

// Requests
interface NavbarData {
  services: Pick<IService, 'name' | 'url'>[];
}

const NAVBAR_QUERY = gql`
    query Navbar {
        services {
            name
            url
        }
    }
`;

// Styles
const useStyles = makeStyles(({ zIndex }) => ({
  drawerPaper: {
    width: 300,
    zIndex: zIndex.drawer
  },
  content: {
    minHeight: '100vh',
    flexGrow: 1,

    display: 'flex',
    flexDirection: 'column'
  }
}));

// Component
export const Navbar: FC = ({ children }) => {
  // State
  const [open, setOpen] = useState(false);

  // Data
  const { data } = useQuery<NavbarData>(NAVBAR_QUERY);

  // Contexts
  const router = useRouter();

  // Effects
  useEffect(() => {
    setOpen(false);
  }, [router.pathname]);

  // Handlers
  const handleOpen  = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); };

  // Render
  const small = useMediaQuery(({ breakpoints }: Theme) => breakpoints.down('md'));
  const styles = useStyles();

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: ({ zIndex }) => zIndex.drawer + 1 }}>
        <Toolbar>
          { small && (
            <IconButton
              color="inherit" edge="start"
              onClick={handleOpen}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          ) }
          <Typography variant="h6" sx={{ flex: 1 }}>Janus Proxy</Typography>
          <IconButton component={Link} href="/graphql" color="inherit">
            <AttractionsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        classes={{ paper: styles.drawerPaper }}
        variant={small ? "temporary" : "permanent"}
        PaperProps={{ elevation: 3 }}
        sx={{ width: 300, flexShrink: 0 }}
        open={open} onClose={handleClose}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flex: 1 }}>Janus Proxy</Typography>
          <IconButton
            color="inherit" edge="end"
            onClick={handleClose}
          >
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        { small && <Divider /> }
        <List
          component="nav"
          subheader={
            <ListSubheader component="div" sx={{ bgcolor: 'transparent' }}>
              Services
            </ListSubheader>
          }
        >
          { data?.services?.map((service) => (
            <NextLink key={service.name} href={`/${service.name}`} passHref>
              <ListItem button component="a">
                <ListItemText
                  primary={service.name}
                  secondary={service.url}
                  secondaryTypographyProps={{ color: 'primary.light' }}
                />
              </ListItem>
            </NextLink>
          )) }
        </List>
      </Drawer>
      <main className={styles.content}>
        <Toolbar />
        { children }
      </main>
    </Box>
  );
};
