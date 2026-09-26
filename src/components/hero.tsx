import { ChevronDown, Search } from "lucide-react";
import heroHouse from "@/assets/hero-house.jpg";

const filters = ["Buy", "Price", "Beds", "Baths"];

export function Hero() {
  return (
    <section className="relative isolate">
      <img
        src={heroHouse}
        alt="Suburban home at sunset"
        width={1920}
        height={912}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy/75 via-navy/45 to-navy/10" />

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl font-extrabold text-background sm:text-5xl lg:text-6xl">
            Find your next home
          </h1>
          <p className="mt-4 text-base text-background/90 sm:text-lg">
            Buy or rent the perfect place, in the right location.
          </p>
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-8 max-w-4xl rounded-xl border border-border bg-background p-2 shadow-sm"
        >
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-0">
            <div className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2">
              <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by city, neighborhood, or address..."
                className="min-w-0 flex-1 bg-transparent text-sm text-navy outline-none placeholder:text-muted-foreground"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex lg:items-center lg:gap-0">
              {filters.map((label) => (
                <button
                  key={label}
                  type="button"
                  className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-navy transition-colors hover:bg-surface lg:border-0 lg:border-l lg:border-border lg:rounded-none"
                >
                  {label}
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="rounded-md bg-brand px-8 py-2.5 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-hover lg:ml-2"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
