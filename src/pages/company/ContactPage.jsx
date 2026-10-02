import { Link } from "react-router";
import { ArrowRight, House, KeyRound, MessageSquare } from "lucide-react";
import Container from "../../components/layout/Container";
import PageHeading from "../../components/layout/PageHeading";
import ContactForm from "../../features/contact/components/ContactForm";

const questions = [
  {
    question: "How do I arrange a property viewing?",
    answer:
      "Open the property you’re interested in and use the owner’s contact options. Ask about availability and agree on a viewing time directly with the owner.",
  },
  {
    question: "Can I save a listing and come back later?",
    answer:
      "Yes. Sign in and select the heart on a property. You’ll find it in Saved homes, where you can open it again or remove it from your shortlist.",
  },
  {
    question: "How do I list my property?",
    answer:
      "Sign in and choose List a property. Add the details and photos, preview the listing, then publish. You can save an unfinished listing as a draft and return to it from My properties.",
  },
  {
    question: "Can I change a listing after publishing?",
    answer:
      "Open My properties and choose Edit beside your listing. Update the details or photographs, review the preview, and publish your changes.",
  },
];

export default function ContactPage() {
  return (
    <Container>
      <title>Contact us | Ghar Realty</title>
      <meta
        name="description"
        content="Find help with searching for a home, listing your property, or using your Ghar Realty account."
      />
      <section className="border-b border-border py-12 sm:py-16">
        <PageHeading
          eyebrow="Contact us"
          title={
            <>
              LET’S START A<br />
              CONVERSATION.
            </>
          }
        >
          <p className="max-w-sm text-sm leading-7 text-muted">
            A question, a new plan, or something we could do better. Start with
            what’s on your mind.
          </p>
        </PageHeading>
      </section>
      <section className="grid gap-12 py-12 sm:py-16 lg:grid-cols-[0.8fr_1.4fr] lg:gap-20">
        <aside aria-label="Find the right next step">
          <p className="mb-5 text-xs uppercase tracking-widest text-muted">
            A little direction
          </p>
          <div className="divide-y divide-border">
            <div className="pb-7">
              <House size={24} strokeWidth={1.4} aria-hidden="true" />
              <h2 className="mt-4 text-xl font-semibold">
                Looking for a place?
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                For availability, viewings, or details about a home, contact the
                owner from the property page.
              </p>
              <Link
                to="/properties"
                className="mt-3 inline-flex min-h-11 items-center gap-3 text-sm hover:underline"
              >
                Explore properties <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <div className="py-7">
              <KeyRound size={24} strokeWidth={1.4} aria-hidden="true" />
              <h2 className="mt-4 text-xl font-semibold">
                Have a property to share?
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                Give your space a thoughtful introduction. Start a listing or
                return to a saved draft.
              </p>
              <Link
                to="/account/properties"
                className="mt-3 inline-flex min-h-11 items-center gap-3 text-sm hover:underline"
              >
                Your properties <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <div className="pt-7">
              <MessageSquare size={24} strokeWidth={1.4} aria-hidden="true" />
              <h2 className="mt-4 text-xl font-semibold">Something else?</h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                Use the enquiry form for account questions, general enquiries,
                or ideas for improving Ghar Realty.
              </p>
            </div>
          </div>
        </aside>
        <ContactForm />
      </section>
      <section
        aria-labelledby="faq-title"
        className="mb-16 grid gap-8 border-t border-border pt-12 lg:grid-cols-[0.8fr_1.4fr] lg:gap-20"
      >
        <div>
          <p className="mb-4 text-xs uppercase tracking-widest text-muted">
            Before you ask
          </p>
          <h2 id="faq-title" className="text-3xl font-semibold sm:text-4xl">
            A few useful answers.
          </h2>
        </div>
        <div>
          {questions.map(({ question, answer }) => (
            <details
              key={question}
              className="group border-b border-border py-5 first:pt-0"
            >
              <summary className="flex min-h-11 list-none items-center justify-between gap-5 text-base font-medium [&::-webkit-details-marker]:hidden">
                {question}
                <span
                  aria-hidden="true"
                  className="text-2xl font-normal group-open:hidden"
                >
                  +
                </span>
                <span
                  aria-hidden="true"
                  className="hidden text-2xl font-normal group-open:inline"
                >
                  −
                </span>
              </summary>
              <p className="pb-2 pt-3 text-sm leading-7 text-muted">{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </Container>
  );
}
