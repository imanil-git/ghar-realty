import { Link, useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Feedback from "../../components/ui/Feedback";
import AuthLayout from "../../features/auth/components/AuthLayout";
import { authSchemas } from "../../features/auth/schemas/authSchemas";
import { useAuthMutation } from "../../features/auth/hooks/useAuthMutation";
import Checkbox from "../../components/ui/Checkbox";
import { safeReturnTo } from "../../features/auth/utils/returnTo";

export default function SignupPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = safeReturnTo(params.get("next"));
  const mutation = useAuthMutation("signup");
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(authSchemas.signup),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
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
    <AuthLayout title="Make yourself at home.">
      <form noValidate onSubmit={handleSubmit(submit)} className="space-y-5">
        <Input
          label="Full name"
          type="text"
          autoComplete="name"
          required
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Phone number"
          type="tel"
          autoComplete="tel"
          required
          error={errors.phone?.message}
          {...register("phone")}
        />
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
        <Checkbox
          label={
            <>
              I accept the{" "}
              <Link to="/terms" className="underline" target="_blank">
                demo terms
              </Link>
            </>
          }
          required
          error={errors.terms?.message}
          {...register("terms")}
        />
        <Feedback error={mutation.error} />
        <Button type="submit" className="w-full" loading={mutation.isPending}>
          Create account
        </Button>
        <Link
          to="/login"
          className="inline-flex min-h-11 items-center text-sm underline"
        >
          Back to login
        </Link>
      </form>
    </AuthLayout>
  );
}
