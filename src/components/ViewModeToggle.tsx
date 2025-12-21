'use client';

import { ChartBarIcon, TableIcon } from 'lucide-react';
import { startTransition, useState } from 'react';
import { setViewModeCookie } from '../lib/cookies';
import type { ViewMode } from '../types/view';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface ViewModeToggleProps {
  initialViewMode: ViewMode;
}

export const ViewModeToggle = ({ initialViewMode }: ViewModeToggleProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);

  const toggleViewMode = () => {
    const nextViewMode = viewMode === 'chart' ? 'table' : 'chart';
    setViewMode(nextViewMode);
    startTransition(async () => {
      await setViewModeCookie(nextViewMode);
    });
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant='outline' size='icon' onClick={toggleViewMode}>
          {viewMode === 'table' ? <ChartBarIcon /> : <TableIcon />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {viewMode === 'chart' ? 'Switch to table view' : 'Switch to chart view'}
      </TooltipContent>
    </Tooltip>
  );
};
