import { createServerFn } from "@tanstack/react-start";
import { listings, type ListingStatus } from "./listings";

// Serves HomeBase's built-in listings dataset — no external API or key required.
export const fetchListings = createServerFn({ method: "GET" })
  .validator((input: string) => {
    if (input !== "sale" && input !== "rent") throw new Error("Invalid listing status");
    return input as ListingStatus;
  })
  .handler(async ({ data: status }) => listings.filter((l) => l.status === status));
