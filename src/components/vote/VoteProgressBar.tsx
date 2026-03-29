/** biome-ignore-all lint/a11y/noStaticElementInteractions: this is fine here */
'use client';

import {
  type CSSProperties,
  type MouseEvent,
  memo,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/src/lib/utils';

interface VoteProgressBarProps {
  percentage: number;
  participantNames?: string[];
  shouldHighlightConsensus?: boolean;
  votesRevealed?: boolean;
}

interface HoverPosition {
  x: number;
  y: number;
}

export const VoteProgressBar = memo(
  ({
    percentage,
    participantNames,
    shouldHighlightConsensus,
    votesRevealed,
  }: VoteProgressBarProps) => {
    const [hoverPosition, setHoverPosition] = useState<HoverPosition | null>(
      null
    );

    const canShowHover = votesRevealed && !!participantNames?.length;

    const progressBarStyles: CSSProperties = useMemo(
      () => ({
        width: `${percentage}%`,
      }),
      [percentage]
    );

    const handleMouseEnter = useCallback(
      (event: MouseEvent) => {
        if (!canShowHover) return;

        setHoverPosition({
          x: event.clientX,
          y: event.clientY,
        });
      },
      [canShowHover]
    );

    const handleMouseMove = useCallback(
      (event: MouseEvent) => {
        if (!canShowHover) return;

        setHoverPosition({
          x: event.clientX,
          y: event.clientY,
        });
      },
      [canShowHover]
    );

    const handleMouseLeave = useCallback(() => {
      setHoverPosition(null);
    }, []);

    return (
      <div
        className={cn(
          'space-y-2 min-w-0 transition-all duration-600 ease-in-out',
          votesRevealed
            ? 'translate-x-0 opacity-100'
            : 'translate-x-2 opacity-0'
        )}
      >
        <div
          className='relative h-3 w-full rounded-md'
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className='h-full w-full overflow-hidden rounded-md'>
            <div
              className={cn(
                'h-full rounded-md transition-all duration-600 ease-in-out',
                shouldHighlightConsensus ? 'bg-success' : 'bg-primary'
              )}
              style={progressBarStyles}
            />
          </div>
          {hoverPosition &&
          participantNames?.length &&
          typeof document !== 'undefined'
            ? createPortal(
                <div
                  className='bg-primary text-primary-foreground pointer-events-none fixed z-9999 max-w-64 rounded-md px-3 py-1.5 text-xs text-balance shadow-md'
                  style={{
                    left: hoverPosition.x,
                    top: hoverPosition.y - 12,
                    transform: 'translate(-50%, -100%)',
                  }}
                >
                  {participantNames.join(', ')}
                </div>,
                document.body
              )
            : null}
        </div>
        {votesRevealed && percentage > 0 ? (
          <div className='text-sm text-muted-foreground'>
            {percentage.toFixed(0)}%
          </div>
        ) : null}
      </div>
    );
  }
);

VoteProgressBar.displayName = 'VoteProgressBar';
