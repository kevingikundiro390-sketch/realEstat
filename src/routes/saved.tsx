import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Download } from "lucide-react";
import { icons } from "@/lib/icons";
import { useFavorites } from "@/lib/store";
import { IconTile } from "@/components/icon-tile";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved Icons | 3D Icons" },
      { name: "description", content: "Your saved 3D icons." },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const { favorites } = useFavorites();
  const savedIcons = icons.filter((icon) => favorites.includes(icon.id));

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="font-display text-3xl font-extrabold text-foreground">Saved icons</h1>
        <p className="mt-2 text-sm text-muted-foreground">{savedIcons.length} saved</p>

        {savedIcons.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {savedIcons.map((icon) => (
              <IconTile key={icon.id} icon={icon} />
            ))}
          </div>
        ) : (
          <div className="mt-12 flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface">
              <Heart className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <p className="mt-4 text-sm font-medium text-muted-foreground">No saved icons yet</p>
            <p className="text-xs text-muted-foreground/60">Tap the heart on any icon to save it here</p>
            <Link to="/icons" className="mt-6 flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-foreground/90">
              <Download className="h-4 w-4" /> Browse icons
            </Link>
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}
