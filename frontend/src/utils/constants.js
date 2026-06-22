// ============================================================
// App-wide constants. Single source of truth for enums that
// must match the backend Mongoose schema exactly.
// ============================================================

// localStorage keys
export const TOKEN_KEY = "crm_token";
export const USER_KEY = "crm_user";

// Opportunity.stage enum (backend: models/Opportunity.js)
export const STAGES = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Won",
  "Lost",
];

// Opportunity.priority enum
export const PRIORITIES = ["Low", "Medium", "High"];

// Tailwind classes per stage (used for badges)
export const STAGE_STYLES = {
  New: "bg-slate-100 text-slate-700",
  Contacted: "bg-blue-100 text-blue-700",
  Qualified: "bg-indigo-100 text-indigo-700",
  "Proposal Sent": "bg-amber-100 text-amber-700",
  Won: "bg-green-100 text-green-700",
  Lost: "bg-red-100 text-red-700",
};

export const PRIORITY_STYLES = {
  Low: "bg-slate-100 text-slate-600",
  Medium: "bg-amber-100 text-amber-700",
  High: "bg-red-100 text-red-700",
};

// Client-side pagination size (backend returns the full list)
export const PAGE_SIZE = 6;
