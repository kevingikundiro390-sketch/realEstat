import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/rent")({
  beforeLoad: () => {
    throw redirect({ to: "/icons" });
  },
});
