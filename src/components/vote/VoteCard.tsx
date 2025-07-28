'use client';
import { Button } from '@/src/components/ui/button';

interface VoteCardProps {
  option: string;
  isSelected: boolean;
  onClick: (option: string) => void;
}

const VoteCard = ({ option, isSelected, onClick }: VoteCardProps) => {
  const handleClick = () => {
    if (!isSelected) {
      onClick(option);
    }
  };

  const handleKeydown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <Button
      aria-pressed={isSelected}
      aria-label={`Vote for ${option} story points`}
      title={`Vote for ${option}`}
      type='button'
      className='flex h-[6.25rem] w-[4.375rem] items-center justify-center text-3xl font-medium'
      variant={isSelected ? 'default' : 'outline'}
      onClick={handleClick}
      onKeyDown={handleKeydown}
    >
      {option}
    </Button>
  );
};

export default VoteCard;
