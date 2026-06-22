// Skeleton placeholder shown while opportunities load (bonus UX).
const SkeletonCard = () => (
  <div className="card flex flex-col gap-3 p-5">
    <div className="skeleton h-5 w-2/3" />
    <div className="skeleton h-4 w-full" />
    <div className="flex gap-2">
      <div className="skeleton h-5 w-16 rounded-full" />
      <div className="skeleton h-5 w-20 rounded-full" />
    </div>
    <div className="mt-2 flex justify-between border-t border-slate-100 pt-3">
      <div className="skeleton h-8 w-24" />
      <div className="skeleton h-8 w-20" />
    </div>
  </div>
);

export default SkeletonCard;
