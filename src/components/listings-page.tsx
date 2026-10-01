import { useNavigate } from "@tanstack/react-router";
import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { filterListings, priceRanges, type Filters, type Listing, type ListingStatus } from "@/lib/listings";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ListingCard } from "./listing-card";

export function parseFilters(s: Record<string, unknown>): Filters {
  const num = (v: unknown) => (v === undefined || v === "" || isNaN(Number(v)) ? undefined : Number(v));
  return {
    q: typeof s['q'] === "string" ? s['q'] : s['q'] !== undefined ? String(s['q']) : undefined,
    minPrice: num(s['minPrice']), maxPrice: num(s['maxPrice']), beds: num(s['beds']), baths: num(s['baths']),
    type: typeof s['type'] === "string" ? s['type'] : undefined,
    sort: typeof s['sort'] === "string" ? s['sort'] : undefined,
  };
}

const sel = "h-11 w-full appearance-none rounded-md border border-border bg-white px-3 pr-9 text-sm font-semibold text-navy shadow-sm outline-none transition hover:border-brand/50 focus:border-brand focus:ring-2 focus:ring-brand/15";
const homeTypes = ["House", "Condo", "Townhouse", "Apartment"] as const;

export function ListingsPage({ status, search }: { status: ListingStatus; search: Filters }) {
  const navigate = useNavigate();
  const [q, setQ] = useState(search.q ?? "");
  const [showFilters, setShowFilters] = useState(false);
  const results = filterListings(status, search);
  const update = (patch: Partial<Filters>) =>
    navigate({ to: status === "sale" ? "/buy" : "/rent", search: { ...search, ...patch } as never, replace: true });
  const priceIdx = Math.max(0, priceRanges[status].findIndex((p) => p.min === search.minPrice && p.max === search.maxPrice));
  const activeFilterCount = Number(search.minPrice !== undefined || search.maxPrice !== undefined)
    + Number(Boolean(search.beds))
    + Number(Boolean(search.baths))
    + Number(Boolean(search.type))
    + Number(Boolean(search.sort && search.sort !== "newest"));
  const route = status === "sale" ? "/buy" : "/rent";
  const resetFilters = () => {
    setQ("");
    void navigate({ to: route, search: {} as never, replace: true });
  };
  const focusLocation = (city: string, state: string) => {
    const location = `${city}, ${state}`;
    setQ(location);
    update({ q: location });
  };

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-[#f7f9fc] lg:h-[calc(100dvh-4rem)] lg:min-h-0 lg:overflow-hidden">
      <div className="flex min-h-[calc(100dvh-4rem)] w-full flex-col gap-2 px-3 py-3 sm:px-5 lg:h-full lg:min-h-0 lg:px-6">
        <div className="flex shrink-0 items-end justify-between gap-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">HomeBase search</p>
          <h1 className="font-display text-2xl font-extrabold text-navy sm:text-3xl">{status === "sale" ? "Homes for sale" : "Homes for rent"}</h1>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); update({ q: q.trim() || undefined }); }} className="flex min-w-0 shrink-0 gap-2">
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-border bg-white px-3 shadow-sm transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="City, ZIP, neighborhood, or address" className="w-full min-w-0 bg-transparent py-2.5 text-sm text-navy outline-none placeholder:text-muted-foreground" />
          </label>
          <button className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-brand px-5 text-sm font-bold text-brand-foreground shadow-sm transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"><Search className="h-4 w-4" />Search</button>
        </form>
        <Sheet open={showFilters} onOpenChange={setShowFilters}>
          <div className="mt-2 grid shrink-0 grid-cols-2 gap-3 sm:grid-cols-4">
            <label className="relative min-w-0 space-y-1.5">
              <span className="block text-xs font-bold text-navy">Price</span>
              <select aria-label="Price" className={sel} value={priceIdx} onChange={(e) => { const p = priceRanges[status][+e.target.value]; update({ minPrice: p?.min, maxPrice: p?.max }); }}>{priceRanges[status].map((p, i) => <option key={p.label} value={i}>{p.label}</option>)}</select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 text-muted-foreground" />
            </label>
            <label className="relative min-w-0 space-y-1.5">
              <span className="block text-xs font-bold text-navy">Beds</span>
              <select aria-label="Beds" className={sel} value={search.beds ?? 0} onChange={(e) => update({ beds: +e.target.value || undefined })}><option value={0}>Any beds</option>{[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+ beds</option>)}</select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 text-muted-foreground" />
            </label>
            <label className="relative min-w-0 space-y-1.5">
              <span className="block text-xs font-bold text-navy">Baths</span>
              <select aria-label="Baths" className={sel} value={search.baths ?? 0} onChange={(e) => update({ baths: +e.target.value || undefined })}><option value={0}>Any baths</option>{[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}+ baths</option>)}</select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 text-muted-foreground" />
            </label>
            <button type="button" onClick={() => setShowFilters(true)} className="mt-[1.35rem] flex h-11 items-center justify-center gap-2 rounded-md border border-navy/20 bg-white px-3 text-sm font-semibold text-navy shadow-sm transition-colors hover:border-brand hover:bg-brand/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30">
              <SlidersHorizontal className="h-4 w-4" />More filters{activeFilterCount > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-xs text-white">{activeFilterCount}</span>}
            </button>
          </div>
          <SheetContent side="right" className="flex w-full flex-col overflow-y-auto border-l border-border bg-white p-0 sm:max-w-md">
            <SheetHeader className="border-b border-border px-6 py-5 pr-14">
              <SheetTitle className="font-display text-xl font-extrabold text-navy">More filters</SheetTitle>
              <SheetDescription>Fine-tune your {status === "sale" ? "home purchase" : "rental"} search.</SheetDescription>
            </SheetHeader>
            <div className="flex-1 space-y-7 px-6 py-6">
              <section aria-labelledby="property-type-title" className="space-y-3">
                <h2 id="property-type-title" className="text-sm font-bold text-navy">Property type</h2>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" aria-pressed={!search.type} onClick={() => update({ type: undefined })} className={`h-11 rounded-md border px-3 text-sm font-semibold transition-colors ${!search.type ? "border-brand bg-brand/5 text-brand" : "border-border text-navy hover:border-brand/50"}`}>Any type</button>
                  {homeTypes.map((type) => <button key={type} type="button" aria-pressed={search.type === type} onClick={() => update({ type })} className={`h-11 rounded-md border px-3 text-sm font-semibold transition-colors ${search.type === type ? "border-brand bg-brand/5 text-brand" : "border-border text-navy hover:border-brand/50"}`}>{type}</button>)}
                </div>
              </section>
              <label className="relative block space-y-1.5">
                <span className="block text-sm font-bold text-navy">Sort by</span>
                <select aria-label="Sort by" className={sel} value={search.sort ?? "newest"} onChange={(e) => update({ sort: e.target.value })}><option value="newest">Newest</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="sqft">Largest</option><option value="beds">Most bedrooms</option></select>
                <ChevronDown aria-hidden="true" className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 text-muted-foreground" />
              </label>
            </div>
            <div className="flex items-center justify-between border-t border-border px-6 py-4">
              <button type="button" onClick={resetFilters} className="rounded-md px-3 py-2 text-sm font-semibold text-brand hover:bg-brand/5">Reset all</button>
              <button type="button" onClick={() => setShowFilters(false)} className="rounded-md bg-brand px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-hover">Show {results.length} homes</button>
            </div>
          </SheetContent>
        </Sheet>
        <div className="mt-3 grid items-start gap-4 lg:min-h-0 lg:flex-1 lg:grid-cols-2 lg:items-stretch">
          <ListingMap listings={results} onSelectLocation={focusLocation} />
          <section className="min-w-0 lg:flex lg:h-full lg:min-h-0 lg:flex-col">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <p aria-live="polite" className="text-sm font-semibold text-navy">{results.length} {results.length === 1 ? "home" : "homes"} found</p>
              {activeFilterCount > 0 && <button type="button" onClick={resetFilters} className="text-sm font-semibold text-brand hover:underline">Clear filters</button>}
            </div>
            {results.length ? <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-1">{results.map((l) => <ListingCard key={l.id} l={l} compact />)}</div> : (
              <div className="mt-5 rounded-lg border border-dashed border-border bg-white p-12 text-center">
                <p className="font-semibold text-navy">No homes match your search.</p><p className="mt-1 text-sm text-muted-foreground">Try another location or adjust your filters.</p>
                <button type="button" onClick={resetFilters} className="mt-4 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-hover">Clear filters</button>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

type LocationCluster = { city: string; state: string; latitude: number; longitude: number; count: number };

function ListingMap({ listings, onSelectLocation }: { listings: Listing[]; onSelectLocation: (city: string, state: string) => void }) {
  const clusters = new Map<string, LocationCluster>();
  for (const listing of listings) {
    const key = `${listing.city},${listing.state}`;
    const cluster = clusters.get(key);
    if (cluster) {
      cluster.latitude += listing.lat;
      cluster.longitude += listing.lng;
      cluster.count++;
    } else {
      clusters.set(key, { city: listing.city, state: listing.state, latitude: listing.lat, longitude: listing.lng, count: 1 });
    }
  }

  const locations = [...clusters.values()].map((cluster) => ({
    ...cluster,
    latitude: cluster.latitude / cluster.count,
    longitude: cluster.longitude / cluster.count,
  }));
  const fallback = { latitude: 39.1, longitude: -94.58 };
  const latitudes = locations.map((location) => location.latitude);
  const longitudes = locations.map((location) => location.longitude);
  const center = locations.length
    ? { latitude: (Math.min(...latitudes) + Math.max(...latitudes)) / 2, longitude: (Math.min(...longitudes) + Math.max(...longitudes)) / 2 }
    : fallback;
  const longitudeSpan = Math.max((locations.length ? Math.max(...longitudes) - Math.min(...longitudes) : 0), 0.03);
  const projectLatitude = (latitude: number) => {
    const sin = Math.sin((latitude * Math.PI) / 180);
    return 0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI);
  };
  const projectedLatitudes = latitudes.map(projectLatitude);
  const latitudeSpan = Math.max((Math.max(...projectedLatitudes) - Math.min(...projectedLatitudes)) * 256, 0.01);
  const zoomX = Math.log2((528 * 360) / (256 * longitudeSpan));
  const zoomY = Math.log2(408 / latitudeSpan);
  const zoom = Math.max(5, Math.min(14, Math.floor(Math.min(zoomX, zoomY))));
  const worldSize = 256 * 2 ** zoom;
  const projectX = (longitude: number) => ((longitude + 180) / 360) * worldSize;
  const projectY = (latitude: number) => projectLatitude(latitude) * worldSize;
  const mapUrl = `https://maps.google.com/maps?q=${center.latitude},${center.longitude}&z=${zoom}&output=embed`;

  return (
    <section aria-label="Map of matching homes" className="flex min-h-0 min-w-0 flex-col lg:h-full">
      <div className="relative h-[36vh] min-h-[18rem] flex-1 overflow-hidden rounded-lg border border-border bg-[#e8edf1] shadow-sm lg:min-h-0">
        <iframe title="Google Map showing matching homes" className="absolute inset-0 h-full w-full border-0" loading="lazy" src={mapUrl} />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-3 top-3 rounded-md bg-white/95 px-3 py-2 text-xs font-bold text-navy shadow-md">{listings.length} homes on map</div>
          {locations.map((location) => {
            const left = projectX(location.longitude) - projectX(center.longitude);
            const top = projectY(location.latitude) - projectY(center.latitude);
            return (
              <button
                key={`${location.city},${location.state}`}
                type="button"
                aria-label={`${location.count} homes in ${location.city}, ${location.state}`}
                title={`Show homes in ${location.city}, ${location.state}`}
                onClick={() => onSelectLocation(location.city, location.state)}
                className="pointer-events-auto absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border-2 border-white bg-navy px-3 py-2 text-xs font-bold text-white shadow-lg transition hover:scale-105 hover:bg-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                style={{ left: `calc(50% + ${left}px)`, top: `calc(50% + ${top}px)` }}
              >
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1">{location.count}</span>
                {location.city}
              </button>
            );
          })}
        </div>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Select a location marker to see homes in that area.</p>
    </section>
  );
}
