import { ApolloProvider } from '@apollo/client';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect, useRef } from 'react';

import { createClient } from '../apollo-client';
import { Navbar } from '../layout/Navbar';
import { theme } from '../theme';

// Emotion cache
export const cache = createCache({ key: 'css', prepend: true });

// App
export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  // Effects
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');

    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }, []);

  // Refs
  const client = useRef(createClient());

  // Render
  const content = (
    <>
      <Head>
        <title>Janus Proxy</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ApolloProvider client={client.current}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Navbar>
            <Component {...pageProps} />
          </Navbar>
        </ThemeProvider>
      </ApolloProvider>
    </>
  );

  if (typeof window === 'undefined') {
    return content;
  }

  return (
    <CacheProvider value={cache}>
      { content }
    </CacheProvider>
  );
};
