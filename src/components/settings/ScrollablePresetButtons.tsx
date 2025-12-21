import { Button } from '@/src/components/ui/button';
import { Label } from '@/src/components/ui/label';
import { ScrollArea, ScrollBar } from '@/src/components/ui/scroll-area';
import { VOTE_OPTION_PRESETS } from '@/src/constants/vote.constants';

interface ScrollablePresetButtonsProps {
  onDeckSelect: (deck: string[]) => void;
}

export const ScrollablePresetButtons = ({
  onDeckSelect,
}: ScrollablePresetButtonsProps) => {
  const handlePresetClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    deck: string[]
  ) => {
    event.currentTarget.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
    onDeckSelect(deck);
  };

  return (
    <div className='space-y-1'>
      <Label>Presets</Label>
      <ScrollArea>
        <div className='flex gap-2 gap-x-2 py-2 whitespace-nowrap'>
          {VOTE_OPTION_PRESETS.map((preset) => (
            <Button
              key={preset.label}
              variant='outline'
              className='shrink-0'
              aria-label={`Select preset deck named ${preset.label}`}
              onClick={(event) => handlePresetClick(event, preset.deck)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
    </div>
  );
};
