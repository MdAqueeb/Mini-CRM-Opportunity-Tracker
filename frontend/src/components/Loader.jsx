// Spinner with an optional label. Used for full-page and inline loads.
const Loader = ({ label, className = "" }) => {
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <span
        className="h-8 w-8 animate-spin rounded-full border-[3px] border-slate-200 border-t-primary"
        role="status"
        aria-label="Loading"
      />
      {label && <p className="text-sm text-slate-500">{label}</p>}
    </div>
  );
};

export default Loader;
