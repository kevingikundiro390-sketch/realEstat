import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { listings } from "@/lib/listings";
import { ListingCard } from "./listing-card";

function Row({ title, status }: { title: string; status: "sale" | "rent" }) {
  const items = listings.filter((l) => l.status === status).slice(0, 8);
  return (
    <div className="mt-14 first:mt-0 sm:mt-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{status === "sale" ? "For sale" : "For rent"}</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold leading-none tracking-[-0.05em] text-navy sm:text-4xl">{title}</h2>
        </div>
        <Link to={status === "sale" ? "/buy" : "/rent"} className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy transition-all hover:border-brand/30 hover:text-brand">
          View all <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((l) => <ListingCard key={l.id} l={l} />)}
      </div>
    </div>
  );
}

export function FeaturedListings() {
  return (
    <section className="w-full bg-white px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-10 max-w-2xl sm:mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">A little inspiration</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-[-0.05em] text-navy sm:text-5xl">Good homes make room for more.</h2>
          <p className="mt-3 text-base leading-7 text-slate-500">Explore places with space for the moments that matter.</p>
        </div>
        <Row title="Featured homes" status="sale" />
        <Row title="Popular rentals" status="rent" />
      </div>
    </section>
  );
}
