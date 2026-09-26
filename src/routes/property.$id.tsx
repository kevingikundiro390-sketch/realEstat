import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Bath, BedDouble, Calendar, Check, Home, MapPin, Phone, Ruler } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SaveButton } from "@/components/listing-card";
import { formatPrice, getListing, type Listing } from "@/lib/listings";
import { useFavorites } from "@/lib/store";

export const Route = createFileRoute("/property/$id")({
  loader: ({ params }) => {
    const l = getListing(params.id);
    if (!l) throw notFound();
    return l;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Listing not found | HomeBase" }, { name: "robots", content: "noindex" }] };
    const t = `${loaderData.address}, ${loaderData.city} | ${formatPrice(loaderData)} | HomeBase`;
    const d = `${loaderData.beds} bd, ${loaderData.baths} ba, ${loaderData.sqft.toLocaleString()} sqft ${loaderData.type.toLowerCase()} ${loaderData.status === "sale" ? "for sale" : "for rent"} in ${loaderData.city}, ${loaderData.state}.`;
    return { meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }] };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-extrabold text-navy">This listing isn't available</h1>
      <Link to="/buy" className="mt-4 inline-block font-semibold text-brand">Browse homes</Link>
    </div>
  ),
  errorComponent: ({ error }) => <p className="p-10 text-center">{error.message}</p>,
  component: PropertyPage,
});

const input = "w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-brand";

