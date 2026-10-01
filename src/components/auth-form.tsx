import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Eye, EyeOff, Home, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";
import heroHouse from "@/assets/hero-house.jpg";
import { useAuth } from "@/lib/store";

const emailSchema = z
  .string()
  .trim()
  .min(3, "Enter your email address.")
  .max(255)
  .refine((value) => value.includes("@") && value.includes("."), {
    message: "Enter a valid email address.",
  });
const signInSchema = z.object({ email: emailSchema, password: z.string().min(1, "Enter your password.") });
const signUpSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name.").max(100),
  email: emailSchema,
  password: z.string().min(8, "Use at least 8 characters for your password.").max(100),
  confirmPassword: z.string().min(1, "Confirm your password."),
}).refine((values) => values.password === values.confirmPassword, {
  message: "Your passwords do not match.",
  path: ["confirmPassword"],
});
const resetSchema = z.object({
  password: z.string().min(8, "Use at least 8 characters for your password.").max(100),
  confirmPassword: z.string().min(1, "Confirm your password."),
}).refine((values) => values.password === values.confirmPassword, {
  message: "Your passwords do not match.",
  path: ["confirmPassword"],
});

type AuthMode = "signin" | "signup" | "reset-password";
type AuthFormValues = { name: string; email: string; password: string; confirmPassword: string };

