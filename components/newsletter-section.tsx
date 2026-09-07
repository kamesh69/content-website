"use client";

import { useState, type FormEvent } from "react";

import { Reveal } from "@/components/reveal";
import { newsletter as fallbackNewsletter } from "@/lib/content/site";

import styles from "./newsletter-section.module.scss";

type FormState = "idle" | "loading" | "success" | "error";

type NewsletterSectionProps = {
  newsletter?: typeof fallbackNewsletter;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function subscribeEmail(email: string): Promise<string> {
  const res = await fetch("/api/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Subscription failed");
  }

  return data.message || "You’re subscribed. Welcome to the desk notes.";
}

export function NewsletterSection({ newsletter = fallbackNewsletter }: NewsletterSectionProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      setState("error");
      setMessage("Please enter your email address.");
      return;
    }

    if (!isValidEmail(email.trim())) {
      setState("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setState("loading");
    setMessage("");

    try {
      const successMsg = await subscribeEmail(email.trim());
      setState("success");
      setMessage(successMsg);
      setEmail("");
    } catch (err: unknown) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <section className={styles.section} id="contact" aria-labelledby="newsletter-heading">
      <div className={`section-shell ${styles.inner}`}>
        <Reveal className={styles.copy}>
          <h2 id="newsletter-heading">{newsletter.heading}</h2>
          <p>{newsletter.description}</p>
        </Reveal>

        <Reveal className={styles.formWrap} delay={80}>
          <form className={styles.form} onSubmit={onSubmit} noValidate>
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder={newsletter.placeholder}
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (state === "error" || state === "success") {
                  setState("idle");
                  setMessage("");
                }
              }}
              aria-invalid={state === "error"}
              aria-describedby={message ? "newsletter-status" : undefined}
              disabled={state === "loading"}
            />
            <button type="submit" disabled={state === "loading"}>
              {state === "loading" ? "Subscribing…" : newsletter.cta}
            </button>
          </form>
          {message ? (
            <p
              id="newsletter-status"
              className={`${styles.status} ${state === "success" ? styles.success : styles.error}`}
              role="status"
            >
              {message}
            </p>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
