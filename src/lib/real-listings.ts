import { createServerFn } from "@tanstack/react-start";
import l1 from "@/assets/listing-1.jpg";
import l2 from "@/assets/listing-2.jpg";
import l3 from "@/assets/listing-3.jpg";
import l4 from "@/assets/listing-4.jpg";
import l5 from "@/assets/listing-5.jpg";
import i1 from "@/assets/interior-1.jpg";
import i2 from "@/assets/interior-2.jpg";
import i3 from "@/assets/interior-3.jpg";
import { listings as mockListings, type Listing, type ListingStatus, type PropertyType } from "./listings";

const exteriors = [l1, l2, l3, l4, l5];
const interiors = [i1, i2, i3];

const featurePool = [
  "Central air", "Hardwood floors", "Updated kitchen", "Quartz countertops", "Stainless appliances",
  "Walk-in closet", "Finished basement", "Fenced backyard", "In-unit laundry",
  "Covered patio", "Smart thermostat", "Walk to parks", "Pet friendly", "Vaulted ceilings", "Home office",
];

type RentCastProperty = {
  id: string;
  formattedAddress: string;
  addressLine1: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  propertyType: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  squareFootage: number | null;
  lotSize: number | null;
  yearBuilt: number | null;
  lastSalePrice: number | null;
  lastSaleDate: string | null;
  subdivision: string | null;
  taxAssessments: Record<string, { year: number; value: number }> | null;
  features: {
    cooling?: boolean | null; coolingType?: string | null;
    fireplace?: boolean | null; fireplaceType?: string | null;
    garage?: boolean | null; garageSpaces?: number | null; garageType?: string | null;
    pool?: boolean | null; poolType?: string | null;
    heating?: boolean | null; heatingType?: string | null;
    floorCount?: number | null; roomCount?: number | null;
  } | null;
  owner?: { names?: string[] | null } | null;
};

function mapPropertyType(type: string | null | undefined): PropertyType {
  if (!type) return "House";
  const t = type.toLowerCase();
  if (t.includes("condo")) return "Condo";
  if (t.includes("townhouse") || t.includes("townhome")) return "Townhouse";
  if (t.includes("apartment") || t.includes("multi")) return "Apartment";
  return "House";
}

function formatLotSize(sqft: number | null | undefined): string | undefined {
  if (!sqft) return undefined;
  const acres = sqft / 43560;
  if (acres < 0.05) return `${sqft.toLocaleString()} sq ft`;
  return `${acres.toFixed(2)} acres`;
}

function extractPrice(property: RentCastProperty, status: ListingStatus): number {
  let base = property.lastSalePrice;
  if (!base && property.taxAssessments) {
    const latest = Object.values(property.taxAssessments).sort((a, b) => b.year - a.year)[0];
    base = latest?.value ?? undefined;
  }
  if (!base) base = 350000;
  return status === "rent" ? Math.max(800, Math.round((base * 0.005) / 25) * 25) : base;
}

function extractFeatures(features: RentCastProperty["features"]): string[] {
  const result: string[] = [];
  if (!features) return featurePool.slice(0, 6);
  if (features.cooling) result.push("Central air");
  if (features.fireplace) result.push("Fireplace");
  if (features.garage) result.push(`Attached ${features.garageSpaces ?? 1}-car garage`);
  if (features.pool) result.push("Pool");
  if (features.heating) result.push("Forced air heating");
  for (const f of featurePool) {
    if (result.length >= 7) break;
    if (!result.includes(f)) result.push(f);
  }
  return result;
}

function daysSince(dateStr: string | null): number {
  if (!dateStr) return 10;
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.max(1, Math.floor(diff / 86_400_000));
}

function transformProperty(p: RentCastProperty, status: ListingStatus, index: number): Listing {
  const beds = p.bedrooms ?? 3;
  const baths = p.bathrooms ?? 2;
  const sqft = p.squareFootage ?? 1500;
  const type = mapPropertyType(p.propertyType);
  const price = extractPrice(p, status);
  const ext = exteriors[index % exteriors.length]!;
  const photoSet = [ext, ...interiors.slice(index % 3), ...interiors.slice(0, index % 3), exteriors[(index + 2) % exteriors.length]!];
  const feats = extractFeatures(p.features);
  const city = p.city || "Unknown";
  const hood = p.subdivision || city;
  const ownerName = p.owner?.names?.[0];

  return {
    id: p.id || `rc-${index}`,
    photos: photoSet,
    price,
    status,
    address: p.addressLine1 || p.formattedAddress || "Unknown address",
    city,
    state: p.state || "",
    zip: p.zipCode || "",
    neighborhood: hood,
    beds,
    baths,
    sqft,
    yearBuilt: p.yearBuilt ?? 1990,
    lotSize: formatLotSize(p.lotSize),
    type,
    description: `Welcome to this ${beds}-bedroom ${type.toLowerCase()} at ${p.addressLine1 || p.formattedAddress} in ${hood}, ${city}. Bright, open living spaces flow into a well-appointed kitchen, perfect for everyday living and entertaining. The primary suite offers a peaceful retreat, while the location puts you minutes from shops, restaurants, schools, and parks. ${status === "rent" ? "Available now with a flexible 12-month lease." : "Move-in ready and priced to sell."}`,
    features: feats,
    listedDaysAgo: daysSince(p.lastSaleDate),
    lat: p.latitude ?? 39.05,
    lng: p.longitude ?? -94.59,
    agent: {
      name: ownerName ?? "HomeBase Agent",
      phone: "(816) 555-0100",
      email: "agent@homebase.example",
    },
  };
}

const cache: Record<string, { data: Listing[]; time: number }> = {};
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;

const searchCities = [
  { city: "Kansas City", state: "MO" },
  { city: "Overland Park", state: "KS" },
  { city: "Denver", state: "CO" },
];

export const fetchRealListings = createServerFn({ method: "GET" })
  .validator((input: string) => {
    if (input !== "sale" && input !== "rent") throw new Error("Invalid listing status");
    return input;
  })
  .handler(async (ctx) => {
    const status = ctx.data as ListingStatus;

    const cached = cache[status];
    if (cached && Date.now() - cached.time < CACHE_TTL) return cached.data;

    const apiKey = process.env.RENTCAST_API_KEY;
    if (!apiKey || apiKey.length < 10) return mockListings.filter((l) => l.status === status);

    try {
      const allListings: Listing[] = [];
      for (const { city, state } of searchCities) {
        if (allListings.length >= 60) break;
        try {
          const url = `https://api.rentcast.io/v1/properties?city=${encodeURIComponent(city)}&state=${state}&limit=25&bedrooms=2:6&squareFootage=800:`;
          const res = await fetch(url, { headers: { "X-Api-Key": apiKey, Accept: "application/json" } });
          if (!res.ok) {
            if (res.status === 401 || res.status === 403) return mockListings.filter((l) => l.status === status);
            continue;
          }
          const data = (await res.json()) as RentCastProperty[];
          for (const p of data) {
            if (p.bedrooms && p.squareFootage) allListings.push(transformProperty(p, status, allListings.length));
          }
        } catch { /* skip city on error */ }
      }

      if (allListings.length === 0) return mockListings.filter((l) => l.status === status);
      cache[status] = { data: allListings, time: Date.now() };
      return allListings;
    } catch {
      return mockListings.filter((l) => l.status === status);
    }
  });
