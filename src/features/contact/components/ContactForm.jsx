import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check } from "lucide-react";
import { contactSchema, enquiryTopics } from "../schemas/contactSchema";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Textarea from "../../../components/ui/Textarea";
import Button from "../../../components/ui/Button";

export default function ContactForm() {
  const [preview, setPreview] = useState(null);
  const previewRef = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", topic: "", message: "" },
  });

  function review(values) {
    setPreview(values);
    requestAnimationFrame(() => previewRef.current?.focus());
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold sm:text-3xl">
          What can we help you with?
        </h2>
        <p id="contact-demo-note" className="mt-3 text-sm leading-6 text-muted">
          This demo lets you prepare and preview an enquiry. Messages are not
          sent. Please use sample contact details.
        </p>
      </div>
      <form
        noValidate
        onSubmit={(event) =>
          handleSubmit(review, () => setPreview(null))(event)
        }
        onChange={() => setPreview(null)}
        aria-describedby="contact-demo-note"
        className="space-y-6"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <Input
            label="Full name"
            autoComplete="name"
            placeholder="Your name"
            required
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            error={errors.email?.message}
            {...register("email")}
          />
        </div>
        <Select
          label="I’d like to ask about"
          required
          error={errors.topic?.message}
          {...register("topic")}
        >
          <option value="">Select a topic</option>
          {enquiryTopics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </Select>
        <Textarea
          label="Your message"
          required
          rows={7}
          maxLength={3000}
          placeholder="Tell us a little about what you have in mind…"
          hint="If your question is about a listing, include its title or link. Up to 3,000 characters."
          error={errors.message?.message}
          {...register("message")}
        />
        <Button type="submit">
          Preview enquiry <ArrowRight size={18} aria-hidden="true" />
        </Button>
      </form>
      {preview && (
        <section
          ref={previewRef}
          tabIndex={-1}
          aria-labelledby="enquiry-preview-title"
          className="mt-8 border border-border bg-surface p-6"
        >
          <p role="status" className="mb-4 flex items-center gap-2 text-sm">
            <Check size={18} aria-hidden="true" /> Enquiry prepared — not sent.
          </p>
          <h3 id="enquiry-preview-title" className="text-xl font-semibold">
            {preview.topic}
          </h3>
          <p className="mt-3 break-words text-sm text-muted">
            {preview.name} · {preview.email}
          </p>
          <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7">
            {preview.message}
          </p>
          <p className="mt-5 border-t border-border pt-4 text-xs leading-6 text-muted">
            You can edit your message above. This preview stays here only while
            this page is open.
          </p>
        </section>
      )}
    </div>
  );
}
