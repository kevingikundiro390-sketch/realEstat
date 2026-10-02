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
  "Walk-in closet", "Fireplace", "Finished basement", "Attached 2-car garage", "Fenced backyard",
  "In-unit laundry", "Covered patio", "Smart thermostat", "Walk to parks", "Pet friendly",
  "Community pool", "Vaulted ceilings", "Home office",
];

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

type RentCastListing = {
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
  price: number | null;
  daysOnMarket: number | null;
  listingAgent?: { name: string | null; phone: string | null; email: string | null } | null;
};

function transformListing(item: RentCastListing, status: ListingStatus, index: number): Listing {
  const beds = item.bedrooms ?? 3;
  const baths = item.bathrooms ?? 2;
  const sqft = item.squareFootage ?? 1500;
  const type = mapPropertyType(item.propertyType);
  const ext = exteriors[index % exteriors.length]!;
  const photoSet = [ext, ...interiors.slice(index % 3), ...interiors.slice(0, index % 3), exteriors[(index + 2) % exteriors.length]!];
  const r = (s: number) => ((s * 9301 + 49297) % 233280) / 233280;
  const feats = [...featurePool].sort(() => r(index) - 0.5).slice(0, 7);
  const city = item.city || "Unknown";
  const agent = item.listingAgent;

  return {
    id: item.id || `rc-${index}`,
    photos: photoSet,
    price: item.price ?? (status === "sale" ? 350000 : 2000),
    status,
    address: item.addressLine1 || item.formattedAddress || "Unknown address",
    city,
    state: item.state || "",
    zip: item.zipCode || "",
    neighborhood: city,
    beds,
    baths,
    sqft,
    yearBuilt: item.yearBuilt ?? 1990,
    lotSize: formatLotSize(item.lotSize),
    type,
    description: `Welcome to this ${beds}-bedroom ${type.toLowerCase()} at ${item.addressLine1 || item.formattedAddress} in ${city}, ${item.state || ""}. Bright, open living spaces flow into a well-appointed kitchen, perfect for everyday living and entertaining. The primary suite offers a peaceful retreat, while the location puts you minutes from shops, restaurants, schools, and parks. ${status === "rent" ? "Available now with a flexible 12-month lease." : "Move-in ready and priced to sell."}`,
    features: feats,
    listedDaysAgo: item.daysOnMarket ?? Math.floor(r(index) * 45),
    lat: item.latitude ?? 39.05,
    lng: item.longitude ?? -94.59,
    agent: {
      name: agent?.name ?? "HomeBase Agent",
      phone: agent?.phone ?? "(816) 555-0100",
      email: agent?.email ?? "agent@homebase.example",
    },
  };
}

const cache: Record<string, { data: Listing[]; time: number }> = {};
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;

const searchCities = [
  { city: "Kansas City", state: "MO" },
  { city: "Overland Park", state: "KS" },
  { city: "Lee's Summit", state: "MO" },
  { city: "Denver", state: "CO" },
  { city: "Austin", state: "TX" },
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
      const endpoint = status === "sale"
        ? "https://api.rentcast.io/v1/listings/sale"
        : "https://api.rentcast.io/v1/listings/rental/long-term";

      const allListings: Listing[] = [];
      for (const { city, state } of searchCities) {
        if (allListings.length >= 80) break;
        try {
          const url = `${endpoint}?city=${encodeURIComponent(city)}&state=${state}&limit=20`;
          const res = await fetch(url, { headers: { "X-Api-Key": apiKey, Accept: "application/json" } });
          if (!res.ok) continue;
          const data = (await res.json()) as RentCastListing[];
          for (let i = 0; i < data.length; i++) allListings.push(transformListing(data[i]!, status, allListings.length + i));
        } catch { /* skip city on error */ }
      }

      if (allListings.length === 0) return mockListings.filter((l) => l.status === status);
      cache[status] = { data: allListings, time: Date.now() };
      return allListings;
    } catch {
      return mockListings.filter((l) => l.status === status);
    }
  });
