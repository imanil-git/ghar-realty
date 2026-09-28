import { NavLink, useNavigate } from "react-router";
import { useAuthMutation } from "../../features/auth/hooks/useAuthMutation";
import { accountLinks } from "./navigation";

export default function AccountNavigation() {
  const logout = useAuthMutation("logout");
  const navigate = useNavigate();
  return (
    <nav
      aria-label="Account navigation"
      className="flex flex-wrap gap-2 lg:sticky lg:top-32 lg:flex-col"
    >
      {accountLinks.map(({ to, label }) => (
        <NavLink
          key={to}
          end={to.endsWith("/properties") ? false : true}
          to={to}
          className={({ isActive }) =>
            `inline-flex min-h-12 items-center rounded-sm px-4 py-3 text-sm ${isActive ? "bg-action text-on-action" : "bg-surface hover:underline"}`
          }
        >
          {label}
        </NavLink>
      ))}
      <button
        type="button"
        disabled={logout.isPending}
        onClick={async () => {
          try {
            await logout.mutateAsync();
            navigate("/", { replace: true });
          } catch {
            /* Display the failure below. */
          }
        }}
        className="min-h-12 px-4 py-3 text-left text-sm text-muted disabled:opacity-50"
      >
        {logout.isPending ? "Logging out…" : "Log out"}
      </button>
      {logout.isError && (
        <p role="alert" className="text-xs text-error">
          {logout.error.message}
        </p>
      )}
    </nav>
  );
}
