import Container from "../components/layout/Container";

export default function TermsPage() {
  return (
    <Container className="max-w-3xl py-16">
      <title>Demo listing policy | Ghar Realty</title>
      <h1 className="text-4xl font-semibold">Demo listing policy</h1>
      <div className="mt-8 space-y-5 text-sm leading-7 text-muted">
        <p>
          This is a local demonstration. Accounts, photographs, and published
          listings remain in this browser. Use fictional contact details and
          properties you have permission to demonstrate.
        </p>
        <p>
          Only list property you own or are authorized to represent. Provide
          accurate descriptions and photos, respect others’ privacy, and do not
          upload unlawful material.
        </p>
        <p>
          The example listing duration is 180 days. Production terms, privacy
          notices, moderation, and retention policies must be supplied by the
          operator before a public launch.
        </p>
      </div>
    </Container>
  );
}
