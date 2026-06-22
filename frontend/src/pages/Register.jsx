import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Input } from "../components/Input";
import Button from "../components/Button";
import { authAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/helpers";
import { AuthShell } from "./Login";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    try {
      // Backend register returns the user but NOT a token, so we log in
      // immediately afterwards for a smooth one-step signup experience.
      await authAPI.register(values);
      const { data } = await authAPI.login({
        email: values.email,
        password: values.password,
      });
      const { token, user } = data.data;
      login(token, user);
      toast.success("Account created — welcome!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, "Registration failed"));
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start tracking opportunities in minutes"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Full name"
          placeholder="John Doe"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />
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
          placeholder="At least 6 characters"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <Button type="submit" loading={isSubmitting} className="mt-2 w-full">
          Create account
        </Button>
      </form>
    </AuthShell>
  );
};

export default Register;
