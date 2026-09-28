import { Link } from "react-router";
import Container from "../components/layout/Container";
import PageHeading from "../components/layout/PageHeading";

export default function NotFoundPage() {
  return (
    <Container className="py-20">
      <title>Page not found | Ghar Realty</title>
      <PageHeading
        eyebrow="404 / Page not found"
        title="A wrong turn."
        description="We couldn’t find that page. Let’s get you back to a familiar place."
      />
      <Link
        to="/"
        className="mt-8 inline-flex min-h-12 items-center rounded-sm bg-action px-5 text-sm text-on-action"
      >
        Back to home
      </Link>
    </Container>
  );
}
