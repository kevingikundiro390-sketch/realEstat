import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Search } from "lucide-react";

export const Route = createFileRoute("/inbox")({
  head: () => ({ meta: [{ title: "Inbox | HomeBase" }] }),
  component: InboxPage,
});

function InboxPage() {
  return (
    <main className="flex min-h-[calc(100dvh-4rem)] w-full flex-col bg-[#f7f9fc] px-5 py-8 sm:px-8 lg:px-10">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">HomeBase</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-navy sm:text-4xl">Inbox</h1>
      <section className="flex flex-1 flex-col items-center justify-center py-16 text-center">
        <Mail className="h-9 w-9 text-brand" />
        <h2 className="mt-4 text-lg font-bold text-navy">Your inbox is clear</h2>
        <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">Messages about homes you are interested in will appear here.</p>
        <Link to="/buy" className="mt-5 inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover">
          <Search className="h-4 w-4" />Explore homes
        </Link>
      </section>
    </main>
  );
}