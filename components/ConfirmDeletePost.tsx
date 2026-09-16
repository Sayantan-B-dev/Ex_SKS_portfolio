"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import SubmitButton from "@/components/SubmitButton";

interface ConfirmDeletePostProps {
  action: (formData: FormData) => Promise<void>;
  postId: string;
  postTitle: string;
}

export default function ConfirmDeletePost({
  action,
  postId,
  postTitle,
}: ConfirmDeletePostProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <form action={action} className="blog-delete-form">
      <input type="hidden" name="id" value={postId} />
      <button
        ref={triggerRef}
        type="button"
        className="blog-delete-button"
        aria-label={`Delete ${postTitle}`}
        aria-haspopup="dialog"
        onClick={() => setIsOpen(true)}
      >
        DELETE
      </button>

      {isOpen && <ConfirmDialog postTitle={postTitle} onClose={close} />}
    </form>
  );
}

/**
 * Rendered inside the `<form>` so `useFormStatus` reports that form's
 * submission state.
 */
function ConfirmDialog({
  postTitle,
  onClose,
}: {
  postTitle: string;
  onClose: () => void;
}) {
  const { pending } = useFormStatus();
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const pendingRef = useRef(pending);
  const closeRef = useRef(onClose);
  const titleId = useId();
  const descriptionId = useId();

  // Keep the mount-only effect below reading current values.
  useEffect(() => {
    pendingRef.current = pending;
    closeRef.current = onClose;
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // The delete is already in flight, so don't let Escape imply it stopped.
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
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={(event) => event.stopPropagation()}
      >
        <p className="subpage-tag">DELETE STORY</p>
        <h2 id={titleId}>Delete this story?</h2>
        <p id={descriptionId} className="confirm-dialog-text">
          &ldquo;{postTitle}&rdquo; will be permanently removed from the blog.
          This cannot be undone.
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
          <SubmitButton
            className="confirm-delete-button"
            pendingLabel="DELETING…"
          >
            DELETE STORY
          </SubmitButton>
        </div>
      </div>
    </div>
  );
}
