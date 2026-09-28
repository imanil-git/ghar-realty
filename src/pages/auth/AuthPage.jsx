import { Link, useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Container from "../../components/layout/Container";
import Input from "../../components/ui/Input";
import Checkbox from "../../components/ui/Checkbox";
import Button from "../../components/ui/Button";
import Feedback from "../../components/ui/Feedback";
import { authSchemas } from "../../features/auth/schemas/authSchemas";
import { useAuthMutation } from "../../features/auth/hooks/useAuthMutation";
import { safeReturnTo } from "../../features/auth/utils/returnTo";
import { isMockMode } from "../../services/config";

const actions = {
  login: "login",
  signup: "signup",
  forgot: "forgotPassword",
  reset: "resetPassword",
};
const titles = {
  login: "Welcome back.",
  signup: "Make yourself at home.",
  forgot: "Forgot your password?",
  reset: "A fresh start.",
};
export default function AuthPage({ mode = "login" }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = safeReturnTo(params.get("next"));
  const mutation = useAuthMutation(actions[mode]);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(authSchemas[mode]),
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
      await mutation.mutateAsync({ ...data, token: params.get("token") });
      if (mode === "login" || mode === "signup")
        navigate(next, { replace: true });
    } catch (error) {
      for (const [field, message] of Object.entries(error.fields || {}))
        setError(field, { message });
    }
  }
  return (
    <Container className="py-12 sm:py-20">
      <title>{titles[mode]} | Ghar Realty</title>
      <div className="mx-auto grid max-w-4xl gap-12 md:grid-cols-2">
        <div>
          <p className="mb-5 text-xs uppercase tracking-widest text-muted">
            Your next chapter
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            {titles[mode]}
          </h1>
          <p className="mt-5 text-sm leading-7 text-muted">
            Save the places you love. List a space of your own. Keep everything
            together.
          </p>
          <img
            src="/images/interior.jpg"
            alt="A calm corner of a contemporary home"
            className="mt-8 hidden aspect-square w-full object-cover md:block"
          />
        </div>
        <div>
          {isMockMode && (
            <div className="mb-6 border border-border bg-surface p-4 text-xs leading-6">
              <strong>Local demo — use sample details.</strong>
              <p>No emails or real listings are sent.</p>
              {mode === "login" && (
                <p>
                  Try aarav@example.com
                  <br />
                  Password: GharDemo123!
                </p>
              )}
            </div>
          )}
          {mutation.isSuccess && ["forgot", "reset"].includes(mode) ? (
            <div className="space-y-5">
              <Feedback
                message={
                  mode === "reset"
                    ? "Password updated. You can log in now."
                    : mutation.data?.message ||
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
            <form
              noValidate
              onSubmit={handleSubmit(submit)}
              className="space-y-5"
            >
              {mode === "signup" && (
                <>
                  <Input
                    label="Full name"
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
                </>
              )}
              {mode !== "reset" && (
                <Input
                  label="Email"
                  type="email"
                  autoComplete="email"
                  required
                  error={errors.email?.message}
                  {...register("email")}
                />
              )}
              {mode !== "forgot" && (
                <Input
                  label={mode === "reset" ? "New password" : "Password"}
                  type="password"
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  required
                  error={errors.password?.message}
                  hint={mode !== "login" ? "At least 8 characters." : undefined}
                  {...register("password")}
                />
              )}
              {["signup", "reset"].includes(mode) && (
                <Input
                  label="Confirm password"
                  type="password"
                  autoComplete="new-password"
                  required
                  error={errors.confirmPassword?.message}
                  {...register("confirmPassword")}
                />
              )}
              {mode === "signup" && (
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
              )}
              <Feedback error={mutation.error} />
              <Button
                type="submit"
                className="w-full"
                loading={mutation.isPending}
              >
                {mode === "login"
                  ? "Login"
                  : mode === "signup"
                    ? "Create account"
                    : mode === "forgot"
                      ? "Send reset link"
                      : "Update password"}
              </Button>
              {mode === "login" && (
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
              )}
              {mode !== "login" && (
                <Link
                  to="/login"
                  className="inline-flex min-h-11 items-center text-sm underline"
                >
                  Back to login
                </Link>
              )}
            </form>
          )}
        </div>
      </div>
    </Container>
  );
}
