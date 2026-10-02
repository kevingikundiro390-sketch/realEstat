import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";
import { icons, categories, colorStyles, cameraAngles, type IconCategory, type ColorStyle, type CameraAngle } from "@/lib/icons";
import { IconTile } from "@/components/icon-tile";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/icons")({
  head: () => ({
    meta: [
      { title: "Browse Icons | 3D Icons" },
      { name: "description", content: "Browse and download 1000+ 3D icons across multiple categories." },
    ],
  }),
  component: IconsPage,
});

function IconsPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<IconCategory | "all">("all");
  const [colorStyle, setColorStyle] = useState<ColorStyle>("original");
  const [angle, setAngle] = useState<CameraAngle>("isometric");

  const filtered = useMemo(() => {
    let result = icons;
    if (activeCategory !== "all") {
      result = result.filter((icon) => icon.category === activeCategory);
    }
    const q = query.toLowerCase().trim();
    if (q) {
      result = result.filter(
        (icon) => icon.name.toLowerCase().includes(q) || icon.category.toLowerCase().includes(q),
      );
    }
    return result;
  }, [query, activeCategory]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header */}
        <h1 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">All Icons</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {filtered.length} of {icons.length} icons · {icons.length * colorStyles.length * cameraAngles.length} total renders
        </p>

        {/* Search */}
        <div className="mt-6 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search icons..."
              className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-4 text-sm text-foreground outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === "all" ? "bg-foreground text-background" : "bg-white text-foreground/70 hover:bg-surface border border-border"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeCategory === cat.id ? "bg-foreground text-background" : "bg-white text-foreground/70 hover:bg-surface border border-border"
                }`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Color & angle filters */}
        <div className="mt-4 flex flex-wrap items-center gap-6 border-b border-border pb-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-muted-foreground">Color:</span>
            {colorStyles.map((cs) => (
              <button
                key={cs.id}
                onClick={() => setColorStyle(cs.id)}
                className={`h-8 w-8 rounded-full border-2 transition-all ${
                  colorStyle === cs.id ? "border-brand scale-110" : "border-border"
                }`}
                style={{ background: `linear-gradient(135deg, ${cs.swatch[0]}, ${cs.swatch[1]})` }}
                title={cs.label}
              />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-muted-foreground">View:</span>
            {cameraAngles.map((ca) => (
              <button
                key={ca.id}
                onClick={() => setAngle(ca.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  angle === ca.id ? "bg-foreground text-background" : "bg-white text-foreground/70 border border-border hover:bg-surface"
                }`}
              >
                {ca.label}
              </button>
            ))}
          </div>
        </div>

        {/* Icon grid */}
        {filtered.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {filtered.map((icon) => (
              <IconTile key={icon.id} icon={icon} />
            ))}
          </div>
        ) : (
          <div className="mt-12 flex flex-col items-center justify-center py-20 text-center">
            <Search className="h-12 w-12 text-muted-foreground/40" />
            <p className="mt-4 text-sm font-medium text-muted-foreground">No icons found</p>
            <p className="text-xs text-muted-foreground/60">Try a different search or category</p>
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}
