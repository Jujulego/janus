import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import createEmotionServer from '@emotion/server/create-instance'
import { ServerStyleSheets } from '@material-ui/styles';
import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from 'next/document';
import { Children } from 'react';

import { theme } from '../theme';

// Emotion cache
const getCache = () => {
  const cache = createCache({ key: 'css', prepend: true });
  cache.compat = true;

  return cache;
}

// Document
export default class MyDocument extends Document {
  // Statics
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    // Collect style sheets
    const sheets = new ServerStyleSheets();
    const renderPage = ctx.renderPage;

    const cache = getCache();
    const { extractCriticalToChunks } = createEmotionServer(cache);

    ctx.renderPage = () => renderPage({
      enhanceApp: (App) => (props) => sheets.collect(
        <CacheProvider value={cache}>
          <App {...props} />
        </CacheProvider>
      )
    });

    // Props
    const initialProps = await Document.getInitialProps(ctx);
    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map((style) => (
      <style
        data-emotion={`${style.key} ${style.ids.join(' ')}`}
        key={style.key}
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    ));

    return {
      ...initialProps,
      styles: [
        ...Children.toArray(initialProps.styles),
        sheets.getStyleElement(),
        ...emotionStyleTags
      ]
    };
  }

  // Methods
  render() {
    return (
      <Html lang="fr">
        <Head>
          <meta name="theme-color" content={theme.palette.primary.main} />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
