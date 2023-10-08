"use client";

import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { FiLoader } from "react-icons/fi";

interface SubmitButtonProps {
  text: string;
  className?: string;
}

export function SubmitButton({
  text = "Submit",
  className,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={className}
      aria-disabled={pending}
      disabled={pending}
    >
      {pending ? (
        <p className="flex items-center justify-center w-full">
          Please wait... <FiLoader className="animate-spin" />
        </p>
      ) : (
        text
      )}
    </button>
  );
}
