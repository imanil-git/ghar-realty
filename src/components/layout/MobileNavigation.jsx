import { useEffect, useRef } from "react";
import { Link } from "react-router";
import Icon from "../ui/Icon";
import { primaryLinks } from "./navigation";

export default function MobileNavigation({ open, onClose, user }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";

    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) onClose();
    };
    desktop.addEventListener("change", closeOnDesktop);

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [open, onClose]);

  return (
    <dialog
      ref={dialogRef}
      id="mobile-navigation"
      aria-labelledby="mobile-navigation-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="fixed inset-y-0 left-auto right-0 m-0 h-dvh max-h-none w-full max-w-sm border-l border-border bg-background p-0 text-text backdrop:bg-black/50"
    >
      <div className="flex h-full flex-col p-6">
        <div className="mb-8 flex items-center justify-between">
          <h2 id="mobile-navigation-title" className="text-lg font-semibold">
            Explore Ghar
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="flex size-12 items-center justify-center rounded-sm border border-control-border"
          >
            <Icon name="close" />
          </button>
        </div>
        <nav aria-label="Mobile navigation" className="grid gap-2">
          {primaryLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              className="rounded-sm px-3 py-4 hover:bg-surface"
            >
              {label}
            </Link>
          ))}
          <Link
            to="/account/favorites"
            onClick={onClose}
            className="rounded-sm px-3 py-4 hover:bg-surface"
          >
            Saved homes
          </Link>
          {user && (
            <Link
              to="/account/properties/new"
              onClick={onClose}
              className="rounded-sm px-3 py-4 hover:bg-surface"
            >
              List a property
            </Link>
          )}
        </nav>
        <div className="mt-auto border-t border-border pt-6">
          <Link
            to={user ? "/account/profile" : "/login"}
            onClick={onClose}
            className="inline-flex min-h-12 items-center font-medium"
          >
            {user ? `Account / ${user.name}` : "Login"}
          </Link>
          <p className="mt-3 text-sm text-muted">
            Find your place. Start your next chapter.
          </p>
        </div>
      </div>
    </dialog>
  );
}
