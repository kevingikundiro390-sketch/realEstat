import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import heroHouse from "@/assets/hero-house.jpg";
import { priceRanges, type ListingStatus } from "@/lib/listings";

const sel = "rounded-md border border-border bg-background px-3 py-2.5 text-sm font-medium text-navy outline-none hover:bg-surface lg:rounded-none lg:border-0 lg:border-l";

export function Hero() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [mode, setMode] = useState<ListingStatus>("sale");
  const [price, setPrice] = useState(0);
  const [beds, setBeds] = useState(0);
  const [baths, setBaths] = useState(0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = priceRanges[mode][price];
    navigate({
      to: mode === "sale" ? "/buy" : "/rent",
      search: { q: q || undefined, minPrice: p?.min, maxPrice: p?.max, beds: beds || undefined, baths: baths || undefined },
    });
  };

  return (
    <section className="relative isolate">
      <img src={heroHouse} alt="Suburban home at sunset" width={1920} height={912} className="absolute inset-0 -z-10 h-full w-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy/75 via-navy/45 to-navy/10" />
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl font-extrabold text-background sm:text-5xl lg:text-6xl">Find your next home</h1>
          <p className="mt-4 text-base text-background/90 sm:text-lg">Buy or rent the perfect place, in the right location.</p>
        </div>
        <form onSubmit={submit} className="mt-8 max-w-5xl rounded-xl border border-border bg-background p-2 shadow-sm">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-0">
            <div className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2">
              <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} type="text" aria-label="Location"
                placeholder="City, ZIP, neighborhood, or address"
                className="min-w-0 flex-1 bg-transparent text-sm text-navy outline-none placeholder:text-muted-foreground" />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex lg:gap-0">
              <select aria-label="Buy or rent" className={sel} value={mode} onChange={(e) => { setMode(e.target.value as ListingStatus); setPrice(0); }}>
                <option value="sale">Buy</option><option value="rent">Rent</option>
              </select>
              <select aria-label="Price" className={sel} value={price} onChange={(e) => setPrice(+e.target.value)}>
                {priceRanges[mode].map((p, i) => <option key={p.label} value={i}>{i === 0 ? "Price" : p.label}</option>)}
              </select>
              <select aria-label="Beds" className={sel} value={beds} onChange={(e) => setBeds(+e.target.value)}>
                <option value={0}>Beds</option>{[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+ beds</option>)}
              </select>
              <select aria-label="Baths" className={sel} value={baths} onChange={(e) => setBaths(+e.target.value)}>
                <option value={0}>Baths</option>{[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}+ baths</option>)}
              </select>
            </div>
            <button type="submit" className="rounded-md bg-brand px-8 py-2.5 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-hover lg:ml-2">Search</button>
          </div>
        </form>
      </div>
    </section>
  );
}
