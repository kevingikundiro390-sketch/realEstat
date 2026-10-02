import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/buy")({
  beforeLoad: () => {
    throw redirect({ to: "/icons" });
  },
});
