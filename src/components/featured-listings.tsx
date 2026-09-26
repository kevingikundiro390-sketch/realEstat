import { ArrowRight, Bath, BedDouble, Heart, Ruler } from "lucide-react";
import { useState } from "react";
import listing1 from "@/assets/listing-1.jpg";
import listing2 from "@/assets/listing-2.jpg";
import listing3 from "@/assets/listing-3.jpg";
import listing4 from "@/assets/listing-4.jpg";

type Listing = {
  id: number;
  image: string;
  status: "For Sale" | "For Rent";
  price: string;
  period?: string;
  address: string;
  city: string;
  beds: string;
  baths: string;
  sqft: string;
};

const listings: Listing[] = [
  {
    id: 1,
    image: listing1,
    status: "For Sale",
    price: "$425,000",
    address: "1234 Maple St",
    city: "Kansas City, MO 64145",
    beds: "4 beds",
    baths: "3 baths",
    sqft: "2,450 sq ft",
  },
  {
    id: 2,
    image: listing2,
    status: "For Rent",
    price: "$1,850",
    period: "/mo",
    address: "5678 Oak Ave, Apt 3B",
    city: "Kansas City, MO 64118",
    beds: "2 beds",
    baths: "2 baths",
    sqft: "1,200 sq ft",
  },
  {
    id: 3,
    image: listing3,
    status: "For Sale",
    price: "$360,000",
    address: "9101 Pine Ln",
    city: "Kansas City, MO 64137",
    beds: "3 beds",
    baths: "2 baths",
    sqft: "1,980 sq ft",
  },
  {
    id: 4,
    image: listing4,
    status: "For Rent",
    price: "$1,450",
    period: "/mo",
    address: "4320 Grand Blvd, Apt 5",
    city: "Kansas City, MO 64111",
    beds: "1 bed",
    baths: "1 bath",
    sqft: "850 sq ft",
  },
];

export function FeaturedListings() {
  const [saved, setSaved] = useState<number[]>([]);

  const toggle = (id: number) =>
    setSaved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-2xl font-extrabold text-navy sm:text-3xl">
          Featured Listings
        </h2>
        <a
          href="#"
          className="group flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-hover"
        >
          View all
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {listings.map((l) => {
          const isSaved = saved.includes(l.id);
          return (
            <article
              key={l.id}
              className="group overflow-hidden rounded-lg border border-border bg-background transition-shadow hover:shadow-md"
            >
              <div className="relative">
                <img
                  src={l.image}
                  alt={l.address}
                  loading="lazy"
                  width={944}
                  height={704}
                  className="h-48 w-full object-cover"
                />
                <span className="absolute left-3 top-3 rounded bg-navy/85 px-2 py-1 text-xs font-semibold text-background">
                  {l.status}
                </span>
                <button
                  onClick={() => toggle(l.id)}
                  aria-label={isSaved ? "Remove from saved" : "Save listing"}
                  className="absolute right-3 top-3 rounded-full p-1.5 text-background transition-transform hover:scale-110"
                >
                  <Heart
                    className="h-5 w-5 drop-shadow"
                    fill={isSaved ? "currentColor" : "none"}
                  />
                </button>
              </div>

              <div className="p-4">
                <p className="font-display text-xl font-extrabold text-navy">
                  {l.price}
                  {l.period && (
                    <span className="text-sm font-semibold text-muted-foreground"> {l.period}</span>
                  )}
                </p>
                <p className="mt-1.5 text-sm font-medium text-navy">{l.address}</p>
                <p className="text-sm text-muted-foreground">{l.city}</p>

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <BedDouble className="h-4 w-4" /> {l.beds}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Bath className="h-4 w-4" /> {l.baths}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Ruler className="h-4 w-4" /> {l.sqft}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
