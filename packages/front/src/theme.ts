import { amber, indigo } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

// Themes
export const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: amber,
    mode: 'dark',
  },
  components: {
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: { variant: 'h6' },
      },
    },
    MuiDialog: {
      defaultProps: {
        maxWidth: 'xs',
        fullWidth: true,
      },
    },
  },
});
