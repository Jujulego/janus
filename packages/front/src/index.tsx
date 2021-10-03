import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';

import { Navbar } from './layout/Navbar';
import { Home } from './pages/Home';
import { theme } from './theme';

// Polyfills
import 'regenerator-runtime/runtime';

// Start App
ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />

    <BrowserRouter>
      <Navbar>
        <Home />
      </Navbar>
    </BrowserRouter>
  </ThemeProvider>,
  document.getElementById('root')
);