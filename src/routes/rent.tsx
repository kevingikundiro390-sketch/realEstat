import { createFileRoute } from "@tanstack/react-router";
import { ListingsPage, parseFilters } from "@/components/listings-page";

export const Route = createFileRoute("/rent")({
  validateSearch: parseFilters,
  head: () => ({
    meta: [
      { title: "Homes & Apartments for Rent | HomeBase" },
      { name: "description", content: "Find apartments, houses, and condos for rent. Filter by monthly price, beds, and baths." },
      { property: "og:title", content: "Homes for Rent | HomeBase" },
      { property: "og:description", content: "Find apartments and houses for rent on HomeBase." },
    ],
  }),
  component: () => <ListingsPage status="rent" search={Route.useSearch()} />,
});
