import l1 from "@/assets/listing-1.jpg";
import l2 from "@/assets/listing-2.jpg";
import l3 from "@/assets/listing-3.jpg";
import l4 from "@/assets/listing-4.jpg";
import l5 from "@/assets/listing-5.jpg";
import i1 from "@/assets/interior-1.jpg";
import i2 from "@/assets/interior-2.jpg";
import i3 from "@/assets/interior-3.jpg";

export type ListingStatus = "sale" | "rent";
export type PropertyType = "House" | "Condo" | "Townhouse" | "Apartment";

export type Listing = {
  id: string;
  photos: string[];
  price: number;
  status: ListingStatus;
  address: string;
  city: string;
  state: string;
  zip: string;
  neighborhood: string;
  beds: number;
  baths: number;
  sqft: number;
  yearBuilt: number;
  lotSize?: string;
  type: PropertyType;
  description: string;
  features: string[];
  listedDaysAgo: number;
  lat: number;
  lng: number;
  agent: { name: string; phone: string; email: string };
};

const exteriors = [l1, l2, l3, l4, l5];
const interiors = [i1, i2, i3];

const cities = [
  { city: "Kansas City", state: "MO", zip: "64111", hood: "Westport", lat: 39.05, lng: -94.59 },
  { city: "Kansas City", state: "MO", zip: "64145", hood: "Martin City", lat: 38.87, lng: -94.6 },
  { city: "Overland Park", state: "KS", zip: "66213", hood: "Deer Creek", lat: 38.9, lng: -94.69 },
  { city: "Lee's Summit", state: "MO", zip: "64063", hood: "Downtown", lat: 38.91, lng: -94.38 },
  { city: "Olathe", state: "KS", zip: "66062", hood: "Cedar Creek", lat: 38.88, lng: -94.8 },
  { city: "Lawrence", state: "KS", zip: "66044", hood: "Old West", lat: 38.97, lng: -95.24 },
  { city: "Denver", state: "CO", zip: "80205", hood: "Five Points", lat: 39.76, lng: -104.98 },
  { city: "Austin", state: "TX", zip: "78704", hood: "South Congress", lat: 30.25, lng: -97.75 },
  { city: "Nashville", state: "TN", zip: "37206", hood: "East Nashville", lat: 36.18, lng: -86.74 },
];

