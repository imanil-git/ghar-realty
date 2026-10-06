import { Link, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Feedback from "../../components/ui/Feedback";
import AuthLayout from "../../features/auth/components/AuthLayout";
import { authSchemas } from "../../features/auth/schemas/authSchemas";
import { useAuthMutation } from "../../features/auth/hooks/useAuthMutation";
import { isMockMode } from "../../services/config";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const mutation = useAuthMutation("resetPassword");
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(authSchemas.reset),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function submit(data) {
    try {
      await mutation.mutateAsync({ ...data, token: params.get("token") });
    } catch (error) {
      for (const [field, message] of Object.entries(error.fields || {})) {
        setError(field, { message });
      }
    }
  }

  return (
    <AuthLayout title="A fresh start.">
      {mutation.isSuccess ? (
        <div className="space-y-5">
          <Feedback message={"Password updated. You can log in now."} />
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
            label="New password"
            type="password"
            autoComplete="new-password"
            required
            error={errors.password?.message}
            hint="At least 8 characters."
            {...register("password")}
          />
          <Input
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            required
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          <Feedback error={mutation.error} />
          <Button type="submit" className="w-full" loading={mutation.isPending}>
            Update password
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
