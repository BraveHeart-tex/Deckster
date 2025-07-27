import { Skeleton } from '@/src/components/ui/skeleton';
import { TableCell, TableRow } from '@/src/components/ui/table';

const UserRowSkeleton = () => {
  return (
    <TableRow className='h-[4.0625rem]'>
      <TableCell>
        <div className='flex items-center gap-4'>
          {/* Avatar */}
          <Skeleton className='size-[2rem] rounded-full' />
          {/* Name and other labels */}
          <div className='flex items-center gap-2'>
            <Skeleton className='h-4 w-32' />
            <Skeleton className='h-4 w-14 rounded-md' />
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className='flex items-center justify-center'>
          <Skeleton className='h-8 w-8 rounded-md' />
        </div>
      </TableCell>
      <TableCell>
        <div className='flex items-center justify-center'>
          <Skeleton className='h-6 w-6 rounded' />
        </div>
      </TableCell>
    </TableRow>
  );
};
export default UserRowSkeleton;
