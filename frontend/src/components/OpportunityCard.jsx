import { Link } from "react-router-dom";
import {
  STAGE_STYLES,
  PRIORITY_STYLES,
} from "../utils/constants";
import { formatCurrency, formatDate } from "../utils/helpers";

// ============================================================
// OpportunityCard — CRM-style summary card for the dashboard.
// `isOwner` highlights records the current user created (left
// accent bar + "You" badge).
// ============================================================

const Badge = ({ className, children }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
  >
    {children}
  </span>
);

const OpportunityCard = ({ opportunity, isOwner }) => {
  const {
    _id,
    customerName,
    requirement,
    estimatedValue,
    stage,
    priority,
    owner,
    nextFollowUpDate,
    createdAt,
  } = opportunity;

  return (
    <Link
      to={`/opportunity/${_id}`}
      className={`card animate-fade-in flex flex-col gap-3 p-5 transition-shadow hover:shadow-md ${
        isOwner ? "border-l-4 border-l-primary" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-secondary">
            {customerName}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-sm text-slate-500">
            {requirement}
          </p>
        </div>
        {isOwner && (
          <Badge className="shrink-0 bg-primary/10 text-primary">You</Badge>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge className={STAGE_STYLES[stage] || "bg-slate-100 text-slate-700"}>
          {stage}
        </Badge>
        <Badge className={PRIORITY_STYLES[priority] || "bg-slate-100 text-slate-700"}>
          {priority} priority
        </Badge>
      </div>

      <div className="mt-1 flex items-center justify-between border-t border-slate-100 pt-3">
        <div>
          <p className="text-xs text-slate-400">Estimated value</p>
          <p className="text-sm font-semibold text-secondary">
            {formatCurrency(estimatedValue)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Follow-up</p>
          <p className="text-sm text-slate-600">{formatDate(nextFollowUpDate)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>
          Owner: <span className="text-slate-600">{owner?.name || "Unknown"}</span>
        </span>
        <span>Created {formatDate(createdAt)}</span>
      </div>
    </Link>
  );
};

export default OpportunityCard;
