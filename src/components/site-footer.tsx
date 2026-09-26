import { Home } from "lucide-react";

const columns = [
  { title: "Buy", links: ["Homes for sale", "New construction", "Open houses", "Mortgage rates"] },
  { title: "Rent", links: ["Apartments", "Houses for rent", "Rental guide", "Renter tools"] },
  { title: "Sell", links: ["Home valuation", "List your home", "Seller guide", "Find an agent"] },
  { title: "Company", links: ["About us", "Careers", "Contact", "Privacy"] },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <div className="flex items-center gap-2">
              <Home className="h-6 w-6 text-brand" strokeWidth={2.5} fill="currentColor" />
              <span className="font-display text-lg font-extrabold text-navy">HomeBase</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Helping people buy, rent, and sell homes since 2009.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-bold text-navy">{col.title}</h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-brand"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
          © 2026 HomeBase. All rights reserved. Equal Housing Opportunity.
        </p>
      </div>
    </footer>
  );
}
