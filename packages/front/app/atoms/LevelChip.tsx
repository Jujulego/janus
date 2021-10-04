import { Chip } from '@mui/material';
import { grey } from '@mui/material/colors';
import CircleIcon from '@mui/icons-material/Circle';
import { FC } from 'react';

import { levelsColors, levelsIcons } from '../levels';

// Types
export interface LevelChipProps {
  level: string;
  enabled: boolean;
  onToggle(): void;
}

// Component
export const LevelChip: FC<LevelChipProps> = ({ level, enabled, onToggle }) => {
  const Icon = levelsIcons[level] || CircleIcon;

  return (
    <Chip
      label={level}
      icon={<Icon sx={{ fill: enabled ? levelsColors[level] : grey[700] }} />}
      variant={enabled ? 'filled' : 'outlined'}
      sx={{
        color: enabled ? 'text.primary' : 'text.disabled',
        textTransform: 'capitalize'
      }}
      onClick={onToggle}
    />
  );
};
