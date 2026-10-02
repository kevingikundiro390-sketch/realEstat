import { createFileRoute } from "@tanstack/react-router";
import { ListingsPage, parseFilters } from "@/components/listings-page";
import { fetchListings } from "@/lib/real-listings";

export const Route = createFileRoute("/buy")({
  validateSearch: parseFilters,
  loader: async () => fetchListings({ data: "sale" }),
  head: () => ({
    meta: [
      { title: "Homes for Sale | HomeBase" },
      { name: "description", content: "Search houses, condos, and townhomes for sale. Filter by price, beds, baths, and home type." },
      { property: "og:title", content: "Homes for Sale | HomeBase" },
      { property: "og:description", content: "Search houses, condos, and townhomes for sale on HomeBase." },
    ],
  }),
  component: () => <ListingsPage status="sale" search={Route.useSearch()} source={Route.useLoaderData()} />,
});
