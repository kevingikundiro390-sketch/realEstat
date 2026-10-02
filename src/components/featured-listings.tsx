import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Listing } from "@/lib/listings";
import { ListingCard } from "./listing-card";

function Row({ title, status, items }: { title: string; status: "sale" | "rent"; items: Listing[] }) {
  const sliced = items.slice(0, 8);
  return (
    <div className="mt-12 first:mt-0">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-[2.05rem] font-extrabold leading-none tracking-[-0.05em] text-navy">{title}</h2>
        <Link to={status === "sale" ? "/buy" : "/rent"} className="group flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-hover">
          View all <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {sliced.map((l) => <ListingCard key={l.id} l={l} />)}
      </div>
    </div>
  );
}

export function FeaturedListings({ saleListings, rentListings }: { saleListings: Listing[]; rentListings: Listing[] }) {
  return (
    <section className="w-full px-4 pb-20 sm:px-8 lg:px-10">
      <Row title="Featured Listings" status="sale" items={saleListings} />
      <Row title="Popular Rentals" status="rent" items={rentListings} />
    </section>
  );
}
