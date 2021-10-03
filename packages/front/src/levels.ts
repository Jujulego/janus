import { SvgIcon } from '@mui/material';
import { blue, cyan, red, yellow } from '@mui/material/colors';
import BuildIcon from '@mui/icons-material/BuildCircleOutlined';
import ErrorIcon from '@mui/icons-material/ErrorOutline';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import WarningIcon from '@mui/icons-material/WarningAmber';

// Colors
export const levelsColors: Record<string, string | undefined> = {
  debug: blue[700],
  verbose: cyan[700],
  warn: yellow[700],
  error: red[700]
};

export const levelsIcons: Record<string, typeof SvgIcon | undefined> = {
  debug: BuildIcon,
  verbose: InfoIcon,
  info: InfoIcon,
  warn: WarningIcon,
  error: ErrorIcon
};
