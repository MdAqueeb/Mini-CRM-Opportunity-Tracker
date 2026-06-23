import { z } from "zod";

// --------------------
// Generic validation middleware
// Validates req.body against a Zod schema and returns a 400 with
// the first error message on failure. Keeps controllers clean.
// --------------------
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: result.error.issues[0].message
    });
  }

  req.body = result.data;
  next();
};

// --------------------
// Auth schemas
// --------------------
// Email is case-sensitive: only whitespace is trimmed, casing is kept
// as typed, and a strict email format is enforced. Login must use the
// exact same casing that was used at registration.
export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export const loginSchema = z.object({
  email: z.string().trim().email("Valid email is required"),
  password: z.string().min(1, "Password is required")
});
