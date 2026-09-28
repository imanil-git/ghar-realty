import { useFormContext } from "react-hook-form";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

function fieldError(errors, name) {
  return name.split(".").reduce((value, key) => value?.[key], errors)?.message;
}
export function FormInput({ name, ...props }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <Input {...props} error={fieldError(errors, name)} {...register(name)} />
  );
}
export function FormSelect({
  name,
  options,
  children,
  onValueChange,
  ...props
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <Select
      {...props}
      error={fieldError(errors, name)}
      {...register(name, {
        onChange: (event) => onValueChange?.(event.target.value),
      })}
    >
      {children}
      {options?.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </Select>
  );
}
export function MultiSelect({ name, label, options }) {
  const { register } = useFormContext();
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-medium">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option} className="cursor-pointer">
            <input
              type="checkbox"
              value={option}
              {...register(name)}
              className="peer sr-only"
            />
            <span className="inline-flex min-h-11 items-center rounded-sm border border-control-border px-3 py-2 text-xs peer-checked:border-action peer-checked:bg-action peer-checked:text-on-action peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2">
              {option}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
