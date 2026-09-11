"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  children: ReactNode;
  className?: string;
  /** Swap in wording that reads better while the action is in flight. */
  pendingLabel?: string;
  ariaLabel?: string;
}

/**
 * Must be rendered inside the `<form>` whose action it submits — `useFormStatus`
 * reports the state of the nearest parent form.
 */
export default function SubmitButton({
  children,
  className,
  pendingLabel,
  ariaLabel,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={className}
      aria-label={ariaLabel}
      aria-busy={pending || undefined}
      disabled={pending}
    >
      {pending && <span className="button-spinner" aria-hidden="true" />}
      {pending ? pendingLabel ?? children : children}
    </button>
  );
}
