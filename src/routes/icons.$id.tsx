import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Download, Heart, X } from "lucide-react";
import { useState } from "react";
import { getIconById, icons, categories, colorStyles, cameraAngles, type ColorStyle, type CameraAngle } from "@/lib/icons";
import { useFavorites } from "@/lib/store";
import { IconTile } from "@/components/icon-tile";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/icons/$id")({
  head: () => ({
    meta: [{ title: "Icon Detail | 3D Icons" }],
  }),
  component: IconDetailPage,
});

const materials = [
  { id: "orange", label: "Orange", color: "#FF8C42" },
  { id: "red", label: "Red", color: "#EE5A52" },
  { id: "purple", label: "Purple", color: "#A259FF" },
  { id: "sky", label: "Sky", color: "#74B9FF" },
  { id: "green", label: "Green", color: "#55EFC4" },
];

function IconDetailPage() {
  const { id } = Route.useParams();
  const icon = getIconById(id);
  const { isSaved, toggle } = useFavorites();
  const [colorStyle, setColorStyle] = useState<ColorStyle>("original");
  const [angle, setAngle] = useState<CameraAngle>("isometric");
  const [material, setMaterial] = useState("purple");
  const [roughness, setRoughness] = useState(20);
  const [metalness, setMetalness] = useState(20);
  const [selectedSize, setSelectedSize] = useState("1200");

  if (!icon) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <p className="text-lg font-semibold text-foreground">Icon not found</p>
        <Link to="/icons" className="mt-4 text-sm font-semibold text-brand hover:underline">← Back to all icons</Link>
      </div>
    );
  }

  const saved = isSaved(icon.id);
  const related = icons.filter((i) => i.category === icon.category && i.id !== icon.id).slice(0, 9);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <Link to="/icons" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-brand">
          <ArrowLeft className="h-4 w-4" /> Back to icons
        </Link>

        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Left: Preview + Config */}
          <div className="flex flex-col gap-4">
            {/* Preview area */}
            <div className="icon-preview-bg flex flex-col items-center justify-center rounded-3xl p-12">
              <div
                className="icon-3d flex h-48 w-48 items-center justify-center rounded-[2rem] text-8xl"
                style={{
                  background: `linear-gradient(135deg, ${icon.gradient[0]}33, ${icon.gradient[1]}33)`,
                  transform: angle === "front" ? "none" : angle === "angled" ? "perspective(400px) rotateX(10deg) rotateY(-10deg)" : "perspective(400px) rotateY(25deg) rotateX(5deg)",
                }}
              >
                <span style={{ filter: `drop-shadow(0 8px 16px rgba(0,0,0,0.2))` }}>{icon.emoji}</span>
              </div>
              <p className="mt-6 text-sm font-semibold text-foreground">{icon.name}</p>
              <p className="text-xs text-muted-foreground">{categories.find((c) => c.id === icon.category)?.label}</p>
            </div>

            {/* Download bar */}
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4">
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground outline-none"
              >
                <option value="256">256 px</option>
                <option value="512">512 px</option>
                <option value="1200">1200 px</option>
                <option value="svg">SVG</option>
              </select>
              <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-foreground/90">
                <Download className="h-4 w-4" /> Download
              </button>
              <button
                onClick={() => toggle(icon.id)}
                className="flex items-center justify-center rounded-full border border-border px-4 py-2.5 transition-colors hover:bg-surface"
              >
                <Heart className={`h-4 w-4 ${saved ? "fill-brand text-brand" : "text-muted-foreground"}`} />
              </button>
            </div>

            {/* Material config */}
            <div className="rounded-2xl border border-border bg-white p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">Material</h3>
              </div>
              <div className="mt-4 space-y-1">
                {materials.map((mat) => (
                  <button
                    key={mat.id}
                    onClick={() => setMaterial(mat.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      material === mat.id ? "bg-surface text-foreground" : "text-muted-foreground hover:bg-surface/50"
                    }`}
                  >
                    <span className="h-6 w-6 rounded-full" style={{ background: mat.color }} />
                    {mat.label}
                  </button>
                ))}
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-muted-foreground">Color</label>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <button className="h-8 w-8 rounded-full" style={{ background: materials.find((m) => m.id === material)?.color }} />
                    <span className="text-sm font-medium text-foreground">{materials.find((m) => m.id === material)?.label}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-muted-foreground">Roughness</label>
                    <span className="text-xs font-medium text-foreground">{roughness}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={roughness}
                    onChange={(e) => setRoughness(Number(e.target.value))}
                    className="mt-2 w-full accent-brand"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-muted-foreground">Metalness</label>
                    <span className="text-xs font-medium text-foreground">{metalness}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={metalness}
                    onChange={(e) => setMetalness(Number(e.target.value))}
                    className="mt-2 w-full accent-brand"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Related icons browser */}
          <div className="flex flex-col">
            <div className="rounded-2xl border border-border bg-white p-4">
              <h3 className="text-sm font-bold text-foreground">More in {categories.find((c) => c.id === icon.category)?.label}</h3>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {related.map((relIcon) => (
                  <Link
                    key={relIcon.id}
                    to="/icons/$id"
                    params={{ id: relIcon.id }}
                    className="icon-tile flex flex-col items-center p-3"
                  >
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-xl text-2xl"
                      style={{ background: `linear-gradient(135deg, ${relIcon.gradient[0]}22, ${relIcon.gradient[1]}22)` }}
                    >
                      {relIcon.emoji}
                    </div>
                    <p className="mt-2 text-center text-[0.65rem] font-medium text-foreground/70">{relIcon.name}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Color & angle quick switch */}
            <div className="mt-4 rounded-2xl border border-border bg-white p-4">
              <h3 className="text-sm font-bold text-foreground">Color Style</h3>
              <div className="mt-3 flex gap-2">
                {colorStyles.map((cs) => (
                  <button
                    key={cs.id}
                    onClick={() => setColorStyle(cs.id)}
                    className={`h-9 w-9 rounded-full border-2 transition-all ${colorStyle === cs.id ? "border-brand scale-110" : "border-border"}`}
                    style={{ background: `linear-gradient(135deg, ${cs.swatch[0]}, ${cs.swatch[1]})` }}
                    title={cs.label}
                  />
                ))}
              </div>
              <h3 className="mt-5 text-sm font-bold text-foreground">Camera Angle</h3>
              <div className="mt-3 flex gap-2">
                {cameraAngles.map((ca) => (
                  <button
                    key={ca.id}
                    onClick={() => setAngle(ca.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      angle === ca.id ? "bg-foreground text-background" : "bg-surface text-foreground/70 hover:bg-surface"
                    }`}
                  >
                    {ca.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
