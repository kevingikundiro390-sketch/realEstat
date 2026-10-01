import { Link } from "@tanstack/react-router";
import { ChevronDown, Compass, Heart, Home, LayoutDashboard, LogOut, Mail, Menu, Tag, User, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth, useFavorites } from "@/lib/store";

const sidebarLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/buy", label: "Explore", icon: Compass },
  { to: "/saved", label: "Saved", icon: Heart },
  { to: "/inbox", label: "Inbox", icon: Mail },
] as const;
const navLinks = [
  { to: "/buy", label: "Buy", icon: Home },
  { to: "/rent", label: "Rent", icon: Home },
  { to: "/sell", label: "Sell", icon: Tag },
] as const;
const resources = [
  { hash: "calculator", label: "Mortgage calculator" },
  { hash: "buying-guide", label: "Home buying guide" },
  { hash: "renting-guide", label: "Renting tips" },
];
const linkCls = "text-sm font-medium text-navy/80 transition-colors hover:text-brand";
type AppLink = { to: "/dashboard" | "/buy" | "/saved" | "/inbox" | "/rent" | "/sell"; label: string; icon: typeof Home; count?: number; onClick?: () => void };

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { favorites } = useFavorites();
  const close = () => setOpen(false);
  const initials = user?.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase() || "U";

  const handleSignOut = async () => {
    try {
      await signOut();
      close();
    } catch {
      toast.error("Could not sign out. Please try again.");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/60 bg-white/70 px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.06)] backdrop-blur-2xl sm:px-6">
        <div className="flex w-full items-center justify-between gap-4">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <img src="/homebase-logo.svg" alt="" className="h-8 w-8 shrink-0" />
            <span className="font-display text-xl font-extrabold tracking-tight text-navy">HomeBase</span>
          </Link>
          <nav className="hidden items-center gap-7 lg:flex">
            {navLinks.map((item) => <Link key={item.to} to={item.to} className={linkCls} activeProps={{ className: "text-brand" }}>{item.label}</Link>)}
            <DropdownMenu>
              <DropdownMenuTrigger className={`flex items-center gap-1 ${linkCls}`}>Resources <ChevronDown className="h-4 w-4" /></DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {resources.map((item) => <DropdownMenuItem key={item.hash} asChild><Link to="/resources" hash={item.hash}>{item.label}</Link></DropdownMenuItem>)}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
          <div className="hidden items-center gap-6 lg:flex">
            <Link to="/saved" className={`flex items-center gap-2 ${linkCls}`}><Heart className="h-4 w-4" />Saved{favorites.length > 0 && <span className="rounded-full bg-brand px-1.5 text-xs text-brand-foreground">{favorites.length}</span>}</Link>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex max-w-56 items-center gap-2 rounded-full border border-border bg-white py-1.5 pl-1.5 pr-3 text-sm font-medium text-navy transition-colors hover:bg-surface">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={`${user.name}'s profile`} className="h-8 w-8 shrink-0 rounded-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">{initials}</span>
                  )}
                  <span className="max-w-40 truncate">{user.email}</span><ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <div className="border-b border-border px-3 py-2"><p className="truncate text-sm font-semibold text-navy">{user.name}</p><p className="truncate text-xs text-muted-foreground">{user.email}</p></div>
                  <DropdownMenuItem asChild><Link to="/dashboard"><User className="mr-2 h-4 w-4" />Dashboard</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/saved"><Heart className="mr-2 h-4 w-4" />Saved homes</Link></DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => void handleSignOut()}><LogOut className="mr-2 h-4 w-4" />Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <><Link to="/signin" className="rounded-full border border-brand/30 bg-brand/5 px-4 py-2 text-sm font-semibold text-brand transition-colors hover:bg-brand/10">Log In</Link><Link to="/signup" className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground shadow-md shadow-brand/20 transition-colors hover:bg-brand-hover">Sign Up</Link></>
            )}
          </div>
          <button onClick={() => setOpen((value) => !value)} aria-label="Toggle menu" className="rounded-md p-2 text-navy hover:bg-surface lg:hidden">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open && (
          <nav aria-label="Mobile navigation" className="mt-3 grid gap-1 border-t border-border pt-3 lg:hidden">
            {[...sidebarLinks, ...navLinks].map((item) => <NavItem key={item.label} to={item.to} label={item.label} icon={item.icon} count={item.to === "/saved" ? favorites.length : undefined} onClick={close} />)}
            <Link to="/resources" onClick={close} className="rounded-md px-3 py-2.5 text-sm font-medium text-navy hover:bg-surface">Resources</Link>
            {user ? <button onClick={() => void handleSignOut()} className="flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium text-navy hover:bg-surface"><LogOut className="h-4 w-4" />Sign out ({user.email})</button> : (
              <div className="grid grid-cols-2 gap-2 pt-2"><Link to="/signin" onClick={close} className="rounded-md border border-brand/30 px-3 py-2.5 text-center text-sm font-semibold text-brand">Log in</Link><Link to="/signup" onClick={close} className="rounded-md bg-brand px-3 py-2.5 text-center text-sm font-semibold text-white">Sign up</Link></div>
            )}
          </nav>
        )}
      </header>

    </>
  );
}

export function SideNavigation() {
  const { favorites } = useFavorites();
  return (
    <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] w-[4.5rem] shrink-0 border-r border-border bg-white px-2 py-5 lg:block">
      <nav aria-label="HomeBase shortcuts" className="flex flex-col items-center gap-2">
        {sidebarLinks.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            aria-label={label}
            title={label}
            activeProps={{ className: "bg-brand/10 text-brand" }}
            className="relative flex h-12 w-12 items-center justify-center rounded-md text-navy/70 transition-colors hover:bg-surface hover:text-brand"
          >
            <Icon className="h-5 w-5" />
            {to === "/saved" && favorites.length > 0 && <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[0.6rem] font-bold text-white">{favorites.length}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

function NavItem({ to, label, icon: Icon, count, onClick }: AppLink) {
  return (
    <Link
      to={to}
      onClick={onClick}
      activeProps={{ className: "bg-brand/8 text-brand" }}
      className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-navy/75 transition-colors hover:bg-surface hover:text-brand"
    >
      <Icon className="h-[1.1rem] w-[1.1rem] shrink-0" />
      <span className="flex-1">{label}</span>
      {count !== undefined && count > 0 && <span className="rounded-full bg-brand px-2 py-0.5 text-xs font-bold text-white">{count}</span>}
    </Link>
  );
}
