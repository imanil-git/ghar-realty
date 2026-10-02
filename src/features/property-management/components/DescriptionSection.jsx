import { useRef } from "react";
import { useFormContext } from "react-hook-form";
import FormSection from "./FormSection";
import { FormInput } from "./FormControls";
import Textarea from "../../../components/ui/Textarea";
import Button from "../../../components/ui/Button";

export default function DescriptionSection() {
  const {
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext();
  const descriptionRef = useRef(null);
  const descriptionField = register("description");
  function format(prefix, suffix = "") {
    const textarea = descriptionRef.current;
    const value = getValues("description");
    const start = textarea.selectionStart,
      end = textarea.selectionEnd;
    setValue(
      "description",
      value.slice(0, start) +
        prefix +
        (value.slice(start, end) || "text") +
        suffix +
        value.slice(end),
      { shouldDirty: true },
    );
    textarea.focus();
  }
  return (
    <FormSection id="description" number="09" title="Description & contact">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormInput
          name="title"
          label="Property title"
          required
          placeholder="A bright apartment in Jhamsikhel"
        />
        <FormInput
          name="phone"
          label="Contact phone number"
          required
          type="tel"
        />
      </div>
      <div>
        <div
          className="mb-2 flex gap-2"
          role="group"
          aria-label="Description formatting"
        >
          <Button
            variant="secondary"
            aria-label="Insert bold text"
            onClick={() => format("**", "**")}
          >
            B
          </Button>
          <Button
            variant="secondary"
            aria-label="Insert italic text"
            onClick={() => format("*", "*")}
          >
            I
          </Button>
          <Button variant="secondary" onClick={() => format("\n- ")}>
            Bullet
          </Button>
        </div>
        <Textarea
          label="Description"
          required
          rows={7}
          hint="Use paragraphs or simple Markdown for bold, italic, and lists. No HTML is accepted."
          error={errors.description?.message}
          {...descriptionField}
          ref={(element) => {
            descriptionField.ref(element);
            descriptionRef.current = element;
          }}
        />
      </div>
    </FormSection>
  );
}