function LeadDialog({ open, onOpenChange, l, kind }: { open: boolean; onOpenChange: (v: boolean) => void; l: Listing; kind: "contact" | "tour" }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{kind === "tour" ? "Schedule a tour" : `Contact ${l.agent.name}`}</DialogTitle></DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onOpenChange(false);
            toast.success(kind === "tour" ? "Tour requested! The agent will confirm shortly." : "Message sent! The agent will reply soon.");
          }}
          className="space-y-3"
        >
          <input required maxLength={100} placeholder="Full name" className={input} />
          <input required type="email" maxLength={255} placeholder="Email" className={input} />
          <input type="tel" maxLength={30} placeholder="Phone (optional)" className={input} />
          {kind === "tour" && (
            <div className="grid grid-cols-2 gap-2">
              <input required type="date" min={new Date().toISOString().slice(0, 10)} className={input} />
              <select className={input}>{["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"].map((t) => <option key={t}>{t}</option>)}</select>
            </div>
          )}
          <textarea required maxLength={1000} rows={3} className={input} defaultValue={`I'm interested in ${l.address}, ${l.city}.`} />
          <button className="w-full rounded-md bg-brand py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover">
            {kind === "tour" ? "Request tour" : "Send message"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PropertyPage() {
  const l = Route.useLoaderData();
  const [active, setActive] = useState(0);
  const [dialog, setDialog] = useState<null | "contact" | "tour">(null);
  const { isSaved } = useFavorites();
  const payment = l.status === "sale" ? Math.round(((l.price * 0.8) * (0.065 / 12)) / (1 - Math.pow(1 + 0.065 / 12, -360))) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <Link to={l.status === "sale" ? "/buy" : "/rent"} className="inline-flex items-center gap-1 text-sm font-medium text-brand">
        <ArrowLeft className="h-4 w-4" /> Back to results
      </Link>

      <div className="mt-4 grid gap-2 lg:grid-cols-[2fr_1fr]">
        <img src={l.photos[active]} alt={l.address} width={944} height={704} className="h-72 w-full rounded-lg object-cover sm:h-[28rem]" />
        <div className="grid grid-cols-4 gap-2 lg:grid-cols-2">
          {l.photos.map((p, i) => (
            <button key={i} onClick={() => setActive(i)} className={`overflow-hidden rounded-lg ring-2 ${i === active ? "ring-brand" : "ring-transparent"}`}>
              <img src={p} alt={`Photo ${i + 1}`} loading="lazy" width={944} height={704} className="h-20 w-full object-cover sm:h-full lg:h-full" />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div>
          <span className="rounded bg-surface px-2 py-1 text-xs font-semibold text-navy">{l.status === "sale" ? "For Sale" : "For Rent"} · {l.type}</span>
          <p className="mt-3 font-display text-3xl font-extrabold text-navy sm:text-4xl">{formatPrice(l)}</p>
          <h1 className="mt-1 text-lg font-medium text-navy">{l.address}, {l.city}, {l.state} {l.zip}</h1>
          <div className="mt-4 flex flex-wrap gap-5 text-sm text-navy">
            <span className="flex items-center gap-1.5"><BedDouble className="h-5 w-5 text-brand" />{l.beds} beds</span>
            <span className="flex items-center gap-1.5"><Bath className="h-5 w-5 text-brand" />{l.baths} baths</span>
            <span className="flex items-center gap-1.5"><Ruler className="h-5 w-5 text-brand" />{l.sqft.toLocaleString()} sqft</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-5 w-5 text-brand" />Built {l.yearBuilt}</span>
          </div>

          <h2 className="mt-8 font-display text-xl font-bold text-navy">About this home</h2>
          <p className="mt-2 leading-relaxed text-muted-foreground">{l.description}</p>

          <h2 className="mt-8 font-display text-xl font-bold text-navy">Facts & features</h2>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            {[["Type", l.type], ["Year built", l.yearBuilt], ["Neighborhood", l.neighborhood], ["Lot", l.lotSize ?? "—"], ["Price/sqft", `$${Math.round(l.price / l.sqft)}`], ["On HomeBase", `${l.listedDaysAgo} days`]].map(([k, v]) => (
              <div key={k as string} className="rounded-md bg-surface p-3"><dt className="text-muted-foreground">{k}</dt><dd className="font-semibold text-navy">{v}</dd></div>
            ))}
          </dl>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {l.features.map((f) => <li key={f} className="flex items-center gap-2 text-sm text-navy"><Check className="h-4 w-4 text-brand" />{f}</li>)}
          </ul>

          <h2 className="mt-8 flex items-center gap-2 font-display text-xl font-bold text-navy"><MapPin className="h-5 w-5 text-brand" />Location</h2>
          <p className="mt-1 text-sm text-muted-foreground">{l.neighborhood}, {l.city}, {l.state}</p>
          <iframe
            title="Map"
            className="mt-3 h-72 w-full rounded-lg border border-border"
            loading="lazy"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${l.lng - 0.01},${l.lat - 0.007},${l.lng + 0.01},${l.lat + 0.007}&layer=mapnik&marker=${l.lat},${l.lng}`}
          />
        </div>

        <aside className="h-fit space-y-3 rounded-lg border border-border p-5 lg:sticky lg:top-20">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand"><Home className="h-5 w-5" /></div>
            <div><p className="font-semibold text-navy">{l.agent.name}</p><p className="text-xs text-muted-foreground">HomeBase listing agent</p></div>
          </div>
          <button onClick={() => setDialog("tour")} className="w-full rounded-md bg-brand py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover">Schedule a Tour</button>
          <button onClick={() => setDialog("contact")} className="w-full rounded-md border border-brand py-2.5 text-sm font-semibold text-brand hover:bg-surface">Contact Agent</button>
          <div className="flex items-center justify-center gap-2 rounded-md border border-border py-2 text-sm font-semibold text-navy">
            <SaveButton id={l.id} className="text-navy" /> {isSaved(l.id) ? "Saved" : "Save"}
          </div>
          <a href={`tel:${l.agent.phone}`} className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-brand"><Phone className="h-4 w-4" />{l.agent.phone}</a>
          {payment && <p className="rounded-md bg-surface p-3 text-center text-sm text-navy">Est. payment <b>${payment.toLocaleString()}/mo</b><br /><span className="text-xs text-muted-foreground">20% down, 6.5% 30-yr fixed</span></p>}
        </aside>
      </div>
      <LeadDialog open={!!dialog} onOpenChange={(v) => !v && setDialog(null)} l={l} kind={dialog ?? "contact"} />
    </div>
  );
}
