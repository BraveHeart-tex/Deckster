const RoomCardSkeleton = () => (
  <div className="animate-pulse rounded-xl border p-4 shadow-sm">
    <div className="bg-muted mb-2 h-6 w-1/2 rounded"></div>
    <div className="bg-muted mb-4 h-4 w-1/3 rounded"></div>
    <div className="bg-muted mb-1 h-3 w-full rounded"></div>
    <div className="bg-muted h-3 w-5/6 rounded"></div>
  </div>
);

export default RoomCardSkeleton;
