import { ChevronDown, Heart, Home, Menu, User, X } from "lucide-react";
import { useState } from "react";

const navLinks = ["Buy", "Rent", "Sell"];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6 lg:flex lg:justify-between">
        <div className="flex min-w-0 items-center gap-8">
          <a href="/" className="flex shrink-0 items-center gap-2">
            <Home className="h-7 w-7 shrink-0 text-brand" strokeWidth={2.5} fill="currentColor" />
            <span className="font-display text-xl font-extrabold tracking-tight text-navy">
              HomeBase
            </span>
          </a>
          <nav className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm font-medium text-navy/80 transition-colors hover:text-brand"
              >
                {link}
              </a>
            ))}
            <button className="flex items-center gap-1 text-sm font-medium text-navy/80 transition-colors hover:text-brand">
              Resources
              <ChevronDown className="h-4 w-4" />
            </button>
          </nav>
        </div>

        <div className="hidden items-center gap-6 lg:flex">
          <a
            href="#"
            className="flex items-center gap-2 text-sm font-medium text-navy/80 transition-colors hover:text-brand"
          >
            <Heart className="h-4 w-4" />
            Saved
          </a>
          <a
            href="#"
            className="flex items-center gap-2 text-sm font-medium text-navy/80 transition-colors hover:text-brand"
          >
            <User className="h-4 w-4" />
            Sign In
          </a>
          <button className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-hover">
            Create Account
          </button>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className="justify-self-end rounded-md p-2 text-navy transition-colors hover:bg-surface lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {[...navLinks, "Resources", "Saved", "Sign In"].map((link) => (
              <a
                key={link}
                href="#"
                className="rounded-md px-2 py-2 text-sm font-medium text-navy/80 transition-colors hover:bg-surface hover:text-brand"
              >
                {link}
              </a>
            ))}
            <button className="mt-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-hover">
              Create Account
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
