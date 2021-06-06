import { Chip } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import CircleIcon from '@material-ui/icons/Circle';
import { FC } from 'react';

import { levelsColors, levelsIcons } from './levels';

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
