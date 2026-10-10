import { Link } from "@tanstack/react-router";
import { Building2, ChevronRight, Home, KeyRound, Tag } from "lucide-react";

const actions = [
  { icon: Home, title: "Buy a home", desc: "Explore homes for sale", to: "/buy" },
  { icon: Building2, title: "Find a rental", desc: "Apartments and homes to rent", to: "/rent" },
  { icon: Tag, title: "Sell your home", desc: "Start with a free valuation", to: "/sell" },
  { icon: KeyRound, title: "List a rental", desc: "Connect with future tenants", to: "/sell" },
] as const;

export function QuickActions() {
  return (
    <section className="w-full bg-[#f3f7fc] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Make your move</p>
            <h2 className="mt-2 font-display text-2xl font-extrabold tracking-[-0.04em] text-navy sm:text-3xl">Where would you like to start?</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-500">A clearer path to buying, renting, or listing your next place.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {actions.map(({ icon: Icon, title, desc, to }, index) => (
            <Link
              key={title}
              to={to}
              className="group relative flex min-h-32 items-center gap-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_24px_rgba(29,55,91,0.04)] transition-all duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_18px_36px_rgba(29,55,91,0.1)]"
            >
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors ${index % 2 === 0 ? "bg-sky-50 text-sky-700 group-hover:bg-sky-100" : "bg-indigo-50 text-indigo-700 group-hover:bg-indigo-100"}`}><Icon className="h-5 w-5" strokeWidth={2} /></span>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-navy">{title}</h3>
                <p className="mt-1 text-sm leading-5 text-slate-500">{desc}</p>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-brand" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
