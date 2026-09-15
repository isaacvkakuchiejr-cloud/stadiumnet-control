import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/stadium/DashboardLayout";
import { StatusBadge } from "@/components/stadium/StatusBadge";
import { FilterBar, type Filters, emptyFilters, applyFilters } from "@/components/stadium/FilterBar";
import { devices, summary, ZONES } from "@/lib/stadium-data";

export const Route = createFileRoute("/zones")({
  head: () => ({
    meta: [
      { title: "Stadium Zones — StadiumNet" },
      {
        name: "description",
        content:
          "Device health grouped by stadium zone: entrances, field level, seating, press box, team facilities and concessions.",
      },
      { property: "og:title", content: "Stadium Zones — StadiumNet" },
      {
        property: "og:description",
        content: "See how each area of the stadium is performing, zone by zone.",
      },
    ],
  }),
  component: ZonesPage,
});

function ZonesPage() {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const filtered = useMemo(() => applyFilters(devices, filters), [filters]);

  return (
    <DashboardLayout
      title="Stadium Zones"
      subtitle="Every connected system grouped by where it sits inside the ground."
    >
      <div className="panel p-4">
        <FilterBar value={filters} onChange={setFilters} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {ZONES.map((zone) => {
          const list = filtered.filter((d) => d.zone === zone);
          const s = summary(list);
          return (
            <section key={zone} className="panel p-4">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <h2 className="truncate text-base font-semibold">{zone}</h2>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {s.total} devices · {s.offline} offline
                </span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-muted/50 py-2">
                  <p className="text-lg font-semibold tabular-nums text-success">{s.online}</p>
                  <p className="text-xs text-muted-foreground">Online</p>
                </div>
                <div className="rounded-lg bg-muted/50 py-2">
                  <p className="text-lg font-semibold tabular-nums">{s.avgLatency}</p>
                  <p className="text-xs text-muted-foreground">Avg ms</p>
                </div>
                <div className="rounded-lg bg-muted/50 py-2">
                  <p className="text-lg font-semibold tabular-nums">{Math.round(s.bandwidth)}</p>
                  <p className="text-xs text-muted-foreground">Mbps</p>
                </div>
              </div>
              <ul className="mt-3 max-h-64 space-y-1.5 overflow-y-auto pr-1">
                {list.map((d) => (
                  <li
                    key={d.id}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-2 py-1.5 text-sm hover:bg-accent/40"
                  >
                    <div className="min-w-0">
                      <p className="truncate">{d.id}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {d.type} · {d.location} · {d.ip}
                      </p>
                    </div>
                    <StatusBadge status={d.status} />
                  </li>
                ))}
                {list.length === 0 && (
                  <li className="py-6 text-center text-sm text-muted-foreground">
                    No devices match those filters.
                  </li>
                )}
              </ul>
            </section>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
