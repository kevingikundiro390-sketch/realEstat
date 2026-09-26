import { createFileRoute } from "@tanstack/react-router";
import { Camera, ClipboardList, Handshake, Tag } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/sell")({
  head: () => ({
    meta: [
      { title: "Sell or List Your Home | HomeBase" },
      { name: "description", content: "Learn how to list your home or rental on HomeBase and request a free home valuation." },
      { property: "og:title", content: "Sell Your Home | HomeBase" },
      { property: "og:description", content: "List your home or rental on HomeBase in four simple steps." },
    ],
  }),
  component: SellPage,
});

const steps = [
  { icon: ClipboardList, t: "Tell us about your home", d: "Share the address, size, and features." },
  { icon: Tag, t: "Get a free valuation", d: "A local agent prepares a market price estimate." },
  { icon: Camera, t: "Photos & listing", d: "We photograph your home and publish the listing." },
  { icon: Handshake, t: "Close the deal", d: "Review offers or applicants and close with confidence." },
];
const input = "w-full rounded-md border border-border px-3 py-2.5 text-sm outline-none focus:border-brand";

function SellPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold text-navy sm:text-4xl">Sell or rent out your property</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">Reach thousands of buyers and renters every day. Here's how listing with HomeBase works.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <div key={s.t} className="rounded-lg border border-border p-5">
            <s.icon className="h-6 w-6 text-brand" />
            <p className="mt-3 text-xs font-semibold text-muted-foreground">STEP {i + 1}</p>
            <p className="font-semibold text-navy">{s.t}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => { e.preventDefault(); (e.target as HTMLFormElement).reset(); toast.success("Thanks! An agent will contact you within 24 hours."); }}
        className="mt-10 max-w-2xl space-y-3 rounded-lg border border-border p-6"
      >
        <h2 className="font-display text-xl font-bold text-navy">Request a free valuation</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input required maxLength={100} placeholder="Full name" className={input} />
          <input required type="email" maxLength={255} placeholder="Email" className={input} />
        </div>
        <input required maxLength={200} placeholder="Property address" className={input} />
        <div className="grid gap-3 sm:grid-cols-3">
          <select className={input}><option>I want to sell</option><option>I want to rent it out</option></select>
          <input type="number" min={0} max={20} placeholder="Beds" className={input} />
          <input type="number" min={0} max={20} placeholder="Baths" className={input} />
        </div>
        <textarea maxLength={1000} rows={3} placeholder="Anything else we should know?" className={input} />
        <button className="rounded-md bg-brand px-6 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover">Submit request</button>
      </form>
    </div>
  );
}
