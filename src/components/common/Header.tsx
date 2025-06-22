'use client';
import UserMenu from '@/components/common/UserMenu';
import ModeToggle from '@/components/ModeToggle';
import { Button } from '@/components/ui/button';
import { useRoomStore } from '@/store/room';
import { Share2Icon } from 'lucide-react';
import Link from 'next/link';

const Header = () => {
  const roomCode = useRoomStore((state) => state.roomCode);
  return (
    <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto grid h-14 max-w-screen-xl grid-cols-3 items-center px-4">
        {/* Left - Logo */}
        <div className="flex justify-start">
          <Link className="flex items-center space-x-2" href="/">
            <span className="inline-block font-bold">Simple Scrum Poker</span>
          </Link>
        </div>

        {/* Center - Room Code */}
        <div className="flex justify-center">
          {roomCode && (
            <nav className="flex items-center space-x-2 text-sm font-medium">
              <Button variant="ghost">
                <Share2Icon />
                Room {roomCode}
              </Button>
            </nav>
          )}
        </div>

        {/* Right - Mode Toggle */}
        <div className="flex items-center justify-end space-x-2">
          <UserMenu />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
