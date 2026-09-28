import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Container from "../components/layout/Container";
import PageHeading from "../components/layout/PageHeading";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Textarea from "../components/ui/Textarea";
import Checkbox from "../components/ui/Checkbox";
import ThemeToggle from "../components/ui/ThemeToggle";

const exampleSchema = z.object({
  title: z.string().trim().min(5, "Enter a title with at least 5 characters."),
  category: z.string().min(1, "Choose a property category."),
  description: z
    .string()
    .trim()
    .min(20, "Write at least 20 characters about the property."),
  accepted: z
    .boolean()
    .refine(Boolean, "Accept the listing policy to continue."),
});

function Section({ number, title, description, children }) {
  return (
    <section className="grid gap-8 border-t border-border py-10 lg:grid-cols-[240px_1fr] lg:gap-14 lg:py-14">
      <div>
        <p className="mb-3 text-xs text-muted">{number}</p>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

export default function ComponentPreview() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(exampleSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
      accepted: false,
    },
  });

  function resetExample() {
    reset();
    setSubmitted(false);
  }

  return (
    <Container className="pb-12">
      <div className="flex items-center justify-between gap-4 py-8">
        <p className="text-sm font-bold tracking-wide">GHAR REALTY</p>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-muted sm:block">
            Light / Dark
          </span>
          <ThemeToggle />
        </div>
      </div>

      <div className="pb-12 pt-8 sm:pb-16">
        <PageHeading
          eyebrow="Design foundations / 01"
          title={
            <>
              ROOM FOR
              <br />
              GOOD DESIGN.
            </>
          }
          description="The building blocks of Ghar Realty. A quiet palette, clear typography, and controls that feel familiar."
        >
          <span className="w-fit rounded-sm border border-border px-3 py-2 text-xs text-muted">
            Component preview
          </span>
        </PageHeading>
      </div>

      <Section
        number="01"
        title="Color & contrast"
        description="Shared color roles keep every screen consistent in light and dark mode."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Background", "bg-background"],
            ["Surface", "bg-surface"],
            ["Action", "bg-action"],
            ["Border", "bg-border"],
          ].map(([label, color]) => (
            <div key={label}>
              <div
                className={`h-24 rounded-sm border border-border sm:h-32 ${color}`}
              />
              <p className="mt-3 text-sm">{label}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted">
          Secondary text stays readable. Errors include a written message.
        </p>
      </Section>

      <Section
        number="02"
        title="Typography"
        description="Red Hat Display, with generous line height and a simple heading hierarchy."
      >
        <div className="space-y-5">
          <p className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Find your place.
          </p>
          <p className="text-2xl font-semibold">A home for your next chapter</p>
          <p className="max-w-xl leading-7 text-muted">
            Good spaces start with the details. Explore homes, apartments, and
            land across Nepal, at your own pace.
          </p>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">
            Kathmandu · Lalitpur · Pokhara
          </p>
        </div>
      </Section>

      <Section
        number="03"
        title="Actions"
        description="Primary, secondary, and quiet actions, with clear loading and disabled states."
      >
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() =>
              document
                .getElementById("example-form")
                .scrollIntoView({ block: "start" })
            }
          >
            Try the form ↓
          </Button>
          <Button variant="secondary" onClick={resetExample}>
            Reset example
          </Button>
          <Button variant="ghost" onClick={() => window.scrollTo({ top: 0 })}>
            Back to top ↑
          </Button>
          <Button loading>Saving…</Button>
          <Button disabled>Unavailable</Button>
        </div>
      </Section>

      <Section
        number="04"
        title="Form controls"
        description="Visible labels, useful hints, and errors next to the field. Required fields are marked with an asterisk."
      >
        <form
          id="example-form"
          noValidate
          onSubmit={handleSubmit(() => setSubmitted(true))}
          onChange={() => setSubmitted(false)}
          className="grid scroll-mt-6 gap-6"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <Input
              label="Property title"
              placeholder="A bright apartment in Jhamsikhel"
              required
              error={errors.title?.message}
              {...register("title")}
            />
            <Select
              label="Category"
              required
              error={errors.category?.message}
              {...register("category")}
            >
              <option value="">Choose a category</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="land">Land</option>
            </Select>
          </div>
          <Textarea
            label="Description"
            placeholder="Tell us what makes this space special…"
            hint="Describe the space, natural light, and neighborhood."
            required
            error={errors.description?.message}
            {...register("description")}
          />
          <Checkbox
            label="I agree to the listing policy"
            required
            error={errors.accepted?.message}
            {...register("accepted")}
          />
          <div className="flex flex-wrap gap-3">
            <Button type="submit">Check example</Button>
            <Button variant="secondary" onClick={resetExample}>
              Clear
            </Button>
          </div>
          <p className="text-xs text-muted">
            Preview only. Nothing is uploaded or published.
          </p>
          {submitted && (
            <p
              role="status"
              className="border-l-2 border-text bg-surface px-4 py-3 text-sm"
            >
              All fields look good. This example has not been saved.
            </p>
          )}
        </form>
      </Section>

      <Section
        number="05"
        title="Control states"
        description="Errors remain visible in both themes. Disabled fields are distinguishable from editable ones."
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <Input
            label="Monthly rent (example error)"
            defaultValue=""
            placeholder="Enter an amount"
            error="Enter an amount greater than zero."
          />
          <Input label="Currency" value="NPR — Nepalese rupee" disabled />
          <Select label="Listing status" value="draft" disabled>
            <option value="draft">Draft</option>
          </Select>
          <Textarea
            label="Read-only note"
            value="Your property details will appear here."
            readOnly
            rows={2}
          />
          <Checkbox label="Email updates" defaultChecked />
          <Checkbox label="Unavailable preference" disabled />
        </div>
      </Section>
      <p className="border-t border-border pt-6 text-xs text-muted">
        Ghar Realty · Interface foundations
      </p>
    </Container>
  );
}
