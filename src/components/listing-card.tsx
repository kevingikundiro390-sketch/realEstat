import { Link } from "@tanstack/react-router";
import { Bath, BedDouble, Heart, Ruler } from "lucide-react";
import { toast } from "sonner";
import { formatPrice, type Listing } from "@/lib/listings";
import { useFavorites } from "@/lib/store";

export function SaveButton({ id, className = "" }: { id: string; className?: string }) {
  const { isSaved, toggle } = useFavorites();
  const saved = isSaved(id);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toast.success(toggle(id) ? "Saved to your homes" : "Removed from saved");
      }}
      aria-label={saved ? "Remove from saved" : "Save listing"}
      aria-pressed={saved}
      className={className}
    >
      <Heart className={`h-5 w-5 drop-shadow ${saved ? "text-destructive" : ""}`} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}

export function ListingCard({ l }: { l: Listing }) {
  return (
    <Link
      to="/property/$id"
      params={{ id: l.id }}
      className="group block overflow-hidden rounded-lg border border-border bg-background transition-shadow hover:shadow-md"
    >
      <div className="relative">
        <img src={l.photos[0]} alt={l.address} loading="lazy" width={944} height={704} className="h-48 w-full object-cover" />
        <span className="absolute left-3 top-3 rounded bg-navy/85 px-2 py-1 text-xs font-semibold text-background">
          {l.status === "sale" ? "For Sale" : "For Rent"}
        </span>
        <SaveButton id={l.id} className="absolute right-3 top-3 rounded-full bg-navy/30 p-1.5 text-background transition-transform hover:scale-110" />
      </div>
      <div className="p-4">
        <p className="font-display text-xl font-extrabold text-navy">{formatPrice(l)}</p>
        <p className="mt-1.5 truncate text-sm font-medium text-navy">{l.address}</p>
        <p className="text-sm text-muted-foreground">{l.city}, {l.state} {l.zip}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><BedDouble className="h-4 w-4" />{l.beds} bd</span>
          <span className="flex items-center gap-1"><Bath className="h-4 w-4" />{l.baths} ba</span>
          <span className="flex items-center gap-1"><Ruler className="h-4 w-4" />{l.sqft.toLocaleString()} sqft</span>
          <span className="ml-auto">{l.type}</span>
        </div>
      </div>
    </Link>
  );
}
