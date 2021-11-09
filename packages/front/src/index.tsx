import { SwrCache } from '@jujulego/alma-api';
import { GqlWsClient } from '@jujulego/alma-graphql';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ReactDOM from 'react-dom';

import { Navbar } from './layout/Navbar';
import { theme } from './theme';

// Polyfills
import 'regenerator-runtime/runtime';

// Lazy components
const ServicePage = lazy(() => import(/* webpackChunkName: "service" */'./pages/ServicePage'));
const HomePage = lazy(() => import(/* webpackChunkName: "home" */'./pages/HomePage'));

// Start App
ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />

    <GqlWsClient endpoint="ws://localhost:5000/graphql">
      <SwrCache>
        <BrowserRouter>
          <Navbar>
            <Suspense fallback={<div>Loading ...</div>}>
              <Routes>
                <Route path="/service/:name" element={<ServicePage />} />
                <Route path="/" element={<HomePage />} />
              </Routes>
            </Suspense>
          </Navbar>
        </BrowserRouter>
      </SwrCache>
    </GqlWsClient>
  </ThemeProvider>,
  document.getElementById('root')
);
