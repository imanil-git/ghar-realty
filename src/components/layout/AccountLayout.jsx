import { Outlet } from "react-router";
import Container from "./Container";
import AccountNavigation from "./AccountNavigation";

export default function AccountLayout() {
  return (
    <Container className="grid gap-8 py-10 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-12 lg:py-16">
      <aside>
        <AccountNavigation />
      </aside>
      <div className="min-w-0">
        <Outlet />
      </div>
    </Container>
  );
}
