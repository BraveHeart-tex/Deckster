'use client';

import { ChartBarIcon, TableIcon } from 'lucide-react';
import { startTransition, useState } from 'react';
import type { ViewMode } from '@/constants';
import { setViewModeCookie } from '../lib/cookies';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface ViewModeToggleProps {
  initialViewMode: ViewMode;
}

export const ViewModeToggle = ({ initialViewMode }: ViewModeToggleProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);

  const toggleViewMode = () => {
    setViewMode(viewMode === 'chart' ? 'table' : 'chart');
    startTransition(async () => {
      await setViewModeCookie(viewMode);
    });
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant='outline' size='icon' onClick={toggleViewMode}>
          {viewMode === 'chart' ? <ChartBarIcon /> : <TableIcon />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {viewMode === 'chart' ? 'Switch to table view' : 'Switch to chart view'}
      </TooltipContent>
    </Tooltip>
  );
};
