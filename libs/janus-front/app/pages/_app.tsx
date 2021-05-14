import { CacheProvider } from '@emotion/react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import createCache from '@emotion/cache';
import Head from 'next/head';

import { theme } from '../src/theme';
import { Navbar } from '../src/layout/Navbar';

// Emotion cache
export const cache = createCache({ key: 'css', prepend: true });

// App
export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  // Effects
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');

    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  // Render
  return (
    <CacheProvider value={cache}>
      <Head>
        <title>Janus Proxy</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar>
          <Component {...pageProps} />
        </Navbar>
      </ThemeProvider>
    </CacheProvider>
  );
};
