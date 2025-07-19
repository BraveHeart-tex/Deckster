import RoomList from '@/src/components/room/RoomList';

const HomePage = async () => {
  return (
    <div className="bg-background h-full px-4 md:px-8">
      <div className="mx-auto h-full w-full max-w-screen-xl">
        <RoomList />
      </div>
    </div>
  );
};

export default HomePage;
