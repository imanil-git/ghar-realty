import Container from "../../../components/layout/Container";
import { isMockMode } from "../../../services/config";

export default function AuthLayout({
  title,
  showDemoCredentials = false,
  children,
}) {
  return (
    <Container className="py-12 sm:py-20">
      <title>{title} | Ghar Realty</title>
      <div className="mx-auto grid max-w-4xl gap-12 md:grid-cols-2">
        <div>
          <p className="mb-5 text-xs uppercase tracking-widest text-muted">
            Your next chapter
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            {title}
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
              {showDemoCredentials && (
                <p>
                  Try aarav@example.com
                  <br />
                  Password: GharDemo123!
                </p>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </Container>
  );
}
