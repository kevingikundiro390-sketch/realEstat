import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";
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
      ? "We'll email you a secure link to get back into your account."
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
    <main className="fixed inset-0 overflow-hidden bg-[#f4f7fc]">
      {/* Visual background — desktop only */}
      <div className="auth-visual absolute inset-0 z-0 hidden overflow-hidden isolate bg-[#dbe5f2] lg:block">
        <img src="https://media.base44.com/images/public/6abf1580bf20b5ff151ca7c7/592a16bc8_generated_83da3646.jpg" alt="A welcoming home surrounded by trees" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(155deg,rgba(14,39,78,0.02)_15%,rgba(14,39,78,0.30)_100%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 grid h-full w-full grid-cols-1 lg:grid-cols-[480px_minmax(0,1fr)] lg:gap-14 lg:p-16">
        <section className="flex h-full items-center justify-center px-5 py-6 sm:px-8 lg:px-0 lg:py-0">
          <div className="auth-card w-full max-w-[470px] rounded-[24px] border border-[#b8cfee] bg-white px-[42px] pb-10 pt-12">
            {/* Brand */}
            <Link to="/" className="mb-[42px] flex items-center gap-3 text-[21px] font-[750] tracking-[-0.04em] text-[#173c78]">
              <span className="grid h-10 w-10 place-items-center rounded-[12px] bg-[#edf3ff]">
                <img src="/homebase-logo.svg" alt="" className="h-[29px] w-[29px] object-contain" />
              </span>
              HomeBase
            </Link>

            {/* Title */}
            <h1 className="m-0 text-[40px] font-extrabold leading-[1.12] tracking-[-0.045em] text-[#123f91]">{title}</h1>
            <p className="mb-8 mt-3.5 text-base font-medium leading-[1.65] text-[#3f5f8d]">{description}</p>

            {/* Not-configured warning */}
            {!auth.isConfigured && (
              <div role="status" className="mb-5 rounded-[11px] border border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-5 text-amber-950">
                Real email accounts need the Supabase project settings. See <code className="font-semibold">supabase/README.md</code> to connect them.
              </div>
            )}
            {notice && <div role="status" className="mb-5 rounded-[11px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-5 text-emerald-900">{notice}</div>}

            {/* Success card */}
            {showSuccessCard && successState && (
              <div role="status" className="mb-5 rounded-[11px] border border-emerald-200 bg-emerald-50 p-4 shadow-[0_8px_20px_rgba(16,185,129,0.1)]">
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
                  <div className="h-full w-1/2 rounded-full bg-emerald-500 animate-[success-progress_1.3s_ease-in-out_infinite]" />
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={submit} className="flex flex-col gap-[19px]" noValidate>
              {isSignUp && (
                <Field label="Full name">
                  <input
                    autoComplete="name"
                    className={inputClass}
                    name="name"
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    placeholder="Your name"
                    required
                    value={form.name}
                  />
                </Field>
              )}

              {!isRecovery && (
                <Field label="Email address">
                  <input
                    autoCapitalize="none"
                    autoComplete="email"
                    className={inputClass}
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
                <Field label="Password">
                  <div className="relative">
                    <input
                      autoComplete={isSignUp ? "new-password" : "current-password"}
                      className={`${inputClass} pr-12`}
                      name="password"
                      onChange={(event) => setForm({ ...form, password: event.target.value })}
                      placeholder={isSignUp ? "At least 8 characters" : "Enter your password"}
                      required
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                    />
                    <button
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#9aa9bf] transition-colors duration-[180ms] hover:text-[#376ed1]"
                      onClick={() => setShowPassword((visible) => !visible)}
                      type="button"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </Field>
              )}

              {(isRecovery || isSignUp) && (
                <Field label="Confirm password">
                  <input
                    autoComplete="new-password"
                    className={inputClass}
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
                <div className="-mt-1 flex justify-end">
                  <Link to="/reset-password" className="text-sm font-[650] text-[#245ac2] no-underline transition-colors duration-[180ms] hover:text-[#173c78]">Forgot password?</Link>
                </div>
              )}

              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
              <button
                className="auth-btn flex h-[54px] w-full items-center justify-center gap-2 rounded-[11px] bg-[#245ac2] text-[15px] font-[650] text-white shadow-[0_9px_22px_rgba(36,90,194,0.24)] transition-[background-color,box-shadow,transform] duration-[180ms] hover:-translate-y-px hover:bg-[#194da9] hover:shadow-[0_12px_25px_rgba(36,90,194,0.28)] active:translate-y-0 active:shadow-[0_4px_10px_rgba(36,90,194,0.16)] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={submitting}
                type="submit"
              >
                {submitting ? "Please wait..." : isRecovery ? "Update password" : isReset ? "Send reset link" : isSignUp ? "Sign Up" : "Log In"}
                {!submitting && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            {/* Divider + Socials */}
            {!isReset && !isRecovery && (
              <>
                <div className="my-6 flex items-center gap-3.5 text-xs uppercase tracking-[0.12em] text-[#8796aa]">
                  <span className="h-px flex-1 bg-[#e2e8f1]" />
                  or
                  <span className="h-px flex-1 bg-[#e2e8f1]" />
                </div>
                <div className="flex flex-col gap-[11px]">
                  <button
                    className="auth-btn flex h-12 w-full items-center justify-center gap-[11px] rounded-[11px] border border-[#dce4ef] bg-white text-sm font-[550] text-[#344b6b] shadow-[0_2px_5px_rgba(25,51,85,0.03)] transition-[transform,background-color,border-color,box-shadow] duration-[180ms] hover:-translate-y-0.5 hover:border-[#b9cbea] hover:bg-[#f7f9fd] hover:shadow-[0_7px_15px_rgba(25,51,85,0.08)] active:translate-y-0 active:shadow-[0_2px_5px_rgba(25,51,85,0.04)] disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={submitting}
                    onClick={() => void signInWithGoogle()}
                    type="button"
                  >
                    <GoogleMark />
                    Continue with Google
                  </button>
                  <button
                    className="auth-btn flex h-12 w-full items-center justify-center gap-[11px] rounded-[11px] border border-[#dce4ef] bg-white text-sm font-[550] text-[#344b6b] shadow-[0_2px_5px_rgba(25,51,85,0.03)] transition-[transform,background-color,border-color,box-shadow] duration-[180ms] hover:-translate-y-0.5 hover:border-[#b9cbea] hover:bg-[#f7f9fd] hover:shadow-[0_7px_15px_rgba(25,51,85,0.08)] active:translate-y-0 active:shadow-[0_2px_5px_rgba(25,51,85,0.04)] disabled:cursor-not-allowed disabled:opacity-60"
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

            {/* Foot */}
            <p className="mt-[27px] text-center text-sm leading-[1.6] text-[#71819a]">
              {isSignUp ? (
                <>Already have an account? <Link to="/signin" className="font-bold text-[#245ac2] no-underline transition-colors duration-[180ms] hover:text-[#173c78]">Log in</Link></>
              ) : isReset ? (
                <>Remember your password? <Link to="/signin" className="font-bold text-[#245ac2] no-underline transition-colors duration-[180ms] hover:text-[#173c78]">Log in</Link></>
              ) : (
                <>New to HomeBase? <Link to="/signup" className="font-bold text-[#245ac2] no-underline transition-colors duration-[180ms] hover:text-[#173c78]">Sign up</Link></>
              )}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" className="h-[18px] w-[18px] shrink-0" viewBox="0 0 48 48">
      <path fill="#4285F4" d="M43.6 20.1H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.6 4.8C41.9 34.8 44 29.8 44 24c0-1.3-.1-2.6-.4-3.9Z" />
      <path fill="#34A853" d="M24 44c5.3 0 10-1.9 13.3-5.2l-6.6-4.8c-1.8 1.2-4.1 2-6.7 2-5.2 0-9.6-3.3-11.3-8l-6.6 5.1C9.5 39.6 16.2 44 24 44Z" />
      <path fill="#FBBC05" d="M12.7 28A12 12 0 0 1 12 24c0-1.4.2-2.7.7-4l-6.6-5A20 20 0 0 0 4 24c0 2.9.6 5.7 1.8 8.1l6.9-4.1Z" />
      <path fill="#EA4335" d="M24 12c3.1 0 5.8 1.1 8 3.1l6-6C34.3 5.6 29.6 4 24 4 16.2 4 9.5 8.4 5.8 15l6.9 5C14.4 15.3 18.8 12 24 12Z" />
    </svg>
  );
}

function XMark() {
  return (
    <svg aria-hidden="true" className="h-[18px] w-[18px] shrink-0" viewBox="0 0 24 24">
      <path fill="currentColor" d="M18.9 2.5h2.9l-6.4 7.3 7.5 11.7H17l-4.7-7.3-6.4 7.3H3l6.9-7.9L2.7 2.5h6l4.2 6.6 6-6.6Zm-1 17h1.6L7.8 4.4H6.1l11.8 15.1Z" />
    </svg>
  );
}

const inputClass = "w-full h-[52px] rounded-[11px] border border-[#d8e1ee] bg-[#f8faff] px-[15px] text-[15px] font-normal text-[#172b4d] outline-none transition-[border-color,background-color,box-shadow] duration-[180ms] placeholder:text-[#9aa9bf] focus-visible:border-[#376ed1] focus-visible:bg-white focus-visible:shadow-[0_0_0_4px_rgba(55,110,209,0.14)]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2 text-sm font-[650] text-[#203b62]">
      <span>{label}</span>
      {children}
    </label>
  );
}
