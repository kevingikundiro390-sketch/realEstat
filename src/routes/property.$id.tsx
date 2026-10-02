import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/property/$id")({
  beforeLoad: () => {
    throw redirect({ to: "/icons" });
  },
});
