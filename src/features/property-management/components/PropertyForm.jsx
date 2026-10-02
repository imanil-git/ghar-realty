import { useRef, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useBeforeUnload,
  useBlocker,
  useNavigate,
  useLocation,
  useSearchParams,
  Link,
} from "react-router";
import {
  draftSchema,
  publishSchema,
  formValues,
  listingPayload,
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
import ListingPreview from "./ListingPreview";
import Checkbox from "../../../components/ui/Checkbox";

const steps = ["details", "photos", "preview", "publish"];

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
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const requestedStep =
    params.get("step") ||
    (location.pathname.endsWith("/preview") ? "preview" : "details");
  const step = steps.includes(requestedStep) ? requestedStep : "details";
  const stepIndex = steps.indexOf(step);
  function goToStep(next) {
    if (uploading || mutation.isPending) return;
    setNotice("");
    const nextParams = new URLSearchParams(params);
    nextParams.set("step", next);
    setParams(nextParams);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  const allowLeave = useRef(false);
  const formRef = useRef(null);
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
    if (mutation.isPending) return;
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
      const fields = Object.entries(error.fields || {});
      for (const [field, message] of fields) setError(field, { message });
      if (fields.length) showInvalidStep(fields[0][0].split(".")[0]);
    }
  }
  function focusFirstError() {
    requestAnimationFrame(() => {
      const field = Array.from(
        formRef.current?.querySelectorAll('[aria-invalid="true"]') || [],
      ).find((element) => !element.closest("[hidden]"));
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
      showInvalidStep(result.error.issues[0]?.path[0]);
      return;
    }
    save(result.data, "draft");
  }
  function showInvalidStep(field) {
    const next =
      field === "images" || field === "videoUrl"
        ? "photos"
        : field === "policy"
          ? "publish"
          : "details";
    const nextParams = new URLSearchParams(params);
    nextParams.set("step", next);
    setParams(nextParams);
    setTimeout(focusFirstError, 0);
  }
  function invalid(errors) {
    setNotice(
      "Some details need attention. Check the highlighted fields before publishing.",
    );
    const result = publishSchema.safeParse(getValues());
    showInvalidStep(
      result.success ? Object.keys(errors)[0] : result.error.issues[0]?.path[0],
    );
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
      <nav
        aria-label="Listing steps"
        className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {steps.map((item, index) => (
          <button
            key={item}
            type="button"
            aria-current={step === item ? "step" : undefined}
            disabled={uploading || mutation.isPending}
            onClick={() => goToStep(item)}
            className={`min-h-12 rounded-sm border border-border px-3 py-3 text-sm capitalize disabled:opacity-50 ${step === item ? "bg-action text-on-action" : "bg-background hover:bg-surface"}`}
          >
            {index + 1}. {item[0].toUpperCase() + item.slice(1)}
          </button>
        ))}
      </nav>
      <form
        ref={formRef}
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          if (step === "publish")
            handleSubmit((data) => save(data, "published"), invalid)(event);
        }}
      >
        <fieldset disabled={mutation.isPending} className="min-w-0">
          <Feedback error={notice} />
          <Feedback error={mutation.error} />
          <div hidden={step !== "details"}>
            <p className="mb-5 text-sm text-muted">
              Tell buyers and renters what makes your property special. Required
              fields are marked *.
            </p>
            <OverviewSection />
            <LocationSection />
            <HighlightsSection />
            <AmenitiesSection />
            <LandmarksSection />
            <PricingSection />
            <DescriptionSection />
          </div>
          <div hidden={step !== "photos"}>
            <MediaSection onBusyChange={setUploading} />
          </div>
          {step === "preview" && (
            <>
              <ListingPreview values={values} />
              <Button
                variant="secondary"
                className="mb-6"
                onClick={() => goToStep("details")}
              >
                Edit details
              </Button>
            </>
          )}
          {step === "publish" && (
            <FormSection
              id="publish"
              title={
                property?.status === "published"
                  ? "Publish your updates"
                  : "Publish your property"
              }
              description="Review the final checks. Your property becomes visible to everyone after publishing."
            >
              <div className="border border-border bg-surface p-6">
                <h3 className="text-xl font-semibold">
                  {values.title || "Untitled property"}
                </h3>
                <p className="mt-3 text-sm text-muted">
                  {values.images.length} photos · Listing duration: 180 days
                </p>
              </div>
              <Checkbox
                label={
                  <>
                    I agree to the{" "}
                    <Link to="/terms" target="_blank" className="underline">
                      listing policy
                    </Link>
                  </>
                }
                error={methods.formState.errors.policy?.message}
                {...methods.register("policy")}
              />
              <p className="text-sm text-muted">
                Your contact number will appear on the listing so interested
                people can reach you.
              </p>
              <Button
                type="submit"
                loading={mutation.isPending}
                disabled={uploading}
              >
                {property?.status === "published"
                  ? "Publish changes"
                  : "Publish property"}
              </Button>
            </FormSection>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {stepIndex > 0 && (
              <Button
                variant="secondary"
                disabled={uploading}
                onClick={() => goToStep(steps[stepIndex - 1])}
              >
                ← Back to {steps[stepIndex - 1]}
              </Button>
            )}
            {stepIndex < 3 && (
              <Button
                disabled={uploading}
                onClick={() => goToStep(steps[stepIndex + 1])}
              >
                {step === "details"
                  ? "Continue to photos →"
                  : step === "photos"
                    ? "Preview property →"
                    : "Continue to publish →"}
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={saveDraft}
              disabled={uploading || mutation.isPending}
            >
              Save as draft
            </Button>
            <Button
              variant="ghost"
              onClick={() => setDiscard(true)}
              disabled={uploading}
            >
              Discard changes
            </Button>
          </div>
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
