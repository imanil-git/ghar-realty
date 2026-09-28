import { useEffect, useRef } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router";
import { useSession } from "../../features/auth/hooks/useSession";
import Header from "./Header";
import Footer from "./Footer";
import { isMockMode } from "../../services/config";

export default function SiteLayout() {
  const session = useSession();
  const location = useLocation();
  const previousPath = useRef(location.pathname);
  const mainRef = useRef(null);

  useEffect(() => {
    if (previousPath.current !== location.pathname) {
      mainRef.current?.focus({ preventScroll: true });
      previousPath.current = location.pathname;
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#main-content"
        className="sr-only z-50 bg-action p-4 text-on-action focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Header
        key={location.key}
        user={session.data}
        loading={session.isPending}
      />
      <main
        ref={mainRef}
        id="main-content"
        tabIndex={-1}
        className="flex-1 focus:outline-none"
      >
        <Outlet />
      </main>
      {isMockMode && (
        <p className="border-t border-border bg-surface px-5 py-3 text-center text-xs text-muted">
          Local demo · Sample listings and imagery · Changes stay in this
          browser
        </p>
      )}
      <Footer />
      <ScrollRestoration />
    </div>
  );
}
