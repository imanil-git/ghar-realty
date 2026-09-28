import { useCallback, useState } from "react";
import { Link, useLocation } from "react-router";
import Container from "./Container";
import Logo from "./Logo";
import MobileNavigation from "./MobileNavigation";
import { primaryLinks } from "./navigation";
import ThemeToggle from "../ui/ThemeToggle";
import Icon from "../ui/Icon";

export default function Header({ user = null, loading = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background">
      <Container className="flex min-h-24 items-center justify-between gap-3 py-3">
        <Logo />
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-6 text-sm lg:flex"
        >
          {primaryLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              aria-current={
                location.pathname + location.search === to ? "page" : undefined
              }
              className="py-3 underline-offset-8 hover:underline aria-[current=page]:underline"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          {user && (
            <Link
              to="/account/properties/new"
              aria-label="List a property"
              className="flex min-h-12 items-center justify-center gap-2 rounded-sm bg-action px-3 text-sm text-on-action sm:px-4"
            >
              <Icon name="plus" className="size-5" />
              <span className="hidden sm:inline">List a property</span>
            </Link>
          )}
          <ThemeToggle />
          {loading ? (
            <span role="status" className="text-xs text-muted">
              Loading…
            </span>
          ) : user ? (
            <Link
              to="/account/profile"
              aria-label={`Account for ${user.name}`}
              className="flex min-h-12 max-w-20 flex-col items-center justify-center gap-1 px-1"
            >
              <Icon name="user" className="size-5" />
              <span className="max-w-16 truncate text-xs">
                {user.name.split(" ")[0]}
              </span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex min-h-12 items-center rounded-sm bg-action px-4 text-sm text-on-action"
            >
              Login
            </Link>
          )}
          <button
            type="button"
            aria-label="Open navigation"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(true)}
            className="flex size-12 items-center justify-center rounded-sm hover:bg-surface lg:hidden"
          >
            <Icon name="menu" />
          </button>
        </div>
      </Container>
      <MobileNavigation open={menuOpen} onClose={closeMenu} user={user} />
    </header>
  );
}
