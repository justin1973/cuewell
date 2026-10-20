"use client";

import { useFormStatus } from "react-dom";

// A submit button that shows a pending state while its form is submitting.
export function SubmitButton({
  children, className = "btn btn-primary sm", pendingText, style,
}: { children: React.ReactNode; className?: string; pendingText?: string; style?: React.CSSProperties }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending} aria-busy={pending} style={style}>
      {pending ? (
        <><span className="spin" aria-hidden="true" />{pendingText ?? "Working…"}</>
      ) : children}
    </button>
  );
}
