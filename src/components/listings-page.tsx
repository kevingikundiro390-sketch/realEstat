import { useNavigate } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { filterListings, priceRanges, type Filters, type ListingStatus } from "@/lib/listings";
import { ListingCard } from "./listing-card";

export function parseFilters(s: Record<string, unknown>): Filters {
  const num = (v: unknown) => (v === undefined || v === "" || isNaN(Number(v)) ? undefined : Number(v));
  return {
    q: typeof s.q === "string" ? s.q : s.q !== undefined ? String(s.q) : undefined,
    minPrice: num(s.minPrice), maxPrice: num(s.maxPrice), beds: num(s.beds), baths: num(s.baths),
    type: typeof s.type === "string" ? s.type : undefined,
    sort: typeof s.sort === "string" ? s.sort : undefined,
  };
}

const sel = "rounded-md border border-border bg-background px-3 py-2 text-sm text-navy outline-none focus:border-brand";

export function ListingsPage({ status, search }: { status: ListingStatus; search: Filters }) {
  const navigate = useNavigate();
  const [q, setQ] = useState(search.q ?? "");
  const [showFilters, setShowFilters] = useState(false);
  const results = filterListings(status, search);
  const update = (patch: Partial<Filters>) =>
    navigate({ to: status === "sale" ? "/buy" : "/rent", search: { ...search, ...patch } as never, replace: true });
  const priceIdx = Math.max(0, priceRanges[status].findIndex((p) => p.min === search.minPrice && p.max === search.maxPrice));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold text-navy">{status === "sale" ? "Homes for sale" : "Homes for rent"}</h1>
      <form onSubmit={(e) => { e.preventDefault(); update({ q: q || undefined }); }} className="mt-5 flex gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-md border border-border px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="City, ZIP, neighborhood, or address" className="w-full bg-transparent py-2.5 text-sm outline-none" />
        </div>
        <button className="rounded-md bg-brand px-5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover">Search</button>
        <button type="button" onClick={() => setShowFilters((v) => !v)} className="flex items-center gap-1 rounded-md border border-border px-3 text-sm text-navy md:hidden">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
      </form>

      <div className={`${showFilters ? "grid" : "hidden"} mt-3 grid-cols-2 gap-2 md:flex md:flex-wrap`}>
        <select aria-label="Price" className={sel} value={priceIdx} onChange={(e) => { const p = priceRanges[status][+e.target.value]; update({ minPrice: p.min, maxPrice: p.max }); }}>
          {priceRanges[status].map((p, i) => <option key={p.label} value={i}>{p.label}</option>)}
        </select>
        <select aria-label="Beds" className={sel} value={search.beds ?? 0} onChange={(e) => update({ beds: +e.target.value || undefined })}>
          <option value={0}>Any beds</option>{[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+ beds</option>)}
        </select>
        <select aria-label="Baths" className={sel} value={search.baths ?? 0} onChange={(e) => update({ baths: +e.target.value || undefined })}>
          <option value={0}>Any baths</option>{[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}+ baths</option>)}
        </select>
        <select aria-label="Home type" className={sel} value={search.type ?? "any"} onChange={(e) => update({ type: e.target.value === "any" ? undefined : e.target.value })}>
          <option value="any">All home types</option>{["House", "Condo", "Townhouse", "Apartment"].map((t) => <option key={t}>{t}</option>)}
        </select>
        <select aria-label="Sort" className={sel} value={search.sort ?? "newest"} onChange={(e) => update({ sort: e.target.value })}>
          <option value="newest">Newest</option><option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option><option value="sqft">Largest</option><option value="beds">Most bedrooms</option>
        </select>
        <button type="button" onClick={() => { setQ(""); navigate({ to: status === "sale" ? "/buy" : "/rent", search: {} as never }); }} className="rounded-md px-3 py-2 text-sm font-semibold text-brand hover:bg-surface">
          Reset
        </button>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">{results.length} {results.length === 1 ? "home" : "homes"} found</p>
      {results.length ? (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((l) => <ListingCard key={l.id} l={l} />)}
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-dashed border-border p-10 text-center">
          <p className="font-semibold text-navy">No homes match your search.</p>
          <p className="mt-1 text-sm text-muted-foreground">Try a different location or loosen your filters.</p>
        </div>
      )}
    </div>
  );
}
