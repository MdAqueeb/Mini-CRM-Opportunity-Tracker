import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Input } from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import { getErrorMessage } from "../utils/helpers";

const schema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    try {
      const { data } = await authAPI.login(values);
      const { token, user } = data.data;
      login(token, user);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, "Login failed"));
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your CRM workspace"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <Button type="submit" loading={isSubmitting} className="mt-2 w-full">
          Sign in
        </Button>
      </form>
    </AuthShell>
  );
};

// Shared layout for the auth pages — keeps Login/Register consistent.
export const AuthShell = ({ title, subtitle, children, footer }) => (
  <div className="flex min-h-screen items-center justify-center bg-background p-4">
    <div className="card animate-fade-in w-full max-w-md p-8">
      <div className="mb-6 flex flex-col items-center text-center">
        <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white">
          CR
        </span>
        <h1 className="text-2xl font-bold text-secondary">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      {children}
      {footer && <p className="mt-6 text-center text-sm text-slate-500">{footer}</p>}
    </div>
  </div>
);

export default Login;
