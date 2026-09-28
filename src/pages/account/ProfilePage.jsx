import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRound } from "lucide-react";
import { useSession } from "../../features/auth/hooks/useSession";
import { useAuthMutation } from "../../features/auth/hooks/useAuthMutation";
import { profileSchema } from "../../features/auth/schemas/authSchemas";
import { uploadImage } from "../../services/uploadService";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Feedback from "../../components/ui/Feedback";

export default function ProfilePage() {
  const { data: user } = useSession();
  const mutation = useAuthMutation("updateProfile");
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(profileSchema), defaultValues: user });
  const avatar = useWatch({ control, name: "avatar" });
  async function upload(event) {
    const file = event.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const result = await uploadImage(file, { avatar: true });
      setValue("avatar", result.url, { shouldDirty: true });
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }
  return (
    <section>
      <title>Your profile | Ghar Realty</title>
      <h1 className="text-3xl font-semibold">Your profile</h1>
      <p className="mt-3 text-sm text-muted">
        The details people use to get in touch.
      </p>
      <form
        noValidate
        onSubmit={handleSubmit(async (data) => {
          try {
            const saved = await mutation.mutateAsync(data);
            reset(saved);
          } catch {
            /* Feedback keeps the form intact. */
          }
        })}
        className="mt-8 max-w-2xl space-y-6"
      >
        <div className="flex flex-wrap items-center gap-5">
          {avatar ? (
            <img
              src={avatar}
              alt="Your avatar"
              className="size-20 rounded-full object-cover"
            />
          ) : (
            <UserRound size={64} className="rounded-full bg-surface p-3" />
          )}
          <Input
            label="Profile photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={upload}
            disabled={uploading}
            hint={
              uploading ? "Processing image…" : "Optional. JPG, PNG, or WebP."
            }
            error={uploadError}
          />
          {avatar && (
            <Button
              variant="ghost"
              onClick={() => setValue("avatar", "", { shouldDirty: true })}
            >
              Remove photo
            </Button>
          )}
        </div>
        <Input
          label="Full name"
          required
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Email"
          required
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Phone"
          required
          type="tel"
          autoComplete="tel"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <Feedback
          error={mutation.error}
          message={mutation.isSuccess ? "Your profile has been updated." : ""}
        />
        <Button type="submit" loading={mutation.isPending} disabled={uploading}>
          Save changes
        </Button>
      </form>
    </section>
  );
}
