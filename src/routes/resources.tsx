import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Buyer & Renter Resources | HomeBase" },
      { name: "description", content: "Mortgage calculator, buying guide, and renting tips from HomeBase." },
      { property: "og:title", content: "Resources | HomeBase" },
      { property: "og:description", content: "Mortgage calculator and home buying guides." },
    ],
  }),
  component: ResourcesPage,
});

const input = "w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-brand";

function ResourcesPage() {
  const [price, setPrice] = useState(400000);
  const [down, setDown] = useState(20);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);
  const p = price * (1 - down / 100), r = rate / 100 / 12, n = years * 12;
  const pay = r ? (p * r) / (1 - Math.pow(1 + r, -n)) : p / n;

  return (
    <div className="w-full px-4 py-10 sm:px-8 lg:px-10">
      <h1 className="font-display text-3xl font-extrabold text-navy">Resources</h1>
      <section id="calculator" className="mt-8 grid gap-6 rounded-lg border border-border p-6 md:grid-cols-2">
        <div className="space-y-3">
          <h2 className="font-display text-xl font-bold text-navy">Mortgage calculator</h2>
          <label className="block text-sm">Home price<input type="number" className={input} value={price} onChange={(e) => setPrice(+e.target.value)} /></label>
          <label className="block text-sm">Down payment (%)<input type="number" className={input} value={down} onChange={(e) => setDown(+e.target.value)} /></label>
          <label className="block text-sm">Interest rate (%)<input type="number" step="0.1" className={input} value={rate} onChange={(e) => setRate(+e.target.value)} /></label>
          <label className="block text-sm">Loan term<select className={input} value={years} onChange={(e) => setYears(+e.target.value)}><option value={30}>30 years</option><option value={15}>15 years</option></select></label>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg bg-surface p-6 text-center">
          <p className="text-sm text-muted-foreground">Estimated monthly payment</p>
          <p className="font-display text-4xl font-extrabold text-navy">${isFinite(pay) ? Math.round(pay).toLocaleString() : 0}</p>
          <p className="mt-1 text-xs text-muted-foreground">Principal & interest only</p>
        </div>
      </section>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section id="buying-guide" className="rounded-lg border border-border p-6">
          <h2 className="font-display text-xl font-bold text-navy">Home buying guide</h2>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Set your budget and get pre-approved.</li><li>Pick neighborhoods and must-have features.</li>
            <li>Tour homes and compare.</li><li>Make an offer and schedule inspection.</li><li>Close and get your keys.</li>
          </ol>
        </section>
        <section id="renting-guide" className="rounded-lg border border-border p-6">
          <h2 className="font-display text-xl font-bold text-navy">Renting tips</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Aim to keep rent under 30% of income.</li><li>Read the lease closely before signing.</li>
            <li>Document the unit's condition at move-in.</li><li>Ask what utilities are included.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
