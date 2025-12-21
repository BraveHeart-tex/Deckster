'use client';
import { cva, type VariantProps } from 'class-variance-authority';
import { Button } from '@/src/components/ui/button';
import { cn } from '@/src/lib/utils';

const voteCardVariants = cva(
  'flex items-center justify-center text-3xl font-medium',
  {
    variants: {
      size: {
        default: 'h-25 w-17.5',
        small: 'size-11 text-xl',
      },
    },
  }
);

interface VoteCardProps extends VariantProps<typeof voteCardVariants> {
  option: string;
  isSelected: boolean;
  onClick: (option: string) => void;
  size?: 'default' | 'small';
}

export const VoteCard = ({
  option,
  isSelected,
  onClick,
  size = 'default',
  ...props
}: VoteCardProps) => {
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
      className={cn(voteCardVariants({ size }))}
      variant={isSelected ? 'default' : 'outline'}
      onClick={handleClick}
      onKeyDown={handleKeydown}
      {...props}
    >
      {option}
    </Button>
  );
};
