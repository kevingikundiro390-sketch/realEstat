import { Link } from "@tanstack/react-router";
import { ChevronDown, Download, Heart, LogOut, Menu, Search, User, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth, useFavorites } from "@/lib/store";

const linkCls = "text-sm font-medium text-foreground/70 transition-colors hover:text-brand";

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
    <header className="sticky top-0 z-50 w-full border-b border-white/40 bg-white/60 px-4 py-3 backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#7C5CFF] to-[#FF6B9D] text-white shadow-md shadow-purple-200">
            <span className="text-lg font-extrabold">3</span>
          </div>
          <span className="font-display text-xl font-extrabold tracking-tight text-foreground">3D Icons</span>
          <span className="hidden rounded-full bg-pink-100 px-2.5 py-0.5 text-xs font-semibold text-pink-600 sm:inline">Product of Day</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          <Link to="/icons" className={linkCls}>Icons</Link>
          <Link to="/about" className={linkCls}>About</Link>
          <Link to="/donate" className={linkCls}>Donate</Link>
          <Link to="/saved" className={`flex items-center gap-1.5 ${linkCls}`}>
            <Heart className="h-4 w-4" />
            Saved
            {favorites.length > 0 && <span className="rounded-full bg-brand px-1.5 text-xs text-brand-foreground">{favorites.length}</span>}
          </Link>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex max-w-56 items-center gap-2 rounded-full border border-border bg-white py-1.5 pl-1.5 pr-3 text-sm font-medium text-foreground transition-colors hover:bg-surface">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="h-8 w-8 shrink-0 rounded-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7C5CFF] to-[#FF6B9D] text-xs font-bold text-white">{initials}</span>
                )}
                <span className="max-w-40 truncate">{user.email}</span>
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="border-b border-border px-3 py-2">
                  <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuItem asChild><Link to="/dashboard"><User className="mr-2 h-4 w-4" />Dashboard</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/saved"><Heart className="mr-2 h-4 w-4" />Saved icons</Link></DropdownMenuItem>
                <DropdownMenuItem onSelect={() => void handleSignOut()}><LogOut className="mr-2 h-4 w-4" />Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/signin" className="rounded-full border border-foreground/15 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface">Log In</Link>
              <Link to="/signup" className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-foreground/90">Sign Up</Link>
            </>
          )}
        </div>

        <button onClick={() => setOpen((v) => !v)} aria-label="Toggle menu" className="rounded-lg p-2 text-foreground hover:bg-surface lg:hidden">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="mt-3 grid gap-1 border-t border-border pt-3 lg:hidden">
          <Link to="/icons" onClick={close} className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-surface">Icons</Link>
          <Link to="/about" onClick={close} className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-surface">About</Link>
          <Link to="/donate" onClick={close} className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-surface">Donate</Link>
          <Link to="/saved" onClick={close} className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-surface">Saved ({favorites.length})</Link>
          {user ? (
            <button onClick={() => void handleSignOut()} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-foreground hover:bg-surface">
              <LogOut className="h-4 w-4" />Sign out ({user.email})
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link to="/signin" onClick={close} className="rounded-lg border border-foreground/15 px-3 py-2.5 text-center text-sm font-semibold text-foreground">Log in</Link>
              <Link to="/signup" onClick={close} className="rounded-lg bg-foreground px-3 py-2.5 text-center text-sm font-semibold text-background">Sign up</Link>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
