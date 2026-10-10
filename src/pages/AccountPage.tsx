import { useState, type FormEvent } from "react";
import Button from "../components/Button";

interface AccountFormErrors {
  name?: string;
  email?: string;
  password?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidEmail = (email: string): boolean => EMAIL_PATTERN.test(email);

export default function AccountPage() {
  const [signInErrors, setSignInErrors] = useState<AccountFormErrors>({});
  const [createAccountErrors, setCreateAccountErrors] = useState<AccountFormErrors>({});
  const [signInMessage, setSignInMessage] = useState("");
  const [createAccountMessage, setCreateAccountMessage] = useState("");

  const handleSignIn = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSignInMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const errors: AccountFormErrors = {};

    if (!email) errors.email = "Enter your email address.";
    else if (!isValidEmail(email)) errors.email = "Enter a valid email address.";
    if (!password) errors.password = "Enter your password.";

    setSignInErrors(errors);
    if (Object.keys(errors).length > 0) return;

    form.reset();
    setSignInMessage(
      "Your details passed local validation, but you are not signed in. Account services are not connected.",
    );
  };

  const handleCreateAccount = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreateAccountMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const errors: AccountFormErrors = {};

    if (!name) errors.name = "Enter your name.";
    if (!email) errors.email = "Enter your email address.";
    else if (!isValidEmail(email)) errors.email = "Enter a valid email address.";
    if (!password) errors.password = "Create a password.";
    else if (password.length < 8) errors.password = "Use at least 8 characters for your password.";

    setCreateAccountErrors(errors);
    if (Object.keys(errors).length > 0) return;

    form.reset();
    setCreateAccountMessage(
      "Your details passed local validation, but no account was created. Account services are not connected.",
    );
  };

  return (
    <section className="layout-section bg-[var(--color-background)] text-[var(--color-text-primary)]">
      <div className="page-container">
        <header className="mb-10 max-w-3xl border-b border-[var(--color-border-subtle)] pb-8 sm:mb-12 sm:pb-10">
          <p className="type-label mb-4">ACCOUNT ACCESS</p>
          <h1 className="type-display max-w-[12ch]">YOUR ACCOUNT</h1>
          <p className="type-body mt-4 max-w-2xl text-[var(--color-text-secondary)]">
            Sign in or prepare your account details for Talha Garments.
          </p>
          <p
            id="account-service-note"
            className="mt-5 border-l-2 border-[var(--color-accent)] bg-[var(--color-surface)] px-4 py-3 text-sm leading-relaxed text-[var(--color-text-secondary)]"
            role="note"
          >
            Account services are not connected to a backend. These forms only validate your input in this browser;
            they do not sign you in or create an account. Credentials are not sent to a server or saved in browser storage.
          </p>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-8">
          <section
            className="border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 sm:p-8"
            aria-labelledby="sign-in-heading"
          >
            <p className="type-label mb-3">RETURNING CUSTOMER</p>
            <h2 id="sign-in-heading" className="type-section">
              Sign In
            </h2>
            <form className="mt-6 flex flex-col gap-5" noValidate onSubmit={handleSignIn}>
              <div>
                <label className="type-label" htmlFor="sign-in-email">
                  Email
                </label>
                <input
                  id="sign-in-email"
                  className="mt-2 min-h-11 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
                  type="email"
                  name="email"
                  autoComplete="username"
                  required
                  aria-invalid={Boolean(signInErrors.email)}
                  aria-describedby={`account-service-note${signInErrors.email ? " sign-in-email-error" : ""}`}
                />
                {signInErrors.email && (
                  <p id="sign-in-email-error" className="mt-2 text-sm text-rose-300" role="alert">
                    {signInErrors.email}
                  </p>
                )}
              </div>
              <div>
                <label className="type-label" htmlFor="sign-in-password">
                  Password
                </label>
                <input
                  id="sign-in-password"
                  className="mt-2 min-h-11 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  aria-invalid={Boolean(signInErrors.password)}
                  aria-describedby={`account-service-note${signInErrors.password ? " sign-in-password-error" : ""}`}
                />
                {signInErrors.password && (
                  <p id="sign-in-password-error" className="mt-2 text-sm text-rose-300" role="alert">
                    {signInErrors.password}
                  </p>
                )}
              </div>
              <Button className="w-full sm:w-auto" type="submit">
                Sign In
              </Button>
              {signInMessage && (
                <p className="border border-[var(--color-border)] px-4 py-3 text-sm leading-relaxed" role="status" aria-live="polite">
                  {signInMessage}
                </p>
              )}
            </form>
          </section>

          <section
            className="border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 sm:p-8"
            aria-labelledby="create-account-heading"
          >
            <p className="type-label mb-3">NEW CUSTOMER</p>
            <h2 id="create-account-heading" className="type-section">
              Create Account
            </h2>
            <form className="mt-6 flex flex-col gap-5" noValidate onSubmit={handleCreateAccount}>
              <div>
                <label className="type-label" htmlFor="create-account-name">
                  Name
                </label>
                <input
                  id="create-account-name"
                  className="mt-2 min-h-11 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  aria-invalid={Boolean(createAccountErrors.name)}
                  aria-describedby={`account-service-note${createAccountErrors.name ? " create-account-name-error" : ""}`}
                />
                {createAccountErrors.name && (
                  <p id="create-account-name-error" className="mt-2 text-sm text-rose-300" role="alert">
                    {createAccountErrors.name}
                  </p>
                )}
              </div>
              <div>
                <label className="type-label" htmlFor="create-account-email">
                  Email
                </label>
                <input
                  id="create-account-email"
                  className="mt-2 min-h-11 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  aria-invalid={Boolean(createAccountErrors.email)}
                  aria-describedby={`account-service-note${createAccountErrors.email ? " create-account-email-error" : ""}`}
                />
                {createAccountErrors.email && (
                  <p id="create-account-email-error" className="mt-2 text-sm text-rose-300" role="alert">
                    {createAccountErrors.email}
                  </p>
                )}
              </div>
              <div>
                <label className="type-label" htmlFor="create-account-password">
                  Password
                </label>
                <input
                  id="create-account-password"
                  className="mt-2 min-h-11 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  aria-invalid={Boolean(createAccountErrors.password)}
                  aria-describedby={`account-service-note${createAccountErrors.password ? " create-account-password-error" : ""}`}
                />
                {createAccountErrors.password && (
                  <p id="create-account-password-error" className="mt-2 text-sm text-rose-300" role="alert">
                    {createAccountErrors.password}
                  </p>
                )}
              </div>
              <Button className="w-full sm:w-auto" type="submit">
                Create Account
              </Button>
              {createAccountMessage && (
                <p className="border border-[var(--color-border)] px-4 py-3 text-sm leading-relaxed" role="status" aria-live="polite">
                  {createAccountMessage}
                </p>
              )}
            </form>
          </section>
        </div>
      </div>
    </section>
  );
}
