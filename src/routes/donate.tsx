import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Coffee, Star, Zap } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/donate")({
  head: () => ({
    meta: [
      { title: "Donate | 3D Icons" },
      { name: "description", content: "Support the 3D Icons open source project." },
    ],
  }),
  component: DonatePage,
});

const tiers = [
  { icon: Coffee, amount: "$5", title: "Coffee", desc: "Buy us a coffee to keep the renders flowing.", color: "from-amber-100 to-orange-100", textColor: "text-orange-600" },
  { icon: Star, amount: "$25", title: "Supporter", desc: "Help us create new icon packs every month.", color: "from-purple-100 to-pink-100", textColor: "text-purple-600" },
  { icon: Zap, amount: "$100", title: "Sponsor", desc: "Sponsor a full category of your choice.", color: "from-blue-100 to-cyan-100", textColor: "text-blue-600" },
];

function DonatePage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-1.5 text-sm font-semibold text-pink-600">
            <Heart className="h-4 w-4" /> Donate
          </div>
          <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Support the project
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            3D Icons is free and open source. Your support helps us keep rendering and adding new icons.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {tiers.map((tier) => (
            <div key={tier.title} className="flex flex-col items-center rounded-2xl border border-border bg-white/70 p-6 text-center backdrop-blur-sm transition-all hover:shadow-md">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${tier.color}`}>
                <tier.icon className={`h-7 w-7 ${tier.textColor}`} />
              </div>
              <p className="mt-4 text-3xl font-extrabold text-foreground">{tier.amount}</p>
              <p className="mt-1 text-sm font-bold text-foreground">{tier.title}</p>
              <p className="mt-2 text-xs text-muted-foreground">{tier.desc}</p>
              <button className={`mt-5 w-full rounded-full bg-foreground py-2.5 text-sm font-semibold text-background transition-colors hover:bg-foreground/90`}>
                Donate {tier.amount}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 p-8 text-center">
          <h2 className="font-display text-xl font-bold text-foreground">Other ways to support</h2>
          <p className="mt-2 text-sm text-muted-foreground">Star us on GitHub, share with friends, or contribute icons.</p>
          <Link to="/icons" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline">
            Browse icons →
          </Link>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
