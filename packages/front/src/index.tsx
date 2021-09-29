import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';

import { theme } from './theme';

// Polyfills
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// Start App
ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />

    <BrowserRouter>
      <h1>Hello World!</h1>
    </BrowserRouter>
  </ThemeProvider>,
  document.getElementById('root')
);