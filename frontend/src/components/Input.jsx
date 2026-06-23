import { forwardRef, useState } from "react";

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
  ({ label, error, required, hint, prefix, className = "", ...rest }, ref) => {
    const border = error ? "border-danger" : "border-slate-300";
    return (
      <Field label={label} error={error} required={required} hint={hint}>
        {prefix ? (
          <div className="flex">
            <span
              className={`inline-flex items-center rounded-l-lg border border-r-0 bg-slate-50 px-3 text-sm text-slate-500 ${border}`}
            >
              {prefix}
            </span>
            <input
              ref={ref}
              className={`${baseField} rounded-l-none ${border} ${className}`}
              {...rest}
            />
          </div>
        ) : (
          <input
            ref={ref}
            className={`${baseField} ${border} ${className}`}
            {...rest}
          />
        )}
      </Field>
    );
  }
);
Input.displayName = "Input";

// Password field with a show/hide (eye) toggle. Reuses Field so the
// label/error styling matches the other inputs.
export const PasswordInput = forwardRef(
  ({ label, error, required, hint, className = "", ...rest }, ref) => {
    const [show, setShow] = useState(false);
    return (
      <Field label={label} error={error} required={required} hint={hint}>
        <div className="relative">
          <input
            ref={ref}
            type={show ? "text" : "password"}
            className={`${baseField} pr-10 ${
              error ? "border-danger" : "border-slate-300"
            } ${className}`}
            {...rest}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            tabIndex={-1}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
          >
            {show ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c6.5 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                <path d="M6.61 6.61A13.5 13.5 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.39-1.61" />
                <line x1="2" y1="2" x2="22" y2="22" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
      </Field>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

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
