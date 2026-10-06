import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Feedback from "../../components/ui/Feedback";
import AuthLayout from "../../features/auth/components/AuthLayout";
import { authSchemas } from "../../features/auth/schemas/authSchemas";
import { useAuthMutation } from "../../features/auth/hooks/useAuthMutation";
import { isMockMode } from "../../services/config";

export default function ForgotPasswordPage() {
  const mutation = useAuthMutation("forgotPassword");
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(authSchemas.forgot),
    defaultValues: { email: "" },
  });

  async function submit(data) {
    try {
      await mutation.mutateAsync(data);
    } catch (error) {
      for (const [field, message] of Object.entries(error.fields || {})) {
        setError(field, { message });
      }
    }
  }

  return (
    <AuthLayout title="Forgot your password?">
      {mutation.isSuccess ? (
        <div className="space-y-5">
          <Feedback
            message={
              mutation.data?.message ||
              "If an account exists, a reset email has been sent."
            }
          />
          {isMockMode && mutation.data?.token && (
            <Link
              to={`/reset-password?token=${mutation.data.token}`}
              className="block break-all text-sm underline"
            >
              Open demo reset link →
            </Link>
          )}
          <Link
            to="/login"
            className="inline-flex min-h-12 items-center underline"
          >
            Back to login
          </Link>
        </div>
      ) : (
        <form noValidate onSubmit={handleSubmit(submit)} className="space-y-5">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            required
            error={errors.email?.message}
            {...register("email")}
          />
          <Feedback error={mutation.error} />
          <Button type="submit" className="w-full" loading={mutation.isPending}>
            Send reset link
          </Button>
          <Link
            to="/login"
            className="inline-flex min-h-11 items-center text-sm underline"
          >
            Back to login
          </Link>
        </form>
      )}
    </AuthLayout>
  );
}