const streets = ["Maple St", "Oak Ave", "Pine Ln", "Grand Blvd", "Cedar Ct", "Willow Way", "Elm Dr", "Birch Rd", "Summit St", "Harbor View", "Meadow Ln", "Ridge Pkwy"];
const agents = [
  { name: "Sarah Mitchell", phone: "(816) 555-0142", email: "sarah@homebase.example" },
  { name: "David Chen", phone: "(913) 555-0187", email: "david@homebase.example" },
  { name: "Maria Lopez", phone: "(816) 555-0119", email: "maria@homebase.example" },
  { name: "James Carter", phone: "(720) 555-0163", email: "james@homebase.example" },
];
const featurePool = [
  "Central air", "Hardwood floors", "Updated kitchen", "Quartz countertops", "Stainless appliances",
  "Walk-in closet", "Fireplace", "Finished basement", "Attached 2-car garage", "Fenced backyard",
  "In-unit laundry", "Covered patio", "Smart thermostat", "Walk to parks", "Pet friendly",
  "Community pool", "Vaulted ceilings", "Home office",
];
const types: PropertyType[] = ["House", "Condo", "Townhouse", "Apartment"];

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function build(): Listing[] {
  const r = rng(42);
  const out: Listing[] = [];
  for (let n = 0; n < 120; n++) {
    const c = cities[n % cities.length]!;
    const status: ListingStatus = n % 3 === 1 ? "rent" : "sale";
    const type = status === "rent" ? (n % 2 ? "Apartment" : types[Math.floor(r() * types.length)]!) : types[Math.floor(r() * types.length)]!;
    const beds = 1 + Math.floor(r() * 5);
    const baths = Math.max(1, Math.min(beds, 1 + Math.floor(r() * 4)));
    const sqft = 650 + beds * 420 + Math.floor(r() * 500);
    const price =
      status === "sale"
        ? Math.round((150000 + sqft * (120 + r() * 140)) / 1000) * 1000
        : Math.round((700 + beds * 420 + r() * 700) / 25) * 25;
    const ext = exteriors[n % exteriors.length]!;
    const feats = [...featurePool].sort(() => r() - 0.5).slice(0, 7);
    const num = 100 + Math.floor(r() * 9800);
    const street = streets[Math.floor(r() * streets.length)]!;
    const unit = type === "Apartment" || type === "Condo" ? `, Unit ${1 + Math.floor(r() * 12)}${"ABCD"[n % 4]}` : "";
    out.push({
      id: `hb-${1000 + n}`,
      photos: [ext, ...interiors.slice(n % 3), ...interiors.slice(0, n % 3), exteriors[(n + 2) % exteriors.length]!],
      price,
      status,
      address: `${num} ${street}${unit}`,
      city: c.city,
      state: c.state,
      zip: c.zip,
      neighborhood: c.hood,
      beds,
      baths,
      sqft,
      yearBuilt: 1955 + Math.floor(r() * 68),
      lotSize: type === "House" ? `${(0.12 + r() * 0.4).toFixed(2)} acres` : undefined,
      type,
      description: `Welcome to this ${beds}-bedroom ${type.toLowerCase()} in the heart of ${c.hood}, ${c.city}. Bright, open living spaces flow into a ${feats.includes("Updated kitchen") ? "freshly updated" : "well-appointed"} kitchen, perfect for everyday living and entertaining. The primary suite offers a peaceful retreat, while the location puts you minutes from shops, restaurants, schools, and parks. ${status === "rent" ? "Available now with a flexible 12-month lease." : "Move-in ready and priced to sell."}`,
      features: feats,
      listedDaysAgo: Math.floor(r() * 45),
      lat: c.lat + (r() - 0.5) * 0.05,
      lng: c.lng + (r() - 0.5) * 0.05,
      agent: agents[n % agents.length]!,
    });
  }
  return out;
}

export const listings: Listing[] = build();

export const getListing = (id: string, source: Listing[] = listings) => source.find((l) => l.id === id);

export const formatPrice = (l: Pick<Listing, "price" | "status">) =>
  `$${l.price.toLocaleString("en-US")}${l.status === "rent" ? "/mo" : ""}`;

export type Filters = {
  q?: string | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  beds?: number | undefined;
  baths?: number | undefined;
  type?: string | undefined;
  sort?: string | undefined;
};

export function filterListings(status: ListingStatus, f: Filters, source: Listing[] = listings) {
  const q = (f.q ?? "").trim().toLowerCase();
  let res = source.filter((l) => {
    if (l.status !== status) return false;
    if (q) {
      const hay = `${l.address} ${l.city} ${l.state} ${l.zip} ${l.neighborhood}`.toLowerCase();
      if (!q.split(/[\s,]+/).filter(Boolean).every((t) => hay.includes(t))) return false;
    }
    if (f.minPrice && l.price < f.minPrice) return false;
    if (f.maxPrice && l.price > f.maxPrice) return false;
    if (f.beds && l.beds < f.beds) return false;
    if (f.baths && l.baths < f.baths) return false;
    if (f.type && f.type !== "any" && l.type !== f.type) return false;
    return true;
  });
  const sort = f.sort ?? "newest";
  res = [...res].sort((a, b) =>
    sort === "price-asc" ? a.price - b.price
    : sort === "price-desc" ? b.price - a.price
    : sort === "sqft" ? b.sqft - a.sqft
    : sort === "beds" ? b.beds - a.beds
    : a.listedDaysAgo - b.listedDaysAgo,
  );
  return res;
}

export const priceRanges: Record<ListingStatus, { label: string; min?: number; max?: number }[]> = {
  sale: [
    { label: "Any price" },
    { label: "Under $300k", max: 300000 },
    { label: "$300k – $500k", min: 300000, max: 500000 },
    { label: "$500k – $750k", min: 500000, max: 750000 },
    { label: "$750k+", min: 750000 },
  ],
  rent: [
    { label: "Any price" },
    { label: "Under $1,500", max: 1500 },
    { label: "$1,500 – $2,500", min: 1500, max: 2500 },
    { label: "$2,500+", min: 2500 },
  ],
};
