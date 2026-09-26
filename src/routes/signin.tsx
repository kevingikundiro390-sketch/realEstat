import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth-form";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign In | HomeBase" },
      { name: "description", content: "Sign in to HomeBase to see your saved homes." },
      { property: "og:title", content: "Sign In | HomeBase" },
      { property: "og:description", content: "Sign in to HomeBase to see your saved homes." },
    ],
  }),
  component: () => <AuthForm mode="signin" />,
});
