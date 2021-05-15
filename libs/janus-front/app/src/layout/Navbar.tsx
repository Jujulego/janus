import { AppBar, IconButton, Link, makeStyles, Toolbar, Typography } from '@material-ui/core';
import { Attractions as AttractionsIcon } from '@material-ui/icons';
import { FC } from 'react';

// Styles
const useStyles = makeStyles({
  title: {
    flex: 1,
  },
  content: {
    minHeight: '100vh',

    display: 'flex',
    flexDirection: 'column'
  }
});

// Component
export const Navbar: FC = ({ children }) => {
  // Render
  const styles = useStyles();

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography className={styles.title} variant="h6">Janus Proxy</Typography>
          <IconButton component={Link} href="/graphql" color="inherit">
            <AttractionsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <main className={styles.content}>
        <Toolbar />
        { children }
      </main>
    </>
  );
};
