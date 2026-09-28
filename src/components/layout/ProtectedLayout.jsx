import { Navigate, Outlet, useLocation } from "react-router";
import { useSession } from "../../features/auth/hooks/useSession";
import Container from "./Container";
import Button from "../ui/Button";

export default function ProtectedLayout() {
  const session = useSession();
  const location = useLocation();

  if (session.isPending) {
    return (
      <Container className="py-16">
        <p role="status">Checking your session…</p>
      </Container>
    );
  }

  if (session.isError) {
    return (
      <Container className="py-16">
        <p role="alert" className="mb-4 text-error">
          We couldn’t check your session. Please try again.
        </p>
        <Button onClick={() => session.refetch()}>Try again</Button>
      </Container>
    );
  }

  if (!session.data) {
    const next = location.pathname + location.search + location.hash;
    return <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />;
  }

  return <Outlet />;
}
