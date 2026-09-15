import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Activity, AlertTriangle, LayoutDashboard, MapPinned, Network, Server } from "lucide-react";
import { alerts } from "@/lib/stadium-data";

const NAV = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/devices", label: "Devices", icon: Server },
  { to: "/topology", label: "Network Topology", icon: Network },
  { to: "/alerts", label: "Alerts", icon: AlertTriangle },
  { to: "/zones", label: "Stadium Zones", icon: MapPinned },
] as const;

export function DashboardLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-sidebar/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary glow">
                <Activity className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold tracking-tight">StadiumNet</p>
                <p className="truncate text-xs text-muted-foreground">
                  Network Operations · Riverside Arena
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs">
              <span className="size-2 rounded-full bg-success" />
              <span className="text-muted-foreground">Core uplink healthy</span>
            </div>
          </div>
          <nav className="-mx-1 flex gap-1 overflow-x-auto pb-1">
            {NAV.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: to === "/" }}
                activeProps={{ className: "bg-primary/15 text-primary" }}
                inactiveProps={{ className: "text-muted-foreground hover:bg-accent" }}
                className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              >
                <Icon className="size-4" />
                {label}
                {to === "/alerts" && (
                  <span className="rounded-full bg-destructive/20 px-1.5 text-[11px] text-destructive">
                    {alerts.length}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {children}
      </main>
    </div>
  );
}
