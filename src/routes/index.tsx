import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowDownUp,
  Gauge,
  PlugZap,
  ServerCrash,
  Server,
  Waves,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardLayout } from "@/components/stadium/DashboardLayout";
import { StatCard } from "@/components/stadium/StatCard";
import { StatusBadge } from "@/components/stadium/StatusBadge";
import { alerts, devices, summary, throughputSeries, ZONES } from "@/lib/stadium-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StadiumNet Overview — Stadium Network Operations" },
      {
        name: "description",
        content:
          "Live health of stadium Wi-Fi, cameras, scanners, scoreboards and payment terminals: uptime, latency, packet loss and bandwidth.",
      },
      { property: "og:title", content: "StadiumNet Overview — Stadium Network Operations" },
      {
        property: "og:description",
        content: "Monitor every connected stadium system from one operations dashboard.",
      },
    ],
  }),
  component: Overview,
});

function Overview() {
  const s = summary();
  const critical = alerts.filter((a) => a.severity === "critical");

  return (
    <DashboardLayout
      title="Network Overview"
      subtitle="Matchday health across all stadium systems, refreshed every 30 seconds."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total devices" value={s.total} icon={Server} hint="Across 7 VLANs" />
        <StatCard label="Online" value={s.online} icon={PlugZap} tone="success" hint={`${s.degraded} degraded`} />
        <StatCard label="Offline" value={s.offline} icon={ServerCrash} tone="danger" hint="Needs field check" />
        <StatCard
          label="Active alerts"
          value={alerts.length}
          icon={AlertTriangle}
          tone="warning"
          hint={`${critical.length} critical`}
        />
        <StatCard label="Avg latency" value={s.avgLatency} unit="ms" icon={Gauge} hint="Threshold 120 ms" />
        <StatCard
          label="Packet loss"
          value={s.packetLoss}
          unit="%"
          icon={Waves}
          tone={s.packetLoss > 1 ? "warning" : "success"}
          hint="Rolling 5 min average"
        />
        <StatCard
          label="Bandwidth in use"
          value={s.bandwidth.toLocaleString()}
          unit="Mbps"
          icon={ArrowDownUp}
          hint={`of ${s.capacityMbps.toLocaleString()} Mbps capacity`}
        />
        <StatCard
          label="Fabric uptime"
          value="99.94"
          unit="%"
          icon={Activity}
          tone="success"
          hint="Last 30 days"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <section className="panel p-4 lg:col-span-2">
          <h2 className="text-sm font-semibold">Aggregate throughput — last 24 hours</h2>
          <p className="text-xs text-muted-foreground">Kickoff at 19:00 drives the concourse peak.</p>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={throughputSeries} margin={{ left: -12, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="tp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" interval={3} />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="mbps"
                  name="Mbps"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  fill="url(#tp)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel p-4">
          <h2 className="text-sm font-semibold">Zone health</h2>
          <ul className="mt-3 space-y-3">
            {ZONES.map((zone) => {
              const list = devices.filter((d) => d.zone === zone);
              const up = list.filter((d) => d.status === "online").length;
              const pct = Math.round((up / list.length) * 100);
              return (
                <li key={zone}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate">{zone}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {up}/{list.length}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={pct > 85 ? "h-full bg-success" : pct > 65 ? "h-full bg-warning" : "h-full bg-destructive"}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <section className="panel mt-4 p-4">
        <h2 className="text-sm font-semibold">Latest incidents</h2>
        <ul className="mt-3 divide-y divide-border">
          {alerts.slice(0, 6).map((a) => (
            <li key={a.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5 text-sm">
              <StatusBadge status={a.device.status} />
              <span className="font-medium">{a.device.id}</span>
              <span className="min-w-0 flex-1 truncate text-muted-foreground">{a.message}</span>
              <span className="text-xs text-muted-foreground">{a.minutesAgo}m ago</span>
            </li>
          ))}
        </ul>
      </section>
    </DashboardLayout>
  );
}
