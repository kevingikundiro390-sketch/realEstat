import { Link } from "@tanstack/react-router";
import { ChevronDown, Heart, Home, LogOut, Menu, User, X } from "lucide-react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth, useFavorites } from "@/lib/store";

const navLinks = [
  { to: "/buy", label: "Buy" },
  { to: "/rent", label: "Rent" },
  { to: "/sell", label: "Sell" },
] as const;
const resources = [
  { hash: "calculator", label: "Mortgage calculator" },
  { hash: "buying-guide", label: "Home buying guide" },
  { hash: "renting-guide", label: "Renting tips" },
];
const linkCls = "text-sm font-medium text-navy/80 transition-colors hover:text-brand";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { favorites } = useFavorites();
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-8">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <Home className="h-7 w-7 text-brand" strokeWidth={2.5} fill="currentColor" />
            <span className="font-display text-xl font-extrabold tracking-tight text-navy">HomeBase</span>
          </Link>
          <nav className="hidden items-center gap-7 lg:flex">
            {navLinks.map((l) => <Link key={l.to} to={l.to} className={linkCls} activeProps={{ className: "text-brand" }}>{l.label}</Link>)}
            <DropdownMenu>
              <DropdownMenuTrigger className={`flex items-center gap-1 ${linkCls}`}>Resources <ChevronDown className="h-4 w-4" /></DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {resources.map((r) => (
                  <DropdownMenuItem key={r.hash} asChild><Link to="/resources" hash={r.hash}>{r.label}</Link></DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        <div className="hidden items-center gap-6 lg:flex">
          <Link to="/saved" className={`flex items-center gap-2 ${linkCls}`}>
            <Heart className="h-4 w-4" /> Saved{favorites.length > 0 && <span className="rounded-full bg-brand px-1.5 text-xs text-brand-foreground">{favorites.length}</span>}
          </Link>
          {user ? (
            <>
              <span className="flex items-center gap-2 text-sm font-medium text-navy"><User className="h-4 w-4" />{user.name}</span>
              <button onClick={signOut} className={`flex items-center gap-1 ${linkCls}`}><LogOut className="h-4 w-4" />Sign out</button>
            </>
          ) : (
            <>
              <Link to="/signin" className={`flex items-center gap-2 ${linkCls}`}><User className="h-4 w-4" />Sign In</Link>
              <Link to="/signup" className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground hover:bg-brand-hover">Create Account</Link>
            </>
          )}
        </div>

        <button onClick={() => setOpen((v) => !v)} aria-label="Toggle menu" className="rounded-md p-2 text-navy hover:bg-surface lg:hidden">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-border bg-background px-4 py-4 lg:hidden">
          {navLinks.map((l) => <Link key={l.to} to={l.to} onClick={close} className="rounded-md px-2 py-3 text-sm font-medium text-navy hover:bg-surface">{l.label}</Link>)}
          <Link to="/resources" onClick={close} className="rounded-md px-2 py-3 text-sm font-medium text-navy hover:bg-surface">Resources</Link>
          <Link to="/saved" onClick={close} className="rounded-md px-2 py-3 text-sm font-medium text-navy hover:bg-surface">Saved ({favorites.length})</Link>
          {user ? (
            <button onClick={() => { signOut(); close(); }} className="rounded-md px-2 py-3 text-left text-sm font-medium text-navy hover:bg-surface">Sign out ({user.name})</button>
          ) : (
            <>
              <Link to="/signin" onClick={close} className="rounded-md px-2 py-3 text-sm font-medium text-navy hover:bg-surface">Sign In</Link>
              <Link to="/signup" onClick={close} className="mt-2 rounded-md bg-brand px-4 py-3 text-center text-sm font-semibold text-brand-foreground">Create Account</Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
