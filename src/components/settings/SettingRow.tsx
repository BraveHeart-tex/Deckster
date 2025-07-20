import { Button, ButtonVariants } from '@/src/components/ui/button';
import { cn } from '@/src/lib/utils';

interface DangerZoneRowProps {
  title: string;
  description: string;
  isLast?: boolean;
  buttonText: string;
  buttonVariant?: ButtonVariants;
  onClick: () => void;
}

const SettingRow = ({
  title,
  description,
  isLast,
  buttonText,
  buttonVariant = 'outline',
  onClick,
}: DangerZoneRowProps) => {
  return (
    <div className="grid w-full gap-2 not-last:border-b md:flex md:flex-row md:items-center md:justify-between md:gap-4 md:p-3">
      <div className="grid p-3 md:p-0">
        <span className="text-sm font-semibold tracking-tight">{title}</span>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      <Button
        variant={buttonVariant}
        className={cn(
          'w-full rounded-none border-x-0 border-b-0 md:w-auto md:rounded-md md:border md:border-b',
          isLast && 'rounded-b-md border-b-0',

          buttonVariant === 'destructive' ||
            (buttonVariant === 'destructiveOutline' &&
              'border-destructive/50 md:border-destructive'),
          buttonVariant === 'destructive' && 'md:border-0'
        )}
        onClick={onClick}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default SettingRow;
