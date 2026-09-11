"use client";

import { useId, useState } from "react";

interface PasswordFieldProps {
  label?: string;
  autoComplete?: string;
}

export default function PasswordField({
  label = "Password",
  autoComplete = "current-password",
}: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);
  const id = useId();

  return (
    // The toggle lives outside the <label> so the markup stays valid — a
    // <button> inside a <label> would be a second labelable element.
    <div className="password-field-wrap">
      <label htmlFor={id}>{label}</label>
      <span className="password-field">
        <input
          id={id}
          name="password"
          type={isVisible ? "text" : "password"}
          required
          autoComplete={autoComplete}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setIsVisible((visible) => !visible)}
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
          aria-controls={id}
        >
          {isVisible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </span>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
      <circle cx="12" cy="12" r="3" />
      <line x1="4" y1="20" x2="20" y2="4" />
    </svg>
  );
}
