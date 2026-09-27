"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";

import SubmitButton from "@/components/SubmitButton";

interface ConfirmActionButtonProps {
  action: (formData: FormData) => Promise<void>;
  /** Field name and value submitted when the dialog is confirmed. */
  name: string;
  value: string;
  triggerLabel: string;
  ariaLabel: string;
  tag: string;
  heading: string;
  text: ReactNode;
  confirmLabel: string;
  pendingLabel: string;
}

/**
 * A button that asks once before submitting : used for deleting a story and for
 * removing a gallery photo. The dialog is rendered inside the same `<form>`, so
 * `useFormStatus` reports that form's submission state.
 */
export default function ConfirmActionButton({
  action,
  name,
  value,
  triggerLabel,
  ariaLabel,
  tag,
  heading,
  text,
  confirmLabel,
  pendingLabel,
}: ConfirmActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <form action={action} className="blog-delete-form">
      <input type="hidden" name={name} value={value} />
      <button
        ref={triggerRef}
        type="button"
        className="blog-delete-button"
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        onClick={() => setIsOpen(true)}
      >
        {triggerLabel}
      </button>

      {isOpen && (
        <ConfirmDialog
          tag={tag}
          heading={heading}
          text={text}
          confirmLabel={confirmLabel}
          pendingLabel={pendingLabel}
          onClose={close}
        />
      )}
    </form>
  );
}

function ConfirmDialog({
  tag,
  heading,
  text,
  confirmLabel,
  pendingLabel,
  onClose,
}: {
  tag: string;
  heading: string;
  text: ReactNode;
  confirmLabel: string;
  pendingLabel: string;
  onClose: () => void;
}) {
  const { pending } = useFormStatus();
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const pendingRef = useRef(pending);
  const closeRef = useRef(onClose);
  const headingId = useId();
  const descriptionId = useId();

  // Keep the mount-only effect below reading current values.
  useEffect(() => {
    pendingRef.current = pending;
    closeRef.current = onClose;
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // The action is already in flight, so don't let Escape imply it stopped.
        if (!pendingRef.current) closeRef.current();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable =
        dialogRef.current?.querySelectorAll<HTMLButtonElement>(
          "button:not(:disabled)"
        );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    cancelRef.current?.focus();

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const dismiss = () => {
    if (!pending) onClose();
  };

  return (
    <div className="video-modal-backdrop" onClick={dismiss} role="presentation">
      <div
        ref={dialogRef}
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={headingId}
        aria-describedby={descriptionId}
        onClick={(event) => event.stopPropagation()}
      >
        <p className="subpage-tag">{tag}</p>
        <h2 id={headingId}>{heading}</h2>
        <p id={descriptionId} className="confirm-dialog-text">
          {text}
        </p>
        <div className="confirm-dialog-actions">
          <button
            ref={cancelRef}
            type="button"
            className="confirm-cancel-button"
            onClick={dismiss}
            disabled={pending}
          >
            CANCEL
          </button>
          <SubmitButton className="confirm-delete-button" pendingLabel={pendingLabel}>
            {confirmLabel}
          </SubmitButton>
        </div>
      </div>
    </div>
  );
}
