import { Link, useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Feedback from "../../components/ui/Feedback";
import AuthLayout from "../../features/auth/components/AuthLayout";
import { authSchemas } from "../../features/auth/schemas/authSchemas";
import { useAuthMutation } from "../../features/auth/hooks/useAuthMutation";
import { safeReturnTo } from "../../features/auth/utils/returnTo";

export default function LoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = safeReturnTo(params.get("next"));
  const mutation = useAuthMutation("login");
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(authSchemas.login),
    defaultValues: { email: "", password: "" },
  });

  async function submit(data) {
    try {
      await mutation.mutateAsync(data);
      navigate(next, { replace: true });
    } catch (error) {
      for (const [field, message] of Object.entries(error.fields || {})) {
        setError(field, { message });
      }
    }
  }

  return (
    <AuthLayout title="Welcome back." showDemoCredentials>
      <form noValidate onSubmit={handleSubmit(submit)} className="space-y-5">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          error={errors.password?.message}
          {...register("password")}
        />
        <Feedback error={mutation.error} />
        <Button type="submit" className="w-full" loading={mutation.isPending}>
          Login
        </Button>
        <div className="flex flex-wrap justify-between gap-3 text-sm">
          <Link to="/forgot-password" className="py-2 underline">
            Forgot password?
          </Link>
          <Link
            to={`/signup?next=${encodeURIComponent(next)}`}
            className="py-2 underline"
          >
            Create account
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
