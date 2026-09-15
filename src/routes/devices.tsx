import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { DashboardLayout } from "@/components/stadium/DashboardLayout";
import { StatusBadge } from "@/components/stadium/StatusBadge";
import { FilterBar, type Filters, emptyFilters, applyFilters } from "@/components/stadium/FilterBar";
import { devices } from "@/lib/stadium-data";

export const Route = createFileRoute("/devices")({
  head: () => ({
    meta: [
      { title: "Devices — StadiumNet Inventory" },
      {
        name: "description",
        content:
          "Searchable inventory of every stadium device with IP, VLAN, location, status, latency and bandwidth.",
      },
      { property: "og:title", content: "Devices — StadiumNet Inventory" },
      {
        property: "og:description",
        content: "Search and filter all connected stadium devices by type, zone, VLAN and status.",
      },
    ],
  }),
  component: DevicesPage,
});

function DevicesPage() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filters>(emptyFilters);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return applyFilters(devices, filters).filter(
      (d) =>
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.ip.includes(q) ||
        d.location.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q),
    );
  }, [query, filters]);

  return (
    <DashboardLayout
      title="Devices"
      subtitle={`${rows.length} of ${devices.length} devices match the current search and filters.`}
    >
      <div className="panel p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, IP address, type or location…"
            className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="mt-3">
          <FilterBar value={filters} onChange={setFilters} />
        </div>
      </div>

      <div className="panel mt-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Device</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">IP address</th>
                <th className="px-4 py-3 font-medium">VLAN</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Latency</th>
                <th className="px-4 py-3 text-right font-medium">Bandwidth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((d) => (
                <tr key={d.id} className="transition-colors hover:bg-accent/40">
                  <td className="px-4 py-3">
                    <p className="font-medium">{d.id}</p>
                    <p className="text-xs text-muted-foreground">{d.zone}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{d.type}</td>
                  <td className="px-4 py-3 font-mono text-xs tabular-nums">{d.ip}</td>
                  <td className="px-4 py-3 text-muted-foreground">{d.vlan}</td>
                  <td className="px-4 py-3 text-muted-foreground">{d.location}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={d.status} />
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {d.status === "offline" ? "—" : `${d.latencyMs} ms`}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {d.status === "offline" ? "—" : `${d.bandwidthMbps} Mbps`}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">
                    No devices match those filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
