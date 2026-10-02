import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Download, Sparkles, Code, Palette, Zap } from "lucide-react";
import { icons, totalRenderedIcons, colorStyles, cameraAngles } from "@/lib/icons";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About | 3D Icons" },
      { name: "description", content: "Learn about 3D Icons - beautifully crafted open source 3D icons." },
    ],
  }),
  component: AboutPage,
});

const features = [
  { icon: Palette, title: "Multiple color styles", desc: "Each icon comes in 4 color styles — original, white, gradient, and dark." },
  { icon: Zap, title: "3 camera angles", desc: "Isometric, front, and angled views for every single icon." },
  { icon: Code, title: "Open source", desc: "MIT licensed. Use freely in personal and commercial projects." },
  { icon: Sparkles, title: "High quality renders", desc: "4K resolution with soft-box lighting and glossy materials." },
];

function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1.5 text-sm font-semibold text-purple-600">
            <Sparkles className="h-4 w-4" /> About
          </div>
          <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Beautifully crafted<br />open source 3D icons
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A collection of {icons.length} unique 3D icons, rendered into {totalRenderedIcons} variations across {colorStyles.length} color styles and {cameraAngles.length} camera angles. Free to use, forever.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-border bg-white/70 p-6 backdrop-blur-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-pink-100">
                <feature.icon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mt-4 text-base font-bold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-foreground">Ready to download?</h2>
          <p className="mt-2 text-sm text-muted-foreground">Get all {totalRenderedIcons} icons in one package.</p>
          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/icons" className="flex items-center gap-2 rounded-2xl bg-foreground px-8 py-3.5 text-sm font-semibold text-background shadow-lg transition-all hover:scale-[1.02]">
              <Download className="h-4 w-4" /> Browse icons
            </Link>
            <Link to="/donate" className="flex items-center gap-2 rounded-2xl border-2 border-foreground/15 bg-white px-8 py-3.5 text-sm font-semibold text-foreground transition-all hover:scale-[1.02]">
              <Heart className="h-4 w-4" /> Donate
            </Link>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
