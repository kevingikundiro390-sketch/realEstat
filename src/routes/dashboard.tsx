import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Heart, Search } from "lucide-react";
import { useAuth, useFavorites } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard | HomeBase" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const { favorites } = useFavorites();

  return (
    <main className="min-h-[calc(100dvh-4rem)] w-full bg-[#f7f9fc] px-5 py-8 sm:px-8 lg:px-10">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">HomeBase</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-navy sm:text-4xl">Welcome{user?.name ? `, ${user.name}` : " home"}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Your home search, all in one place.</p>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link to="/saved" className="flex min-h-36 items-center justify-between border-y border-border bg-white px-5 py-6 transition-colors hover:bg-surface">
          <div>
            <Heart className="h-5 w-5 text-brand" />
            <p className="mt-4 text-2xl font-extrabold text-navy">{favorites.length}</p>
            <p className="text-sm text-muted-foreground">Saved homes</p>
          </div>
          <ArrowRight className="h-5 w-5 text-brand" />
        </Link>
        <Link to="/buy" className="flex min-h-36 items-center justify-between border-y border-border bg-white px-5 py-6 transition-colors hover:bg-surface">
          <div>
            <Search className="h-5 w-5 text-brand" />
            <p className="mt-4 text-lg font-bold text-navy">Explore homes</p>
            <p className="text-sm text-muted-foreground">Browse homes for sale and rent</p>
          </div>
          <ArrowRight className="h-5 w-5 text-brand" />
        </Link>
      </section>
    </main>
  );
}