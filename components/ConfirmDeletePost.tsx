"use client";

import { useEffect, useId, useRef, useState } from "react";

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
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;

      // Keep focus on the two buttons while the dialog is open.
      const focusable =
        dialogRef.current?.querySelectorAll<HTMLButtonElement>("button");
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
  }, [isOpen]);

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

      {isOpen && (
        <div className="video-modal-backdrop" onClick={close} role="presentation">
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
                onClick={close}
              >
                CANCEL
              </button>
              <button type="submit" className="confirm-delete-button">
                DELETE STORY
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
