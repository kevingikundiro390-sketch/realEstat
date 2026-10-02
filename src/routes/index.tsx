import { Link, createFileRoute } from "@tanstack/react-router";
import { Download, Heart, Sparkles } from "lucide-react";
import { icons, categories, totalRenderedIcons, colorStyles, cameraAngles } from "@/lib/icons";
import { IconTile } from "@/components/icon-tile";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "3D Icons | Beautifully crafted open source 3D icons" },
      { name: "description", content: "Download 1000+ beautifully crafted 3D icons. Use with any design tool. Free and open source." },
      { property: "og:title", content: "3D Icons | Beautifully crafted open source 3D icons" },
      { property: "og:description", content: "Download 1000+ beautifully crafted 3D icons. Free and open source." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: LandingPage,
});

const stats = [
  { value: "3", label: "camera angles", position: "top-left" },
  { value: `${totalRenderedIcons}`, label: "rendered icons", position: "bottom-left" },
  { value: `${icons.length}`, label: "unique icons", position: "top-right" },
  { value: `${colorStyles.length}`, label: "colors style", position: "bottom-right" },
];

const softwareIcons = [
  { name: "Blender", emoji: "🟠" },
  { name: "Figma", emoji: "🎯" },
  { name: "Sketch", emoji: "🟡" },
  { name: "Adobe XD", emoji: "🟪" },
  { name: "Photoshop", emoji: "🟦" },
  { name: "Illustrator", emoji: "🟫" },
];

function LandingPage() {
  const showcase = icons.slice(0, 24);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-shell relative overflow-hidden px-4 pt-16 pb-12 sm:px-6 lg:pt-24 lg:pb-16">
        <div className="mx-auto max-w-4xl text-center">
          {/* Floating stats */}
          <div className="relative">
            <div className="floaty-chip absolute -left-4 top-0 hidden rounded-2xl bg-white/80 px-4 py-3 shadow-lg backdrop-blur-sm sm:block lg:-left-12">
              <p className="text-2xl font-extrabold text-foreground">3</p>
              <p className="text-xs text-muted-foreground">camera angles</p>
            </div>
            <div className="floaty-slow absolute -right-4 top-4 hidden rounded-2xl bg-white/80 px-4 py-3 shadow-lg backdrop-blur-sm sm:block lg:-right-12">
              <p className="text-2xl font-extrabold text-foreground">{icons.length}</p>
              <p className="text-xs text-muted-foreground">unique icons</p>
            </div>
            <div className="floaty-slow absolute -left-8 bottom-0 hidden rounded-2xl bg-white/80 px-4 py-3 shadow-lg backdrop-blur-sm lg:block">
              <p className="text-2xl font-extrabold text-foreground">{totalRenderedIcons}</p>
              <p className="text-xs text-muted-foreground">rendered icons</p>
            </div>
            <div className="floaty-chip absolute -right-8 bottom-4 hidden rounded-2xl bg-white/80 px-4 py-3 shadow-lg backdrop-blur-sm lg:block">
              <p className="text-2xl font-extrabold text-foreground">{colorStyles.length}</p>
              <p className="text-xs text-muted-foreground">colors style</p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-1.5 text-sm font-semibold text-pink-600">
              <Sparkles className="h-4 w-4" />
              Open Source
            </div>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Beautifully crafted<br />open source 3D icons
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">Use with any design tool</p>
          </div>

          {/* Software icons row */}
          <div className="mt-8 flex items-center justify-center gap-4 sm:gap-6">
            {softwareIcons.map((sw) => (
              <div key={sw.name} className="icon-3d flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-md sm:h-16 sm:w-16">
                {sw.emoji}
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/icons"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground px-8 py-4 text-base font-semibold text-background shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl sm:w-auto"
            >
              <Download className="h-5 w-5" />
              Download All
            </Link>
            <Link
              to="/donate"
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-foreground/15 bg-white px-8 py-4 text-base font-semibold text-foreground transition-all hover:scale-[1.02] hover:border-foreground/30 sm:w-auto"
            >
              <Heart className="h-5 w-5" />
              Donate & Support
            </Link>
          </div>
        </div>
      </section>

      {/* Category showcase */}
      <section className="px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center font-display text-2xl font-bold text-foreground sm:text-3xl">Browse by category</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">{icons.length} unique icons across {categories.length} categories</p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to="/icons"
                search={{ category: cat.id }}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-white/60 p-6 text-center transition-all hover:border-brand/30 hover:bg-white hover:shadow-md"
              >
                <span className="text-3xl transition-transform group-hover:scale-110">{cat.emoji}</span>
                <span className="text-xs font-semibold text-foreground">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Icon grid showcase */}
      <section className="px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">Featured icons</h2>
            <Link to="/icons" className="text-sm font-semibold text-brand hover:underline">View all →</Link>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {showcase.map((icon) => (
              <IconTile key={icon.id} icon={icon} />
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
