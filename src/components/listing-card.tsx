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
        void toggle(id)
          .then((savedNow) => toast.success(savedNow ? "Saved to your homes" : "Removed from saved"))
          .catch((error: { code?: string }) => toast.error(
            error.code === "PGRST205"
              ? "Saved homes aren't set up yet. Run the user_favorites migration in Supabase."
              : "Could not update your saved homes. Check your connection and try again.",
          ));
      }}
      aria-label={saved ? "Remove from saved" : "Save listing"}
      aria-pressed={saved}
      className={className}
    >
      <Heart className={`h-5 w-5 drop-shadow ${saved ? "text-destructive" : ""}`} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}

export function ListingCard({ l, compact = false }: { l: Listing; compact?: boolean }) {
  return (
    <Link
      to="/property/$id"
      params={{ id: l.id }}
      className={`group overflow-hidden rounded-lg border border-[#dfe7f2] bg-white transition-all hover:shadow-[0_12px_24px_rgba(9,30,66,0.08)] ${compact ? "grid h-[276px] grid-rows-[160px_minmax(0,1fr)]" : "block rounded-xl hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(9,30,66,0.08)]"}`}
    >
      <div className={`relative ${compact ? "h-40 w-full" : ""}`}>
        <img src={l.photos[0]} alt={l.address} loading="lazy" width={944} height={704} className={compact ? "h-full w-full object-cover" : "h-56 w-full object-cover"} />
        <span className={`absolute rounded-full bg-[#1f2d3d]/80 font-semibold text-white shadow-sm ${compact ? "left-2 top-2 px-2 py-1 text-[0.6rem]" : "left-3 top-3 px-2.5 py-1 text-[0.7rem]"}`}>
          {l.status === "sale" ? "For Sale" : "For Rent"}
        </span>
        <SaveButton id={l.id} className={`absolute rounded-full bg-white/90 text-[#1f2d3d] shadow-sm transition-transform hover:scale-110 ${compact ? "right-2 top-2 p-1.5" : "right-3 top-3 p-2"}`} />
      </div>
      <div className={`min-w-0 ${compact ? "flex flex-col p-2" : "p-4"}`}>
        <p className={`font-display font-extrabold tracking-[-0.03em] text-navy ${compact ? "text-lg" : "text-[1.05rem]"}`}>{formatPrice(l)}</p>
        <p className={`line-clamp-1 font-semibold text-navy ${compact ? "mt-0.5 text-sm" : "mt-1.5 truncate text-sm"}`}>{l.address}</p>
        <p className={`truncate text-muted-foreground ${compact ? "text-xs" : "text-sm"}`}>{l.city}, {l.state} {l.zip}</p>
        <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground ${compact ? "mt-auto pt-2 text-xs" : "mt-4 border-t border-[#e7edf5] pt-3 text-xs"}`}>
          <span className="flex items-center gap-1"><BedDouble className="h-4 w-4" />{l.beds} beds</span>
          <span className="flex items-center gap-1"><Bath className="h-4 w-4" />{l.baths} baths</span>
          <span className="flex items-center gap-1"><Ruler className="h-4 w-4" />{l.sqft.toLocaleString()} sq ft</span>
        </div>
      </div>
    </Link>
  );
}
