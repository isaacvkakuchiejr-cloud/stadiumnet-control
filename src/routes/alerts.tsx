import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AlertTriangle, ArrowDownUp, Gauge, ServerCrash, Waves } from "lucide-react";
import { DashboardLayout } from "@/components/stadium/DashboardLayout";
import { StatCard } from "@/components/stadium/StatCard";
import { alerts, type Alert } from "@/lib/stadium-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Alerts — StadiumNet Incident Feed" },
      {
        name: "description",
        content:
          "Active stadium network alerts for offline devices, high latency, excessive bandwidth and packet loss.",
      },
      { property: "og:title", content: "Alerts — StadiumNet Incident Feed" },
      {
        property: "og:description",
        content: "Triage offline devices, latency spikes, bandwidth overruns and packet loss.",
      },
    ],
  }),
  component: AlertsPage,
});

const CATEGORIES = ["All", "Offline", "High latency", "Bandwidth", "Packet loss"] as const;

const severityStyle: Record<Alert["severity"], string> = {
  critical: "border-l-destructive bg-destructive/5",
  warning: "border-l-warning bg-warning/5",
  info: "border-l-primary bg-primary/5",
};

function AlertsPage() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const rows = useMemo(
    () => (category === "All" ? alerts : alerts.filter((a) => a.category === category)),
    [category],
  );

  const count = (c: Alert["category"]) => alerts.filter((a) => a.category === c).length;

  return (
    <DashboardLayout
      title="Alerts"
      subtitle={`${alerts.length} active alerts across the stadium network.`}
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Offline devices" value={count("Offline")} icon={ServerCrash} tone="danger" />
        <StatCard label="High latency" value={count("High latency")} icon={Gauge} tone="warning" />
        <StatCard label="Bandwidth" value={count("Bandwidth")} icon={ArrowDownUp} tone="warning" />
        <StatCard label="Packet loss" value={count("Packet loss")} icon={Waves} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm transition-colors",
              category === c
                ? "border-primary/40 bg-primary/15 text-primary"
                : "border-border text-muted-foreground hover:bg-accent",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <ul className="mt-4 space-y-2">
        {rows.map((a) => (
          <li key={a.id} className={cn("panel border-l-4 p-4", severityStyle[a.severity])}>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <AlertTriangle
                    className={cn(
                      "size-4 shrink-0",
                      a.severity === "critical"
                        ? "text-destructive"
                        : a.severity === "warning"
                          ? "text-warning"
                          : "text-primary",
                    )}
                  />
                  <span className="font-medium">{a.device.id}</span>
                  <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                    {a.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {a.device.zone} · {a.device.vlan}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">{a.message}</p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">{a.minutesAgo}m ago</span>
            </div>
          </li>
        ))}
      </ul>
    </DashboardLayout>
  );
}
