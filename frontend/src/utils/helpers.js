// ============================================================
// Small pure helpers reused across the UI.
// ============================================================

// Format a number as currency. Backend stores estimatedValue as a
// plain Number; we render it in a readable form.
export const formatCurrency = (value) => {
  const num = Number(value) || 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
};

// Human-friendly date. Returns "—" for empty values.
export const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Convert an ISO date to the yyyy-mm-dd value an <input type="date"> needs.
export const toDateInput = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
};

// Extract a readable error message from an Axios error.
export const getErrorMessage = (error, fallback = "Something went wrong") => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
};

// Initials for an avatar bubble.
export const getInitials = (name = "") => {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
};
