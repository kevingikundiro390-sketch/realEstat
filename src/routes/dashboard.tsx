import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Download, Heart, Sparkles } from "lucide-react";
import { icons, totalRenderedIcons, categories } from "@/lib/icons";
import { useAuth, useFavorites } from "@/lib/store";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard | 3D Icons" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">3D Icons</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
          Welcome{user?.name ? `, ${user.name}` : ""}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Your icon library, all in one place.</p>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <Link to="/saved" className="flex min-h-32 items-center justify-between rounded-2xl border border-border bg-white p-5 transition-colors hover:bg-surface">
            <div>
              <Heart className="h-5 w-5 text-brand" />
              <p className="mt-3 text-2xl font-extrabold text-foreground">{favorites.length}</p>
              <p className="text-sm text-muted-foreground">Saved icons</p>
            </div>
            <ArrowRight className="h-5 w-5 text-brand" />
          </Link>
          <Link to="/icons" className="flex min-h-32 items-center justify-between rounded-2xl border border-border bg-white p-5 transition-colors hover:bg-surface">
            <div>
              <Sparkles className="h-5 w-5 text-brand" />
              <p className="mt-3 text-2xl font-extrabold text-foreground">{totalRenderedIcons}</p>
              <p className="text-sm text-muted-foreground">Total icons</p>
            </div>
            <ArrowRight className="h-5 w-5 text-brand" />
          </Link>
          <Link to="/icons" className="flex min-h-32 items-center justify-between rounded-2xl border border-border bg-white p-5 transition-colors hover:bg-surface">
            <div>
              <Download className="h-5 w-5 text-brand" />
              <p className="mt-3 text-2xl font-extrabold text-foreground">{categories.length}</p>
              <p className="text-sm text-muted-foreground">Categories</p>
            </div>
            <ArrowRight className="h-5 w-5 text-brand" />
          </Link>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-bold text-foreground">Browse categories</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
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
        </section>
      </div>
      <SiteFooter />
    </div>
  );
}
