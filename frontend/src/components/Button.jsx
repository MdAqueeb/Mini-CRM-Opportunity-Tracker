// ============================================================
// Button — variants: primary | secondary | danger | ghost
// Sizes: sm | md. Supports a `loading` state that disables the
// button and shows a spinner. Forwards remaining props (type,
// onClick, etc).
// ============================================================

const VARIANTS = {
  primary:
    "bg-primary text-white hover:bg-blue-700 disabled:bg-blue-300 shadow-sm",
  secondary:
    "bg-white text-secondary border border-slate-300 hover:bg-slate-50 disabled:opacity-60",
  danger:
    "bg-danger text-white hover:bg-red-600 disabled:bg-red-300 shadow-sm",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
};

const SIZES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  ...rest
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium
        transition-colors focus-ring disabled:cursor-not-allowed
        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      )}
      {children}
    </button>
  );
};

export default Button;
