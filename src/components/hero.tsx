import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { useState } from "react";
import heroHouse from "@/assets/hero-house.jpg";
import { priceRanges, type ListingStatus } from "@/lib/listings";

const sel = "min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15 lg:rounded-none lg:border-0 lg:border-l lg:border-slate-200";

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
    <section className="hero-shell relative isolate overflow-hidden bg-[#08172a]">
      <img src={heroHouse} alt="A welcoming home at dusk" width={1920} height={912} className="absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-85" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(5,17,34,0.94)_0%,rgba(7,24,46,0.79)_48%,rgba(8,28,51,0.34)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-[#08172a]/55 to-transparent" />
      <div className="mx-auto flex min-h-[520px] w-full max-w-[1440px] flex-col justify-center px-5 py-16 sm:px-8 lg:min-h-[590px] lg:px-12 lg:py-20">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold tracking-wide text-white/90 shadow-lg shadow-black/10 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-sky-300" /> A better way to find your place
          </div>
          <h1 className="max-w-3xl font-display text-[3.4rem] font-extrabold leading-[0.94] tracking-[-0.065em] text-white sm:text-6xl lg:text-[5.2rem]">
            Find a place that <span className="text-sky-300">feels like you.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-200 sm:text-lg">
            Your next chapter starts with a home that fits the way you live.
          </p>
        </div>
        <form onSubmit={submit} className="mt-9 w-full max-w-[1040px] rounded-2xl border border-white/50 bg-white p-2 shadow-[0_28px_80px_rgba(0,0,0,0.28)] sm:p-2.5">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-0">
            <label className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 lg:px-4">
              <Search className="h-5 w-5 shrink-0 text-brand" />
              <input value={q} onChange={(e) => setQ(e.target.value)} type="text" aria-label="Location"
                placeholder="City, neighborhood, or ZIP code"
                className="min-w-0 flex-1 bg-transparent text-sm font-medium text-navy outline-none placeholder:text-slate-400" />
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex lg:gap-0">
              <select aria-label="Buy or rent" className={sel} value={mode} onChange={(e) => { setMode(e.target.value as ListingStatus); setPrice(0); }}>
                <option value="sale">Buy</option><option value="rent">Rent</option>
              </select>
              <select aria-label="Price" className={sel} value={price} onChange={(e) => setPrice(+e.target.value)}>
                {priceRanges[mode].map((p, i) => <option key={p.label} value={i}>{i === 0 ? "Any price" : p.label}</option>)}
              </select>
              <select aria-label="Beds" className={sel} value={beds} onChange={(e) => setBeds(+e.target.value)}>
                <option value={0}>Beds</option>{[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+ beds</option>)}
              </select>
              <select aria-label="Baths" className={sel} value={baths} onChange={(e) => setBaths(+e.target.value)}>
                <option value={0}>Baths</option>{[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}+ baths</option>)}
              </select>
            </div>
            <button type="submit" className="flex items-center justify-center gap-2 rounded-xl bg-brand px-7 py-3.5 text-sm font-bold text-brand-foreground shadow-lg shadow-brand/25 transition-all hover:-translate-y-0.5 hover:bg-brand-hover lg:ml-2">
              Search homes <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-white/75">
          <span>Explore your next move</span><span className="h-1 w-1 rounded-full bg-sky-300" /><span>Buy</span><span className="h-1 w-1 rounded-full bg-sky-300" /><span>Rent</span><span className="h-1 w-1 rounded-full bg-sky-300" /><span>Sell</span>
        </div>
      </div>
    </section>
  );
}
