import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';

import { Navbar } from './layout/Navbar';
import { theme } from './theme';

// Polyfills
import 'regenerator-runtime/runtime';

// Start App
ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />

    <BrowserRouter>
      <Navbar>
        <h1>Hello World!</h1>
      </Navbar>
    </BrowserRouter>
  </ThemeProvider>,
  document.getElementById('root')
);