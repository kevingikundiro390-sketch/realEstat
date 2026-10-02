import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/hero";
import { QuickActions } from "@/components/quick-actions";
import { FeaturedListings } from "@/components/featured-listings";
import { SiteFooter } from "@/components/site-footer";
import { fetchListings } from "@/lib/real-listings";

export const Route = createFileRoute("/")({
  loader: async () => ({
    sale: await fetchListings({ data: "sale" }),
    rent: await fetchListings({ data: "rent" }),
  }),
  head: () => ({
    meta: [
      { title: "HomeBase | Find your next home to buy or rent" },
      {
        name: "description",
        content:
          "Search homes for sale and apartments for rent in Kansas City and beyond. Browse featured listings, get a free valuation, or list a rental with HomeBase.",
      },
      { property: "og:title", content: "HomeBase | Find your next home to buy or rent" },
      {
        property: "og:description",
        content:
          "Search homes for sale and apartments for rent. Browse featured listings and get a free home valuation with HomeBase.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const data = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-background">
      <main>
        <Hero />
        <QuickActions />
        <FeaturedListings saleListings={data.sale} rentListings={data.rent} />
      </main>
      <SiteFooter />
    </div>
  );
}
