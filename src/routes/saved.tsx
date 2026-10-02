import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { ListingCard } from "@/components/listing-card";
import { useFavorites } from "@/lib/store";
import { fetchListings } from "@/lib/real-listings";

export const Route = createFileRoute("/saved")({
  loader: async () => ({
    sale: await fetchListings({ data: "sale" }),
    rent: await fetchListings({ data: "rent" }),
  }),
  head: () => ({
    meta: [
      { title: "Saved Homes | HomeBase" },
      { name: "description", content: "Your saved homes and rentals on HomeBase." },
      { property: "og:title", content: "Saved Homes | HomeBase" },
      { property: "og:description", content: "Your saved homes and rentals on HomeBase." },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const { favorites } = useFavorites();
  const data = Route.useLoaderData();
  const allListings = [...data.sale, ...data.rent];
  const items = allListings.filter((l) => favorites.includes(l.id));
  return (
    <div className="w-full px-4 py-8 sm:px-8 lg:px-10">
      <h1 className="font-display text-3xl font-extrabold text-navy">Saved homes</h1>
      <p className="mt-1 text-sm text-muted-foreground">{items.length} saved</p>
      {items.length ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{items.map((l) => <ListingCard key={l.id} l={l} />)}</div>
      ) : (
        <div className="mt-8 rounded-lg border border-dashed border-border p-12 text-center">
          <Heart className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-semibold text-navy">No saved homes yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Tap the heart on any listing to save it here.</p>
          <div className="mt-4 flex justify-center gap-3">
            <Link to="/buy" className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground">Browse for sale</Link>
            <Link to="/rent" className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-navy">Browse rentals</Link>
          </div>
        </div>
      )}
    </div>
  );
}
