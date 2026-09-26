import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth-form";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create Account | HomeBase" },
      { name: "description", content: "Create a free HomeBase account to save homes and track listings." },
      { property: "og:title", content: "Create Account | HomeBase" },
      { property: "og:description", content: "Create a free HomeBase account." },
    ],
  }),
  component: () => <AuthForm mode="signup" />,
});
