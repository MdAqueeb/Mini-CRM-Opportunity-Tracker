import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Select, Textarea } from "./Input";
import Button from "./Button";
import { STAGES, PRIORITIES } from "../utils/constants";
import { toDateInput } from "../utils/helpers";

// ============================================================
// OpportunityForm — reused for both Create and Edit.
//
// Backend note: the update controller (PUT /opportunities/:id)
// only persists stage, priority, nextFollowUpDate, estimatedValue
// and notes. So in `mode="edit"` the identity fields (customer,
// requirement, contact) are shown read-only — editing them would
// silently do nothing. This keeps the UI honest about the API.
// ============================================================

const schema = z.object({
  customerName: z.string().trim().min(1, "Customer name is required"),
  requirement: z.string().trim().min(1, "Requirement is required"),
  contactName: z.string().trim().min(1, "Contact name is required"),
  contactEmail: z
    .string()
    .trim()
    .min(1, "Contact email is required")
    .email("Enter a valid email"),
  contactPhone: z
    .string()
    .trim()
    .min(1, "Contact phone is required")
    .regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
  estimatedValue: z.coerce
    .number({ invalid_type_error: "Must be a number" })
    .positive("Estimated value is required"),
  stage: z.enum(STAGES),
  priority: z.enum(PRIORITIES),
  nextFollowUpDate: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

const emptyDefaults = {
  customerName: "",
  requirement: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  estimatedValue: 0,
  stage: "New",
  priority: "Medium",
  nextFollowUpDate: "",
  notes: "",
};

const OpportunityForm = ({
  mode = "create",
  initialValues,
  onSubmit,
  submitting = false,
  onCancel,
}) => {
  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialValues
      ? {
          ...emptyDefaults,
          ...initialValues,
          estimatedValue: initialValues.estimatedValue ?? 0,
          nextFollowUpDate: toDateInput(initialValues.nextFollowUpDate),
        }
      : emptyDefaults,
  });

  // Strip empty strings so we don't overwrite backend defaults with "".
  const submit = (values) => {
    const payload = { ...values };
    if (isEdit) {
      // Only send fields the backend actually updates.
      const { stage, priority, nextFollowUpDate, estimatedValue, notes } = values;
      return onSubmit({
        stage,
        priority,
        estimatedValue,
        notes: notes || "",
        nextFollowUpDate: nextFollowUpDate || null,
      });
    }
    Object.keys(payload).forEach((k) => {
      if (payload[k] === "") delete payload[k];
    });
    return onSubmit(payload);
  };

  // Phone: digits only, max 10, shown with a fixed +91 prefix.
  const phone = register("contactPhone");

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-5">
      {isEdit && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
          Customer, requirement and contact details are fixed after creation —
          the API only updates stage, priority, value, follow-up and notes.
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          label="Customer name"
          required
          placeholder="ABC Corp"
          disabled={isEdit}
          error={errors.customerName?.message}
          {...register("customerName")}
        />
        <Input
          label="Estimated value (₹)"
          type="number"
          required
          min="0"
          placeholder="50000"
          error={errors.estimatedValue?.message}
          {...register("estimatedValue")}
        />
      </div>

      <Textarea
        label="Requirement"
        required
        rows={3}
        placeholder="What does the customer need?"
        disabled={isEdit}
        error={errors.requirement?.message}
        {...register("requirement")}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Input
          label="Contact name"
          required
          placeholder="John Doe"
          disabled={isEdit}
          error={errors.contactName?.message}
          {...register("contactName")}
        />
        <Input
          label="Contact email"
          required
          placeholder="john@abc.com"
          disabled={isEdit}
          error={errors.contactEmail?.message}
          {...register("contactEmail")}
        />
        <Input
          label="Contact phone"
          prefix="+91"
          placeholder="10-digit number"
          inputMode="numeric"
          required
          maxLength={10}
          disabled={isEdit}
          error={errors.contactPhone?.message}
          name={phone.name}
          ref={phone.ref}
          onBlur={phone.onBlur}
          onChange={(e) => {
            e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
            phone.onChange(e);
          }}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Select label="Stage" error={errors.stage?.message} {...register("stage")}>
          {STAGES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        <Select
          label="Priority"
          error={errors.priority?.message}
          {...register("priority")}
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </Select>
        <Input
          label="Next follow-up"
          type="date"
          error={errors.nextFollowUpDate?.message}
          {...register("nextFollowUpDate")}
        />
      </div>

      <Textarea
        label="Notes"
        rows={3}
        placeholder="Internal notes…"
        error={errors.notes?.message}
        {...register("notes")}
      />

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={submitting}>
          {isEdit ? "Save changes" : "Create opportunity"}
        </Button>
      </div>
    </form>
  );
};

export default OpportunityForm;
