import { createTheme } from '@material-ui/core';
import { amber, blue } from '@material-ui/core/colors';
import { frFR } from '@material-ui/core/locale';

// Themes
export const theme = createTheme({
  palette: {
    primary: amber,
    secondary: blue,
    mode: "dark"
  },
  components: {
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: { variant: "h6" }
      }
    },
    MuiDialog: {
      defaultProps: {
        maxWidth: 'xs',
        fullWidth: true
      }
    }
  }
}, frFR);
