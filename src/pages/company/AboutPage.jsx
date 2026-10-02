import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import Container from "../../components/layout/Container";
import PageHeading from "../../components/layout/PageHeading";

const principles = [
  {
    title: "Room to explore.",
    text: "Compare places, save the ones that feel right, and come back when you’re ready. A considered decision starts with a clear view of your options.",
  },
  {
    title: "Details that matter.",
    text: "From natural light to road access, the little things make a place your own. We bring photos, specifications, and location together so you can look closer.",
  },
  {
    title: "A direct connection.",
    text: "Found a place you like? Reach out to the property owner to ask questions and arrange a viewing. Your next step should feel straightforward.",
  },
];

export default function AboutPage() {
  return (
    <Container>
      <title>About us | Ghar Realty</title>
      <meta
        name="description"
        content="Get to know Ghar Realty: a place to explore homes, discover neighborhoods, and list property in Nepal."
      />
      <section className="pb-12 pt-12 sm:pt-16">
        <PageHeading
          eyebrow="About Ghar Realty"
          title={
            <>
              A PLACE FOR YOUR
              <br />
              NEXT CHAPTER.
            </>
          }
        >
          <p className="max-w-sm text-sm leading-7 text-muted">
            A home is more than an address. It’s where everyday life takes
            shape. We’re here to make the search for that place a little
            clearer.
          </p>
        </PageHeading>
        <figure className="mt-10">
          <img
            src="/images/living.jpg"
            alt="Sunlit living room with plants, comfortable seating, and space to gather"
            fetchPriority="high"
            className="aspect-[4/3] w-full object-cover sm:aspect-[2.5/1]"
          />
          <figcaption className="mt-4 flex flex-wrap justify-between gap-2 text-xs text-muted">
            <span>Good spaces. New beginnings.</span>
            <span>Rooted in Nepal.</span>
          </figcaption>
        </figure>
      </section>
      <section
        className="grid gap-8 border-y border-border py-12 sm:py-16 lg:grid-cols-[1fr_1.4fr] lg:gap-20"
        aria-labelledby="our-story"
      >
        <div>
          <p className="mb-4 text-xs uppercase tracking-widest text-muted">
            Our purpose
          </p>
          <h2
            id="our-story"
            className="max-w-sm text-3xl font-semibold leading-tight sm:text-4xl"
          >
            Finding a home should start with possibility.
          </h2>
        </div>
        <div className="space-y-5 text-base leading-8 text-muted">
          <p>
            Finding the right space means balancing where you want to live, how
            you want to spend your days, and what works for your budget. Ghar
            Realty brings those choices into one place.
          </p>
          <p>
            Explore homes for rent and sale, discover land for a future plan, or
            introduce your property to someone ready for their next chapter.
            From a first apartment to a little more room for family, every
            search begins with a different story.
          </p>
          <Link
            to="/properties"
            className="inline-flex min-h-12 items-center gap-3 text-sm font-medium text-text underline-offset-4 hover:underline"
          >
            Find your place <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
      <section className="py-12 sm:py-16" aria-labelledby="our-approach">
        <p className="mb-4 text-xs uppercase tracking-widest text-muted">
          Our approach
        </p>
        <h2 id="our-approach" className="text-3xl font-semibold sm:text-4xl">
          Thoughtful at every step.
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {principles.map(({ title, text }, index) => (
            <article key={title} className="border-t border-border pt-6">
              <span className="text-xs text-muted">0{index + 1}</span>
              <h3 className="mb-4 mt-6 text-2xl font-semibold">{title}</h3>
              <p className="text-sm leading-7 text-muted">{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section
        className="mb-16 grid bg-surface lg:grid-cols-2"
        aria-labelledby="owners-heading"
      >
        <img
          src="/images/house.jpg"
          alt="Contemporary home with generous windows and an open garden"
          loading="lazy"
          className="aspect-[4/3] h-full w-full object-cover"
        />
        <div className="flex flex-col justify-center p-7 sm:p-12">
          <p className="mb-4 text-xs uppercase tracking-widest text-muted">
            For property owners
          </p>
          <h2
            id="owners-heading"
            className="text-3xl font-semibold leading-tight sm:text-4xl"
          >
            Your space.
            <br />
            Someone’s new beginning.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-muted">
            Tell the story of your property with photos and useful details. Save
            a draft, review your listing, and publish when you’re ready.
          </p>
          <Link
            to="/account/properties/new"
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-4 self-start rounded-sm bg-action px-6 text-sm text-on-action"
          >
            List a property <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
      <section className="mb-16 flex flex-col justify-between gap-6 border-t border-border pt-10 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold sm:text-3xl">
            Let’s talk about your next step.
          </h2>
          <p className="mt-3 text-sm text-muted">
            Questions about exploring or listing a property? Start here.
          </p>
        </div>
        <Link
          to="/contact-us"
          className="inline-flex min-h-12 items-center justify-center gap-4 self-start rounded-sm border border-control-border px-6 text-sm hover:bg-surface"
        >
          Contact us <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>
    </Container>
  );
}
