import { SwrCache } from '@jujulego/alma-api';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ReactDOM from 'react-dom';

import { Navbar } from './layout/Navbar';
import { HomePage } from './pages/HomePage';
import { ServicePage } from './pages/ServicePage';
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
          <Switch>
            <Route path="/service/:name" component={ServicePage} />
            <Route component={HomePage} />
          </Switch>
        </Navbar>
      </BrowserRouter>
    </SwrCache>
  </ThemeProvider>,
  document.getElementById('root')
);