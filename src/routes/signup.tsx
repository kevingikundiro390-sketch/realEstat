import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth-form";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up | HomeBase" },
      { name: "description", content: "Create a HomeBase account to save homes and continue your search on any device." },
      { property: "og:title", content: "Sign Up | HomeBase" },
      { property: "og:description", content: "Create a HomeBase account and keep your home search in sync." },
    ],
  }),
  component: () => <AuthForm mode="signup" />,
});
