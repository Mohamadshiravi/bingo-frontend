import { useId } from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string | undefined;
  label?: string;
  id?: string;
}

export default function FormInput({
  error,
  type,
  label,
  id,
  ...rest
}: FormInputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label htmlFor={inputId} className={`${error && "text-red-400"}`}>
          {error ? error : label}
        </label>
      )}
      <input
        id={inputId}
        onKeyDown={(e) => {
          if (type === "number") {
            const allowedKeys = [
              "Backspace",
              "Delete",
              "ArrowLeft",
              "ArrowRight",
              "Tab",
              "Enter",
            ];
            if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
              e.preventDefault();
            }
          }
        }}
        type={type}
        className={`${
          error ? "border-red-400" : "border-schemes-surface-container-high"
        } bg-background-700 outline-none focus:ring-2 ring-beenbo transition-all w-full px-4 py-3.5 border rounded-lg`}
        {...rest}
      />
    </div>
  );
}
