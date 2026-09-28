import { Link } from "react-router";
import Container from "../components/layout/Container";

export default function RouteErrorPage() {
  return (
    <Container as="main" className="py-20">
      <h1 className="text-4xl font-bold">Something went wrong.</h1>
      <p role="alert" className="my-6 text-muted">
        Please return home and try again.
      </p>
      <Link to="/" reloadDocument className="underline underline-offset-4">
        Reload the homepage
      </Link>
    </Container>
  );
}
