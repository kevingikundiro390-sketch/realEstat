import { Building2, ChevronRight, Home, KeyRound, Tag } from "lucide-react";

const actions = [
  { icon: Home, title: "Buy a Home", desc: "Browse homes for sale" },
  { icon: Building2, title: "Rent a Home", desc: "Find apartments and houses for rent" },
  { icon: Tag, title: "Sell Your Home", desc: "Get a free home valuation" },
  { icon: KeyRound, title: "List a Rental", desc: "Reach qualified tenants" },
];

export function QuickActions() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map(({ icon: Icon, title, desc }) => (
          <a
            key={title}
            href="#"
            className="group flex items-center gap-4 rounded-lg border border-border bg-background p-5 transition-all hover:border-brand hover:shadow-sm"
          >
            <Icon className="h-8 w-8 shrink-0 text-brand" strokeWidth={1.5} />
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-navy">{title}</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">{desc}</p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
          </a>
        ))}
      </div>
    </section>
  );
}
