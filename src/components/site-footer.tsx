import { Home } from "lucide-react";

const columns = [
  { title: "Buy", links: ["Homes for sale", "New construction", "Open houses", "Mortgage rates"] },
  { title: "Rent", links: ["Apartments", "Houses for rent", "Rental guide", "Renter tools"] },
  { title: "Sell", links: ["Home valuation", "List your home", "Seller guide", "Find an agent"] },
  { title: "Company", links: ["About us", "Careers", "Contact", "Privacy"] },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/15 bg-navy/90 text-background shadow-[0_-18px_45px_rgba(15,23,42,0.18)] backdrop-blur-2xl">
      <div className="w-full px-4 py-12 sm:px-8 lg:px-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <div className="flex items-center gap-2">
              <Home className="h-6 w-6 text-brand" strokeWidth={2.5} fill="currentColor" />
              <span className="font-display text-lg font-semibold">HomeBase</span>
            </div>
            <p className="mt-3 text-sm text-background/60">
              Helping people buy, rent, and sell homes since 2009.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-bold text-background">{col.title}</h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-background/60 transition-colors hover:text-brand"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-10 border-t border-background/15 pt-6 text-xs text-background/50">
          © 2026 HomeBase. All rights reserved. Equal Housing Opportunity.
        </p>
      </div>
    </footer>
  );
}
