import { SwrCache } from '@jujulego/alma-api';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ReactDOM from 'react-dom';

import { Navbar } from './layout/Navbar';
import { theme } from './theme';

// Polyfills
import 'regenerator-runtime/runtime';

// Start App
ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />

    <SwrCache>
      <BrowserRouter>
        <Navbar>
          <Suspense fallback={<div>Loading ...</div>}>
            <Switch>
              <Route path="/service/:name" component={lazy(() => import(/* webpackChunkName: "service" */'./pages/ServicePage'))} />
              <Route component={lazy(() => import(/* webpackChunkName: "home" */'./pages/HomePage'))} />
            </Switch>
          </Suspense>
        </Navbar>
      </BrowserRouter>
    </SwrCache>
  </ThemeProvider>,
  document.getElementById('root')
);