import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { listings } from "@/lib/listings";
import { ListingCard } from "./listing-card";

function Row({ title, status }: { title: string; status: "sale" | "rent" }) {
  const items = listings.filter((l) => l.status === status).slice(0, 8);
  return (
    <div className="mt-10 first:mt-0">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-2xl font-extrabold text-navy sm:text-3xl">{title}</h2>
        <Link to={status === "sale" ? "/buy" : "/rent"} className="group flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-hover">
          View all <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((l) => <ListingCard key={l.id} l={l} />)}
      </div>
    </div>
  );
}

export function FeaturedListings() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
      <Row title="Featured Homes for Sale" status="sale" />
      <Row title="Popular Rentals" status="rent" />
    </section>
  );
}
