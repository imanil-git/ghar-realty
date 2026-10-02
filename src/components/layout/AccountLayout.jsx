import { Outlet, useLocation, useSearchParams } from "react-router";
import Container from "./Container";
import AccountNavigation from "./AccountNavigation";
import "../../styles/property-detail.css";

export default function AccountLayout() {
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const listings = pathname.includes("/properties");
  const favorites = pathname.endsWith("/favorites");
  const editor = listings && !pathname.endsWith("/properties");
  const step =
    params.get("step") ||
    (pathname.endsWith("/preview") ? "preview" : "details");
  const headings = {
    details: "MAKE ROOM FOR A NEW BEGINNING.",
    photos: "SHOW WHAT MAKES IT HOME.",
    preview: "READY FOR ITS NEXT CHAPTER.",
    publish: "PUT YOUR PROPERTY ON THE MAP.",
  };
  return (
    <Container
      className={`${listings || favorites ? "property-detail" : ""} py-10 lg:py-16`}
    >
      {(listings || favorites) && (
        <div className="mb-9">
          <p className="mb-3 text-xs uppercase text-muted">Your account</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {favorites
              ? "YOUR SAVED HOMES."
              : editor
                ? headings[step] || headings.details
                : "YOUR PROPERTIES."}
          </h1>
        </div>
      )}
      <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
        <aside>
          <AccountNavigation />
        </aside>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </Container>
  );
}
