import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth-form";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset Password | HomeBase" },
      { name: "description", content: "Reset your HomeBase account password." },
    ],
  }),
  component: () => <AuthForm mode="reset-password" />,
});