import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchemas } from "../../features/auth/schemas/authSchemas";
import { useAuthMutation } from "../../features/auth/hooks/useAuthMutation";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Feedback from "../../components/ui/Feedback";

export default function ChangePasswordPage() {
  const mutation = useAuthMutation("changePassword");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(authSchemas.change) });
  return (
    <section>
      <title>Change password | Ghar Realty</title>
      <h1 className="text-3xl font-semibold">Change password</h1>
      <form
        noValidate
        className="mt-8 max-w-lg space-y-6"
        onSubmit={handleSubmit(async (data) => {
          try {
            await mutation.mutateAsync(data);
            reset();
          } catch {
            /* Keep entered values on failure. */
          }
        })}
      >
        <Input
          label="Current password"
          type="password"
          autoComplete="current-password"
          required
          error={errors.currentPassword?.message}
          {...register("currentPassword")}
        />
        <Input
          label="New password"
          type="password"
          autoComplete="new-password"
          required
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          required
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <Feedback
          error={mutation.error}
          message={mutation.isSuccess ? "Password updated." : ""}
        />
        <Button type="submit" loading={mutation.isPending}>
          Update password
        </Button>
      </form>
    </section>
  );
}
