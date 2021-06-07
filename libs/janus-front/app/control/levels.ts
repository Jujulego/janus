import { SvgIcon } from '@material-ui/core';
import { blue, cyan, red, yellow } from '@material-ui/core/colors';
import BuildIcon from '@material-ui/icons/BuildCircleOutlined';
import ErrorIcon from '@material-ui/icons/ErrorOutline';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import WarningIcon from '@material-ui/icons/WarningAmber';

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