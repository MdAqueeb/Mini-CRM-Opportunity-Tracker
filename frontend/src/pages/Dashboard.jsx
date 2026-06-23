import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import OpportunityCard from "../components/OpportunityCard";
import SkeletonCard from "../components/SkeletonCard";
import { Input, Select } from "../components/Input";
import Button from "../components/Button";
import { opportunityAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { STAGES, PRIORITIES, PAGE_SIZE } from "../utils/constants";
import { getErrorMessage } from "../utils/helpers";

// ============================================================
// Dashboard — CRM pipeline view.
//
// The backend returns the full list (no server-side paging/filter),
// so search, stage/priority filters, sorting and pagination are all
// computed client-side with useMemo for snappy interaction.
// ============================================================

const SORTS = {
  newest: { label: "Newest first", fn: (a, b) => new Date(b.createdAt) - new Date(a.createdAt) },
  oldest: { label: "Oldest first", fn: (a, b) => new Date(a.createdAt) - new Date(b.createdAt) },
  valueHigh: { label: "Value: high → low", fn: (a, b) => (b.estimatedValue || 0) - (a.estimatedValue || 0) },
  valueLow: { label: "Value: low → high", fn: (a, b) => (a.estimatedValue || 0) - (b.estimatedValue || 0) },
};

const Dashboard = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter / view state
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("");
  const [priority, setPriority] = useState("");
  const [sort, setSort] = useState("newest");
  const [onlyMine, setOnlyMine] = useState(false);
  const [page, setPage] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await opportunityAPI.list();
      setItems(data.data || []);
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not load opportunities"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Reset to first page whenever filters change.
  useEffect(() => {
    setPage(1);
  }, [search, stage, priority, sort, onlyMine]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items
      .filter((o) => (stage ? o.stage === stage : true))
      .filter((o) => (priority ? o.priority === priority : true))
      .filter((o) => (onlyMine ? o.owner?._id === user?.id : true))
      .filter((o) =>
        q
          ? o.customerName?.toLowerCase().includes(q) ||
            o.requirement?.toLowerCase().includes(q) ||
            o.owner?.name?.toLowerCase().includes(q)
          : true
      )
      .sort(SORTS[sort].fn);
  }, [items, search, stage, priority, onlyMine, sort, user?.id]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="h1 text-secondary">Opportunities</h1>
          <p className="mt-1 text-sm text-slate-500">
            {loading
              ? "Loading your pipeline…"
              : `${filtered.length} opportunit${filtered.length === 1 ? "y" : "ies"} in view`}
          </p>
        </div>
        <Link to="/create-opportunity">
          <Button>+ New opportunity</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="card mt-6 grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Input
            placeholder="Search customer, requirement, owner…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={search ? "pr-9" : ""}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
        <Select value={stage} onChange={(e) => setStage(e.target.value)}>
          <option value="">All stages</option>
          {STAGES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="">All priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </Select>
        <Select value={sort} onChange={(e) => setSort(e.target.value)}>
          {Object.entries(SORTS).map(([key, { label }]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
          checked={onlyMine}
          onChange={(e) => setOnlyMine(e.target.checked)}
        />
        Show only my opportunities
      </label>

      {/* Content */}
      <div className="mt-6">
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState hasFilters={Boolean(search || stage || priority || onlyMine)} />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((o) => (
                <OpportunityCard
                  key={o._id}
                  opportunity={o}
                  isOwner={o.owner?._id === user?.id}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ hasFilters }) => (
  <div className="card flex flex-col items-center justify-center gap-3 py-16 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-2xl">
      📭
    </div>
    <h3 className="text-lg font-semibold text-secondary">
      {hasFilters ? "No matches found" : "No opportunities yet"}
    </h3>
    <p className="max-w-sm text-sm text-slate-500">
      {hasFilters
        ? "Try adjusting your search or filters."
        : "Create your first opportunity to start building your pipeline."}
    </p>
    {!hasFilters && (
      <Link to="/create-opportunity">
        <Button className="mt-2">+ New opportunity</Button>
      </Link>
    )}
  </div>
);

const Pagination = ({ page, totalPages, onChange }) => (
  <div className="mt-8 flex items-center justify-center gap-2">
    <Button
      variant="secondary"
      size="sm"
      disabled={page === 1}
      onClick={() => onChange(page - 1)}
    >
      Previous
    </Button>
    {Array.from({ length: totalPages }).map((_, i) => (
      <button
        key={i}
        onClick={() => onChange(i + 1)}
        className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
          page === i + 1
            ? "bg-primary text-white"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        {i + 1}
      </button>
    ))}
    <Button
      variant="secondary"
      size="sm"
      disabled={page === totalPages}
      onClick={() => onChange(page + 1)}
    >
      Next
    </Button>
  </div>
);

export default Dashboard;
