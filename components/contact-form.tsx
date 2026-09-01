"use client";

import { useState, type FormEvent } from "react";

import { submitContactMessage } from "@/lib/contact";

import styles from "./contact-form.module.scss";

type FormValues = {
  name: string;
  email: string;
  company: string;
  lookingFor: string;
  message: string;
};

type FormErrors = Partial<Pick<FormValues, "name" | "email" | "message">>;

type FormStatus = "idle" | "submitting" | "success" | "error";

const initialValues: FormValues = {
  name: "",
  email: "",
  company: "",
  lookingFor: "",
  message: "",
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Please enter your name.";
  }

  if (!values.email.trim()) {
    errors.email = "Please enter your email.";
  } else if (!isValidEmail(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!values.message.trim()) {
    errors.message = "Please add a short message.";
  }

  return errors;
}

export function ContactForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const updateField = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
    if (status === "success" || status === "error") {
      setStatus("idle");
      setStatusMessage("");
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      setStatusMessage("Please check the highlighted fields.");
      return;
    }

    setStatus("submitting");
    setStatusMessage("");

    try {
      await submitContactMessage({
        name: values.name.trim(),
        email: values.email.trim(),
        company: values.company.trim() || undefined,
        lookingFor: values.lookingFor.trim() || undefined,
        message: values.message.trim(),
      });
      setStatus("success");
      setStatusMessage("Message sent. I’ll get back to you soon.");
      setValues(initialValues);
    } catch {
      setStatus("error");
      setStatusMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <form
      id="contact-form"
      className={styles.form}
      onSubmit={onSubmit}
      noValidate
      aria-describedby={statusMessage ? "contact-form-status" : undefined}
    >
      <div className={styles.grid}>
        <Field
          id="contact-name"
          label="Name"
          value={values.name}
          autoComplete="name"
          error={errors.name}
          disabled={status === "submitting"}
          onChange={(value) => updateField("name", value)}
        />
        <Field
          id="contact-email"
          label="Email"
          type="email"
          value={values.email}
          autoComplete="email"
          error={errors.email}
          disabled={status === "submitting"}
          onChange={(value) => updateField("email", value)}
        />
        <Field
          id="contact-company"
          label="Company / Brand"
          value={values.company}
          autoComplete="organization"
          disabled={status === "submitting"}
          onChange={(value) => updateField("company", value)}
        />
        <Field
          id="contact-looking-for"
          label="What are you looking for?"
          value={values.lookingFor}
          disabled={status === "submitting"}
          onChange={(value) => updateField("lookingFor", value)}
        />
      </div>

      <Field
        id="contact-message"
        label="Message"
        value={values.message}
        multiline
        error={errors.message}
        disabled={status === "submitting"}
        onChange={(value) => updateField("message", value)}
      />

      <button type="submit" className={styles.submit} disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>

      {statusMessage ? (
        <p
          id="contact-form-status"
          className={`${styles.status} ${status === "success" ? styles.success : styles.error}`}
          role="status"
        >
          {statusMessage}
        </p>
      ) : null}
    </form>
  );
}

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  multiline?: boolean;
  error?: string;
  disabled?: boolean;
};

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  multiline = false,
  error,
  disabled,
}: FieldProps) {
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div className={`${styles.field} ${error ? styles.invalid : ""}`}>
      <label htmlFor={id}>{label}</label>
      {multiline ? (
        <textarea
          id={id}
          name={id}
          rows={4}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          disabled={disabled}
          required={id === "contact-message"}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          disabled={disabled}
          required={id === "contact-name" || id === "contact-email"}
        />
      )}
      {error ? (
        <p id={`${id}-error`} className={styles.fieldError}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
