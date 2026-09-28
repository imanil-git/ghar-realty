import { useRef, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBeforeUnload, useBlocker, useNavigate } from "react-router";
import {
  draftSchema,
  publishSchema,
  formValues,
  listingPayload,
  measuredArea,
} from "../schemas/propertySchema";
import { usePropertyMutation } from "../hooks/usePropertyMutation";
import OverviewSection from "./OverviewSection";
import LocationSection from "./LocationSection";
import MediaSection from "./MediaSection";
import HighlightsSection from "./HighlightsSection";
import AmenitiesSection from "./AmenitiesSection";
import LandmarksSection from "./LandmarksSection";
import PricingSection from "./PricingSection";
import DescriptionSection from "./DescriptionSection";
import FormSection from "./FormSection";
import Button from "../../../components/ui/Button";
import Feedback from "../../../components/ui/Feedback";
import Modal from "../../../components/ui/Modal";
import { formatPrice } from "../../../utils/formatPrice";

const sections = [
  ["overview", "Overview"],
  ["location", "Location"],
  ["media", "Photos"],
  ["highlights", "Measurements"],
  ["rooms", "Rooms"],
  ["amenities", "Amenities"],
  ["landmarks", "Landmarks"],
  ["pricing", "Pricing"],
  ["description", "Description"],
  ["review", "Review"],
];

export default function PropertyForm({ property, user }) {
  const methods = useForm({
    resolver: zodResolver(publishSchema),
    shouldFocusError: false,
    defaultValues: formValues(property, user),
  });
  const {
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    reset,
    formState: { isDirty },
  } = methods;
  const mutation = usePropertyMutation("save");
  const navigate = useNavigate();
  const allowLeave = useRef(false);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState("");
  const [discard, setDiscard] = useState(false);
  const values = useWatch({ control: methods.control });
  const dirty = isDirty || uploading;
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      !allowLeave.current &&
      dirty &&
      currentLocation.pathname !== nextLocation.pathname,
  );
  useBeforeUnload((event) => {
    if (dirty && !allowLeave.current) {
      event.preventDefault();
      event.returnValue = "";
    }
  });

  async function save(data, status) {
    if (uploading) {
      setNotice("Wait for the photos to finish processing.");
      return;
    }
    setNotice("");
    try {
      const saved = await mutation.mutateAsync({
        id: property?.id,
        data: listingPayload(data, status),
      });
      allowLeave.current = true;
      reset(formValues(saved, user));
      navigate(
        status === "published"
          ? `/properties/${saved.id}`
          : "/account/properties",
        { replace: true },
      );
    } catch (error) {
      for (const [field, message] of Object.entries(error.fields || {}))
        setError(field, { message });
    }
  }
  function focusFirstError() {
    requestAnimationFrame(() => {
      const field = document.querySelector('[aria-invalid="true"]');
      field?.closest("section")?.scrollIntoView({ block: "start" });
      field?.focus({ preventScroll: true });
    });
  }
  function saveDraft() {
    clearErrors();
    const result = draftSchema.safeParse(getValues());
    if (!result.success) {
      result.error.issues.forEach((issue) =>
        setError(issue.path.join("."), { message: issue.message }),
      );
      setNotice(
        "Fix the highlighted values before saving your draft. Required publishing fields may remain empty.",
      );
      focusFirstError();
      return;
    }
    save(result.data, "draft");
  }
  function invalid() {
    setNotice(
      "Some details need attention. Check the highlighted fields below.",
    );
    focusFirstError();
  }
  function leave() {
    allowLeave.current = true;
    if (blocker.state === "blocked") blocker.proceed();
    else navigate("/account/properties");
  }
  return (
    <FormProvider {...methods}>
      <title>
        {property ? "Edit property" : "List a property"} | Ghar Realty
      </title>
      <div className="mb-8">
        <p className="mb-3 text-xs uppercase tracking-widest text-muted">
          Your property / {property ? "Edit listing" : "New listing"}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          {property ? "Refine your listing." : "Make room for a new beginning."}
        </h1>
        <p className="mt-4 text-sm leading-6 text-muted">
          One page, all the details. Fields marked * are required to publish.
          Save a draft whenever you need a break.
        </p>
      </div>
      <nav aria-label="Listing sections" className="mb-8 flex flex-wrap gap-2">
        {sections.map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            className="border border-border px-3 py-2 text-xs hover:bg-surface"
          >
            {label}
          </a>
        ))}
      </nav>
      <form
        noValidate
        onSubmit={(event) =>
          handleSubmit((data) => save(data, "published"), invalid)(event)
        }
      >
        <fieldset disabled={mutation.isPending} className="min-w-0">
          <Feedback error={notice} />
          <OverviewSection />
          <LocationSection />
          <MediaSection onBusyChange={setUploading} />
          <HighlightsSection />
          <AmenitiesSection />
          <LandmarksSection />
          <PricingSection />
          <DescriptionSection />
          <FormSection id="review" number="10" title="Review your listing">
            <div className="grid gap-4 border border-border bg-surface p-5 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted">Property</p>
                <p className="mt-2 font-medium">
                  {values.title || "Untitled draft"}
                </p>
                <p className="mt-2 text-sm text-muted">
                  {values.location.area || "Area not set"},{" "}
                  {values.location.city || "City not set"}
                </p>
              </div>
              <div>
                <p className="font-semibold">{formatPrice(values)}</p>
                <p className="mt-2 text-sm text-muted">
                  {values.images.length} photos ·{" "}
                  {measuredArea(values).area || 0}{" "}
                  {measuredArea(values).areaUnit}
                </p>
              </div>
            </div>
            <Feedback error={mutation.error} />
            <div className="flex flex-wrap gap-3">
              <Button
                type="submit"
                loading={mutation.isPending}
                disabled={uploading}
              >
                Save & publish
              </Button>
              <Button
                variant="secondary"
                onClick={saveDraft}
                disabled={uploading || mutation.isPending}
              >
                Save as draft
              </Button>
              <Button variant="ghost" onClick={() => setDiscard(true)}>
                Discard changes
              </Button>
            </div>
          </FormSection>
        </fieldset>
      </form>
      <Modal
        title="Leave without saving?"
        open={discard || blocker.state === "blocked"}
        onClose={() => {
          setDiscard(false);
          if (blocker.state === "blocked") blocker.reset();
        }}
      >
        <p className="text-sm leading-6 text-muted">
          Unsaved changes will be lost. An existing saved draft will remain
          available.
        </p>
        <div className="mt-6 flex gap-3">
          <Button onClick={leave}>Leave page</Button>
          <Button
            variant="secondary"
            onClick={() => {
              setDiscard(false);
              if (blocker.state === "blocked") blocker.reset();
            }}
          >
            Keep editing
          </Button>
        </div>
      </Modal>
    </FormProvider>
  );
}
