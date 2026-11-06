"use client";

import { startTransition, useCallback, type FormEvent } from "react";

/**
 * React 19 resets uncontrolled fields after a `<form action={fn}>` submission,
 * which wipes what the user typed when the server returns validation errors.
 * Submitting through onSubmit + startTransition keeps the entered values while
 * still driving useActionState (pending state, returned errors, redirects).
 */
export function usePreservedFormAction(
  formAction: (formData: FormData) => void,
) {
  return useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const submitter = (event.nativeEvent as SubmitEvent).submitter;
      const formData = new FormData(event.currentTarget, submitter);

      startTransition(() => {
        formAction(formData);
      });
    },
    [formAction],
  );
}
