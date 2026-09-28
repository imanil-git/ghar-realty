import { Link } from "react-router";
import Container from "./Container";
import Logo from "./Logo";

const columns = [
  {
    title: "Find your place",
    links: [
      ["Buy a home", "/properties?listingType=buy"],
      ["Rent a home", "/properties?listingType=rent"],
      ["All properties", "/properties"],
    ],
  },
  {
    title: "Explore spaces",
    links: [
      ["Apartments", "/categories/apartment"],
      ["Houses", "/categories/house"],
      ["Land", "/categories/land"],
    ],
  },
  {
    title: "Your property",
    links: [
      ["List a property", "/account/properties/new"],
      ["Manage listings", "/account/properties"],
      ["Saved homes", "/account/favorites"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <Container className="py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-64 text-sm leading-6 text-muted">
              Good spaces. New beginnings.
              <br />
              Find where you belong in Nepal.
            </p>
          </div>
          {columns.map(({ title, links }) => (
            <nav key={title} aria-label={title}>
              <h2 className="mb-4 text-sm font-semibold">{title}</h2>
              <ul className="space-y-1 text-sm text-muted">
                {links.map(([label, to]) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="inline-flex min-h-11 items-center underline-offset-4 hover:text-text hover:underline"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap justify-between gap-3 border-t border-border pt-6 text-xs text-muted">
          <p>© {new Date().getFullYear()} Ghar Realty</p>
          <p>Nepal · A place for your next chapter</p>
        </div>
      </Container>
    </footer>
  );
}
