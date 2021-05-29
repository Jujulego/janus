import {
  AppBar,
  Box, Divider, Drawer,
  IconButton, Link,
  List, ListItem, ListItemText, ListSubheader,
  makeStyles,
  Theme,
  Toolbar, Tooltip,
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
const useStyles = makeStyles(({ spacing, zIndex }) => ({
  drawerPaper: {
    width: 300,
    zIndex: zIndex.drawer
  },
  content: {
    flexGrow: 1,
    minHeight: '100vh',

    padding: spacing(2),

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
  }, [router.asPath]);

  // Handlers
  const handleOpen  = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); };

  // Render
  const small = useMediaQuery(({ breakpoints }: Theme) => breakpoints.down('lg'));
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
          <NextLink href="/" passHref>
            <Typography component="a" variant="h6" sx={{ flex: 1, color: 'text.primary', textDecoration: 'none' }}>Janus Proxy</Typography>
          </NextLink>
          <Tooltip title="GraphQL Playground">
            <IconButton component={Link} href="/graphql" color="inherit">
              <AttractionsIcon />
            </IconButton>
          </Tooltip>
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
          <NextLink href="/" passHref>
            <Typography component="a" variant="h6" sx={{ flex: 1, color: 'text.primary', textDecoration: 'none' }}>Janus Proxy</Typography>
          </NextLink>
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
            <NextLink key={service.name} href={`/services/${service.name}`} passHref>
              <ListItem button component="a">
                <ListItemText
                  primary={service.name}
                  secondary={service.url}
                  secondaryTypographyProps={{ variant: 'body2', color: 'primary.light' }}
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
