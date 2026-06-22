import { forwardRef } from "react";

// ============================================================
// Input / Select / Textarea wrappers with label + inline error.
// forwardRef so they plug straight into react-hook-form's
// register(). Error styling is consistent across all three.
// ============================================================

const baseField =
  "w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-secondary " +
  "placeholder:text-slate-400 transition-colors focus-ring disabled:bg-slate-100 disabled:text-slate-500";

const Field = ({ label, error, required, children, hint }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-sm font-medium text-secondary">
        {label}
        {required && <span className="ml-0.5 text-danger">*</span>}
      </label>
    )}
    {children}
    {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
    {error && <p className="text-xs font-medium text-danger">{error}</p>}
  </div>
);

export const Input = forwardRef(
  ({ label, error, required, hint, className = "", ...rest }, ref) => (
    <Field label={label} error={error} required={required} hint={hint}>
      <input
        ref={ref}
        className={`${baseField} ${
          error ? "border-danger" : "border-slate-300"
        } ${className}`}
        {...rest}
      />
    </Field>
  )
);
Input.displayName = "Input";

export const Select = forwardRef(
  ({ label, error, required, hint, children, className = "", ...rest }, ref) => (
    <Field label={label} error={error} required={required} hint={hint}>
      <select
        ref={ref}
        className={`${baseField} ${
          error ? "border-danger" : "border-slate-300"
        } ${className}`}
        {...rest}
      >
        {children}
      </select>
    </Field>
  )
);
Select.displayName = "Select";

export const Textarea = forwardRef(
  ({ label, error, required, hint, className = "", ...rest }, ref) => (
    <Field label={label} error={error} required={required} hint={hint}>
      <textarea
        ref={ref}
        className={`${baseField} resize-y ${
          error ? "border-danger" : "border-slate-300"
        } ${className}`}
        {...rest}
      />
    </Field>
  )
);
Textarea.displayName = "Textarea";

export default Input;
