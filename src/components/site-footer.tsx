import { Link } from "@tanstack/react-router";
import { Download, Heart, Twitter } from "lucide-react";

const columns = [
  { title: "Icons", links: ["All Icons", "Design & Dev", "Finance", "Media", "System"] },
  { title: "Resources", links: ["Documentation", "License", "Changelog", "Figma Plugin"] },
  { title: "Company", links: ["About", "Donate", "Contact", "Privacy"] },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-white/50 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#7C5CFF] to-[#FF6B9D] text-white shadow-md">
                <span className="text-lg font-extrabold">3</span>
              </div>
              <span className="font-display text-lg font-extrabold text-foreground">3D Icons</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Beautifully crafted open source 3D icons for your next project.
            </p>
            <a href="#" className="mt-4 inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-foreground/90">
              <Twitter className="h-4 w-4" /> Show love
            </a>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-bold text-foreground">{col.title}</h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link to="/icons" className="text-sm text-muted-foreground transition-colors hover:text-brand">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">© 2026 3D Icons. All rights reserved. Open source under MIT License.</p>
          <p className="text-xs text-muted-foreground">
            Download <span className="font-bold text-foreground">FREE</span> source file from 3dicons.co
          </p>
        </div>
      </div>
    </footer>
  );
}
