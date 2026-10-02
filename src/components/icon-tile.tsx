import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import type { Icon3D } from "@/lib/icons";
import { useFavorites } from "@/lib/store";

export function IconTile({ icon }: { icon: Icon3D }) {
  const { isSaved, toggle } = useFavorites();
  const saved = isSaved(icon.id);

  return (
    <div className="icon-tile group relative flex flex-col items-center p-4">
      <button
        onClick={() => toggle(icon.id)}
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 opacity-0 shadow-sm backdrop-blur-sm transition-all hover:bg-white group-hover:opacity-100"
        aria-label={saved ? "Unsave icon" : "Save icon"}
      >
        <Heart className={`h-4 w-4 ${saved ? "fill-brand text-brand" : "text-muted-foreground"}`} />
      </button>
      <Link to="/icons/$id" params={{ id: icon.id }} className="flex flex-1 flex-col items-center">
        <div
          className="icon-3d flex h-20 w-20 items-center justify-center rounded-2xl text-4xl"
          style={{
            background: `linear-gradient(135deg, ${icon.gradient[0]}22, ${icon.gradient[1]}22)`,
          }}
        >
          <span style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))" }}>{icon.emoji}</span>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-foreground/80">{icon.name}</p>
      </Link>
    </div>
  );
}
