import Link from 'next/link';

import UserMenu from '@/src/components/common/UserMenu';
import ModeToggle from '@/src/components/ModeToggle';
import ShareRoomDialog from '@/src/components/room/ShareRoomDialog';

const Header = () => {
  return (
    <header className="bg-background fixed top-0 right-0 left-0 z-50 flex h-14 w-full items-center border-b px-4 md:px-6">
      <div className="container mx-auto grid max-w-screen-xl grid-cols-3 items-center">
        <div className="flex justify-start">
          <Link className="flex items-center space-x-2" href="/">
            <span className="inline-block font-bold">Simple Scrum Poker</span>
          </Link>
        </div>

        <div className="flex justify-center">
          <div className="flex items-center space-x-2 text-sm font-medium">
            <ShareRoomDialog />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2">
          <UserMenu />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
