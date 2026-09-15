import { createFileRoute } from "@tanstack/react-router";
import { Cable, Router, Server } from "lucide-react";
import { DashboardLayout } from "@/components/stadium/DashboardLayout";
import { devices, DEVICE_TYPES, VLANS, type DeviceType } from "@/lib/stadium-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/topology")({
  head: () => ({
    meta: [
      { title: "Network Topology — StadiumNet" },
      {
        name: "description",
        content:
          "Visual map of the stadium core router, distribution switches and the systems attached to each VLAN.",
      },
      { property: "og:title", content: "Network Topology — StadiumNet" },
      {
        property: "og:description",
        content: "See how the core router, switches and stadium systems connect.",
      },
    ],
  }),
  component: TopologyPage,
});

const SWITCHES: { name: string; model: string; types: DeviceType[] }[] = [
  { name: "SW-CONCOURSE-01", model: "48-port PoE+", types: ["Wi-Fi AP", "Ticket Scanner"] },
  { name: "SW-SECURITY-02", model: "24-port PoE+", types: ["Security Camera"] },
  { name: "SW-AV-03", model: "24-port 10G", types: ["Scoreboard", "Media Equipment"] },
  { name: "SW-OPS-04", model: "48-port PoE+", types: ["Staff Device", "Payment Terminal"] },
];

function typeStats(type: DeviceType) {
  const list = devices.filter((d) => d.type === type);
  const offline = list.filter((d) => d.status === "offline").length;
  const degraded = list.filter((d) => d.status === "degraded").length;
  return { total: list.length, offline, degraded };
}

function TopologyPage() {
  const totalOffline = devices.filter((d) => d.status === "offline").length;

  return (
    <DashboardLayout
      title="Network Topology"
      subtitle="Core router down to distribution switches and the stadium systems on each VLAN."
    >
      <div className="panel p-4 sm:p-6">
        <div className="mx-auto max-w-md">
          <div className="panel glow flex items-center gap-3 border-primary/40 p-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/20 text-primary">
              <Router className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-semibold">CORE-RTR-01</p>
              <p className="truncate text-xs text-muted-foreground">
                10 Gbps uplink · 10.0.0.1 · inter-VLAN routing
              </p>
            </div>
            <span className="ml-auto shrink-0 rounded-full bg-success/15 px-2 py-0.5 text-xs text-success">
              Up
            </span>
          </div>
        </div>

        <div className="mx-auto h-8 w-px bg-border" />

        <div className="grid gap-4 lg:grid-cols-4">
          {SWITCHES.map((sw) => {
            const swDevices = devices.filter((d) => sw.types.includes(d.type));
            const swOffline = swDevices.filter((d) => d.status === "offline").length;
            return (
              <div key={sw.name} className="flex flex-col items-stretch">
                <div className="mx-auto h-4 w-px bg-border" />
                <div className="panel p-3">
                  <div className="flex items-center gap-2">
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent text-primary">
                      <Cable className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{sw.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{sw.model}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {swDevices.length} endpoints ·{" "}
                    <span className={swOffline ? "text-destructive" : "text-success"}>
                      {swOffline} down
                    </span>
                  </p>
                </div>

                <div className="mx-auto h-4 w-px bg-border" />

                <div className="space-y-2">
                  {sw.types.map((type) => {
                    const s = typeStats(type);
                    const vlan = devices.find((d) => d.type === type)?.vlan;
                    return (
                      <div
                        key={type}
                        className={cn(
                          "rounded-xl border p-3",
                          s.offline
                            ? "border-destructive/40 bg-destructive/5"
                            : s.degraded
                              ? "border-warning/40 bg-warning/5"
                              : "border-border bg-card",
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Server className="size-4 shrink-0 text-muted-foreground" />
                          <p className="truncate text-sm font-medium">{type}</p>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {vlan} · {s.total} devices
                        </p>
                        <div className="mt-2 flex gap-1">
                          {Array.from({ length: s.total }).map((_, i) => (
                            <span
                              key={i}
                              className={cn(
                                "h-1.5 flex-1 rounded-full",
                                i < s.offline
                                  ? "bg-destructive"
                                  : i < s.offline + s.degraded
                                    ? "bg-warning"
                                    : "bg-success",
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section className="panel p-4">
          <h2 className="text-sm font-semibold">VLAN segmentation</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {VLANS.map((v) => {
              const list = devices.filter((d) => d.vlan === v.id);
              return (
                <li key={v.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
                  <span className="truncate">
                    <span className="font-mono text-xs text-primary">{v.id}</span> · {v.name}
                  </span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    {list.length} devices
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
        <section className="panel p-4">
          <h2 className="text-sm font-semibold">Fabric summary</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>1 core router, {SWITCHES.length} distribution switches, {devices.length} endpoints.</li>
            <li>{DEVICE_TYPES.length} system classes, each isolated on its own VLAN.</li>
            <li className={totalOffline ? "text-destructive" : "text-success"}>
              {totalOffline} endpoints currently unreachable.
            </li>
            <li>Payments VLAN is PCI-segmented with no route to public Wi-Fi.</li>
          </ul>
        </section>
      </div>
    </DashboardLayout>
  );
}
