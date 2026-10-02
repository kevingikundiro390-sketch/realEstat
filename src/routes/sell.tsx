import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/sell")({
  beforeLoad: () => {
    throw redirect({ to: "/icons" });
  },
});
