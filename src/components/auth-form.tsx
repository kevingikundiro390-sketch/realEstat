import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "@/lib/store";

const input = "w-full rounded-md border border-border px-3 py-2.5 text-sm outline-none focus:border-brand";
const schema = z.object({
  name: z.string().trim().min(1, "Enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
});

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const auth = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const parsed = (mode === "signup" ? schema : schema.omit({ name: true })).safeParse(form);
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Invalid input");
    try {
      if (mode === "signup") auth.signUp(form.name, form.email, form.password);
      else auth.signIn(form.email, form.password);
      toast.success(mode === "signup" ? "Account created — welcome!" : "Welcome back!");
      navigate({ to: "/" });
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-3xl font-extrabold text-navy">{mode === "signup" ? "Create your account" : "Sign in"}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{mode === "signup" ? "Save homes and get alerts on new listings." : "Welcome back to HomeBase."}</p>
      <form onSubmit={submit} className="mt-6 space-y-3">
        {mode === "signup" && <input placeholder="Full name" className={input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />}
        <input type="email" placeholder="Email" className={input} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" className={input} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button className="w-full rounded-md bg-brand py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover">{mode === "signup" ? "Create Account" : "Sign In"}</button>
      </form>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        {mode === "signup" ? <>Already have an account? <Link to="/signin" className="font-semibold text-brand">Sign in</Link></> : <>New to HomeBase? <Link to="/signup" className="font-semibold text-brand">Create an account</Link></>}
      </p>
    </div>
  );
}