export function AuthForm({ mode }: { mode: AuthMode }) {
  const auth = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successState, setSuccessState] = useState<{ title: string; detail: string } | null>(null);
  const [form, setForm] = useState<AuthFormValues>({ name: "", email: "", password: "", confirmPassword: "" });
  const isRecovery = mode === "reset-password" && auth.recoverySession;
  const isSignUp = mode === "signup";
  const isReset = mode === "reset-password";
  const title = isRecovery ? "Choose a new password" : isReset ? "Reset your password" : isSignUp ? "Make yourself at home." : "Welcome back.";
  const description = isRecovery
    ? "Choose a new password for your HomeBase account."
    : isReset
      ? "We’ll email you a secure link to get back into your account."
      : isSignUp
        ? "Save homes, keep your search in sync, and pick up where you left off."
        : "Sign in to see your saved homes and continue your search.";

  const showSuccessCard = Boolean(successState);

  const signInWithGoogle = async () => {
    setError("");
    setNotice("");
    if (!auth.isConfigured) {
      setError("Account services are not connected yet. Add the Supabase settings from the project setup guide.");
      return;
    }

    setSubmitting(true);
    try {
      await auth.signInWithGoogle();
    } catch (err) {
      setError((err as Error).message);
      setSubmitting(false);
    }
  };

  const signInWithX = async () => {
    setError("");
    setNotice("");
    if (!auth.isConfigured) {
      setError("Account services are not connected yet. Add the Supabase settings from the project setup guide.");
      return;
    }

    setSubmitting(true);
    try {
      await auth.signInWithX();
    } catch (err) {
      setError((err as Error).message);
      setSubmitting(false);
    }
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setSuccessState(null);
    if (!auth.isConfigured) {
      setError("Account services are not connected yet. Add the Supabase settings from the project setup guide.");
      return;
    }
    const parsed = isRecovery
      ? resetSchema.safeParse(form)
      : isSignUp
        ? signUpSchema.safeParse(form)
        : isReset
          ? emailSchema.safeParse(form.email)
          : signInSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check the information you entered.");
      return;
    }

    setSubmitting(true);
    try {
      if (isRecovery) {
        await auth.updatePassword(form.password);
        toast.success("Your password has been updated.");
        await navigate({ to: "/signin" });
      } else if (isReset) {
        await auth.sendPasswordReset(form.email);
        setNotice(`Password reset instructions were sent to ${form.email.trim()}.`);
        setForm((current) => ({ ...current, password: "", confirmPassword: "" }));
      } else if (isSignUp) {
        await auth.signUp(form.name, form.email, form.password);
        setSuccessState({ title: "Done", detail: "Your HomeBase account is ready. Redirecting…" });
        toast.success("Your HomeBase account is ready.");
        window.setTimeout(() => {
          void navigate({ to: "/" });
        }, 1200);
        return;
      } else {
        await auth.signIn(form.email, form.password);
        toast.success("Welcome back.");
        await navigate({ to: "/" });
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="fixed inset-0 overflow-hidden bg-[#eef3ff]">
      <div className="grid h-full w-full grid-cols-1 lg:grid-cols-[520px_minmax(0,1fr)]">
        <section className="flex h-full items-center justify-center bg-[#f5f7fb] px-5 py-6 sm:px-8 lg:px-10">
          <div className="w-full max-w-[420px]">
            <div className="mb-8">
              <Link to="/" className="inline-flex items-center gap-2.5 text-navy">
                <img src="/homebase-logo.svg" alt="" className="h-9 w-9" />
                <span className="font-display text-xl font-extrabold">HomeBase</span>
              </Link>
            </div>

            <h1 className="font-display text-3xl font-extrabold text-navy sm:text-4xl">{title}</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>

            {!auth.isConfigured && (
              <div role="status" className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-5 text-amber-950 shadow-sm">
                Real email accounts need the Supabase project settings. See <code className="font-semibold">supabase/README.md</code> to connect them.
              </div>
            )}
            {notice && <div role="status" className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-5 text-emerald-900 shadow-sm">{notice}</div>}

            {showSuccessCard && successState && (
              <div role="status" className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm shadow-emerald-100/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50">
                    <CheckCircle2 className="h-6 w-6 animate-[success-bounce_0.5s_ease-out]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-bold text-emerald-900">{successState.title}</p>
                    <p className="text-sm leading-5 text-emerald-700">{successState.detail}</p>
                  </div>
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-emerald-100">
                  <div className="h-full w-1/2 rounded-full bg-emerald-500 animate-[success-progress_1.3s_ease-in-out infinite]" />
                </div>
              </div>
            )}

            <div className="mt-8 rounded-t-[30px] rounded-br-[30px] border border-slate-200 bg-white p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:p-5">
              <form onSubmit={submit} className="space-y-5" noValidate>
                {isSignUp && (
                  <Field label="Full name" icon={<Home className="h-4 w-4" />}>
                    <input
                      autoComplete="name"
                      className={fieldClass}
                      name="name"
                      onChange={(event) => setForm({ ...form, name: event.target.value })}
                      placeholder="Your name"
                      required
                      value={form.name}
                    />
                  </Field>
                )}

                {!isRecovery && (
                  <Field label="Email address" icon={<Mail className="h-4 w-4" />}>
                    <input
                      autoCapitalize="none"
                      autoComplete="email"
                      className={fieldClass}
                      inputMode="email"
                      name="email"
                      onChange={(event) => setForm({ ...form, email: event.target.value })}
                      placeholder="you@example.com"
                      required
                      type="text"
                      value={form.email}
                    />
                  </Field>
                )}

                {!isReset && !isRecovery && (
                  <Field label="Password" icon={<LockKeyhole className="h-4 w-4" />}>
                    <div className="relative">
                      <input
                        autoComplete={isSignUp ? "new-password" : "current-password"}
                        className={`${fieldClass} pr-12`}
                        name="password"
                        onChange={(event) => setForm({ ...form, password: event.target.value })}
                        placeholder={isSignUp ? "At least 8 characters" : "Enter your password"}
                        required
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                      />
                      <button
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground transition-colors hover:text-navy"
                        onClick={() => setShowPassword((visible) => !visible)}
                        type="button"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </Field>
                )}

                {(isRecovery || isSignUp) && (
                  <Field label="Confirm password" icon={<ShieldCheck className="h-4 w-4" />}>
                    <input
                      autoComplete="new-password"
                      className={fieldClass}
                      name="confirmPassword"
                      onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
                      placeholder="Enter the password again"
                      required
                      type={showPassword ? "text" : "password"}
                      value={form.confirmPassword}
                    />
                  </Field>
                )}

                {mode === "signin" && (
                  <div className="-mt-2 flex justify-end">
                    <Link to="/reset-password" className="text-sm font-semibold text-brand transition-colors hover:text-brand-hover">Forgot password?</Link>
                  </div>
                )}

                {error && <p role="alert" className="text-sm leading-5 text-destructive">{error}</p>}
                <button
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3.5 text-sm font-semibold text-brand-foreground shadow-[0_14px_28px_rgba(74,99,255,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={submitting}
                  type="submit"
                >
                  {submitting ? "Please wait..." : isRecovery ? "Update password" : isReset ? "Send reset link" : isSignUp ? "Sign Up" : "Log In"}
                  {!submitting && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>

              {!isReset && !isRecovery && (
                <>
                  <div className="my-5 flex items-center gap-3" aria-hidden="true">
                    <span className="h-px flex-1 bg-border" />
                    <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">or</span>
                    <span className="h-px flex-1 bg-border" />
                  </div>
                  <div className="space-y-3">
                    <button
                      className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-brand/30 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={submitting}
                      onClick={() => void signInWithGoogle()}
                      type="button"
                    >
                      <GoogleMark />
                      Continue with Google
                    </button>
                    <button
                      className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-brand/30 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={submitting}
                      onClick={() => void signInWithX()}
                      type="button"
                    >
                      <XMark />
                      Continue with X
                    </button>
                  </div>
                </>
              )}
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {isSignUp ? (
                <>Already have an account? <Link to="/signin" className="font-semibold text-brand hover:text-brand-hover">Log in</Link></>
              ) : isReset ? (
                <>Remember your password? <Link to="/signin" className="font-semibold text-brand hover:text-brand-hover">Log in</Link></>
              ) : (
                <>New to HomeBase? <Link to="/signup" className="font-semibold text-brand hover:text-brand-hover">Sign up</Link></>
              )}
            </p>
          </div>
        </section>

        <aside className="relative h-full overflow-hidden">
          <img src={heroHouse} alt="A welcoming home surrounded by trees" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.14),rgba(15,23,42,0.58))]" />
        </aside>
      </div>
    </main>
  );
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 shrink-0" viewBox="0 0 48 48">
      <path fill="#4285F4" d="M43.6 20.1H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.6 4.8C41.9 34.8 44 29.8 44 24c0-1.3-.1-2.6-.4-3.9Z" />
      <path fill="#34A853" d="M24 44c5.3 0 10-1.9 13.3-5.2l-6.6-4.8c-1.8 1.2-4.1 2-6.7 2-5.2 0-9.6-3.3-11.3-8l-6.6 5.1C9.5 39.6 16.2 44 24 44Z" />
      <path fill="#FBBC05" d="M12.7 28A12 12 0 0 1 12 24c0-1.4.2-2.7.7-4l-6.6-5A20 20 0 0 0 4 24c0 2.9.6 5.7 1.8 8.1l6.9-4.1Z" />
      <path fill="#EA4335" d="M24 12c3.1 0 5.8 1.1 8 3.1l6-6C34.3 5.6 29.6 4 24 4 16.2 4 9.5 8.4 5.8 15l6.9 5C14.4 15.3 18.8 12 24 12Z" />
    </svg>
  );
}

function XMark() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
      <path fill="currentColor" d="M18.9 2.5h2.9l-6.4 7.3 7.5 11.7H17l-4.7-7.3-6.4 7.3H3l6.9-7.9L2.7 2.5h6l4.2 6.6 6-6.6Zm-1 17h1.6L7.8 4.4H6.1l11.8 15.1Z" />
    </svg>
  );
}

const fieldClass = "w-full rounded-xl border border-slate-200 bg-slate-50/80 py-3 pl-10 pr-3 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10";

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block space-y-2 text-sm font-semibold text-navy">
      <span>{label}</span>
      <span className="relative block">
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">{icon}</span>
        {children}
      </span>
    </label>
  );
}
