export type DeviceType =
  | "Wi-Fi AP"
  | "Security Camera"
  | "Ticket Scanner"
  | "Scoreboard"
  | "Media Equipment"
  | "Staff Device"
  | "Payment Terminal";

export type Zone =
  | "Entrances"
  | "Field Level"
  | "Seating Areas"
  | "Press Box"
  | "Team Facilities"
  | "Concessions";

export type Status = "online" | "degraded" | "offline";

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  ip: string;
  vlan: string;
  zone: Zone;
  location: string;
  status: Status;
  latencyMs: number;
  bandwidthMbps: number;
  packetLossPct: number;
  uptimePct: number;
}

export const DEVICE_TYPES: DeviceType[] = [
  "Wi-Fi AP",
  "Security Camera",
  "Ticket Scanner",
  "Scoreboard",
  "Media Equipment",
  "Staff Device",
  "Payment Terminal",
];

export const ZONES: Zone[] = [
  "Entrances",
  "Field Level",
  "Seating Areas",
  "Press Box",
  "Team Facilities",
  "Concessions",
];

export const VLANS = [
  { id: "VLAN 10", name: "Public Wi-Fi" },
  { id: "VLAN 20", name: "Security / CCTV" },
  { id: "VLAN 30", name: "Ticketing" },
  { id: "VLAN 40", name: "Scoreboard & AV" },
  { id: "VLAN 50", name: "Broadcast Media" },
  { id: "VLAN 60", name: "Team Ops" },
  { id: "VLAN 70", name: "Payments (PCI)" },
];

const TYPE_VLAN: Record<DeviceType, string> = {
  "Wi-Fi AP": "VLAN 10",
  "Security Camera": "VLAN 20",
  "Ticket Scanner": "VLAN 30",
  Scoreboard: "VLAN 40",
  "Media Equipment": "VLAN 50",
  "Staff Device": "VLAN 60",
  "Payment Terminal": "VLAN 70",
};

const TYPE_SUBNET: Record<DeviceType, number> = {
  "Wi-Fi AP": 10,
  "Security Camera": 20,
  "Ticket Scanner": 30,
  Scoreboard: 40,
  "Media Equipment": 50,
  "Staff Device": 60,
  "Payment Terminal": 70,
};

const ZONE_LOCATIONS: Record<Zone, string[]> = {
  Entrances: ["North Gate", "South Gate", "East Gate", "VIP Entrance"],
  "Field Level": ["Touchline West", "Touchline East", "Players Tunnel", "Technical Area"],
  "Seating Areas": ["Upper Tier N", "Upper Tier S", "Lower Tier E", "Lower Tier W", "Family Stand"],
  "Press Box": ["Press Gallery", "Commentary Booth 1", "Commentary Booth 2", "Media Workroom"],
  "Team Facilities": ["Home Locker Room", "Away Locker Room", "Medical Suite", "Coaches Office"],
  Concessions: ["Kiosk 12", "Kiosk 21", "Kiosk 34", "Main Bar", "Merch Store"],
};

// Deterministic pseudo-random so SSR and client agree.
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const PLAN: Array<{ type: DeviceType; zone: Zone; count: number }> = [
  { type: "Wi-Fi AP", zone: "Seating Areas", count: 10 },
  { type: "Wi-Fi AP", zone: "Entrances", count: 4 },
  { type: "Wi-Fi AP", zone: "Concessions", count: 3 },
  { type: "Security Camera", zone: "Entrances", count: 5 },
  { type: "Security Camera", zone: "Seating Areas", count: 6 },
  { type: "Security Camera", zone: "Field Level", count: 3 },
  { type: "Ticket Scanner", zone: "Entrances", count: 8 },
  { type: "Scoreboard", zone: "Field Level", count: 3 },
  { type: "Media Equipment", zone: "Press Box", count: 6 },
  { type: "Media Equipment", zone: "Field Level", count: 3 },
  { type: "Staff Device", zone: "Team Facilities", count: 7 },
  { type: "Staff Device", zone: "Press Box", count: 2 },
  { type: "Payment Terminal", zone: "Concessions", count: 10 },
];

const SHORT: Record<DeviceType, string> = {
  "Wi-Fi AP": "AP",
  "Security Camera": "CAM",
  "Ticket Scanner": "SCAN",
  Scoreboard: "BOARD",
  "Media Equipment": "MEDIA",
  "Staff Device": "STAFF",
  "Payment Terminal": "POS",
};

function buildDevices(): Device[] {
  const rand = rng(20260915);
  const devices: Device[] = [];
  const counters: Record<string, number> = {};

  for (const group of PLAN) {
    for (let i = 0; i < group.count; i++) {
      const n = (counters[group.type] = (counters[group.type] ?? 0) + 1);
      const locations = ZONE_LOCATIONS[group.zone];
      const location = locations[i % locations.length];
      const roll = rand();
      const status: Status = roll > 0.93 ? "offline" : roll > 0.82 ? "degraded" : "online";
      const base = status === "online" ? 6 + rand() * 22 : status === "degraded" ? 90 + rand() * 140 : 0;
      const bw =
        status === "offline"
          ? 0
          : Math.round(
              (group.type === "Security Camera"
                ? 18 + rand() * 40
                : group.type === "Media Equipment"
                  ? 45 + rand() * 180
                  : group.type === "Wi-Fi AP"
                    ? 30 + rand() * 260
                    : 1 + rand() * 12) * 10,
            ) / 10;
      devices.push({
        id: `${SHORT[group.type]}-${String(n).padStart(3, "0")}`,
        name: `${SHORT[group.type]}-${String(n).padStart(3, "0")} ${location}`,
        type: group.type,
        ip: `10.${TYPE_SUBNET[group.type]}.${1 + Math.floor(i / 250)}.${10 + n}`,
        vlan: TYPE_VLAN[group.type],
        zone: group.zone,
        location,
        status,
        latencyMs: Math.round(base * 10) / 10,
        bandwidthMbps: bw,
        packetLossPct:
          status === "offline"
            ? 100
            : Math.round((status === "degraded" ? 1.5 + rand() * 6 : rand() * 0.6) * 100) / 100,
        uptimePct:
          status === "offline"
            ? Math.round((90 + rand() * 6) * 100) / 100
            : Math.round((99 + rand()) * 100) / 100,
      });
    }
  }
  return devices;
}

export const devices: Device[] = buildDevices();

export interface Alert {
  id: string;
  severity: "critical" | "warning" | "info";
  category: "Offline" | "High latency" | "Bandwidth" | "Packet loss";
  device: Device;
  message: string;
  minutesAgo: number;
}

export const alerts: Alert[] = (() => {
  const out: Alert[] = [];
  let i = 0;
  for (const d of devices) {
    if (d.status === "offline") {
      out.push({
        id: `ALRT-${++i}`,
        severity: "critical",
        category: "Offline",
        device: d,
        message: `${d.id} stopped responding at ${d.location}. Last seen on ${d.vlan}.`,
        minutesAgo: 2 + (i * 7) % 90,
      });
    }
    if (d.latencyMs > 120) {
      out.push({
        id: `ALRT-${++i}`,
        severity: "warning",
        category: "High latency",
        device: d,
        message: `Latency of ${d.latencyMs} ms exceeds the 120 ms threshold.`,
        minutesAgo: 1 + (i * 5) % 60,
      });
    }
    if (d.bandwidthMbps > 240) {
      out.push({
        id: `ALRT-${++i}`,
        severity: "warning",
        category: "Bandwidth",
        device: d,
        message: `Sustained ${d.bandwidthMbps} Mbps — above the 240 Mbps port budget.`,
        minutesAgo: 3 + (i * 11) % 75,
      });
    }
    if (d.packetLossPct > 2 && d.status !== "offline") {
      out.push({
        id: `ALRT-${++i}`,
        severity: "info",
        category: "Packet loss",
        device: d,
        message: `Packet loss at ${d.packetLossPct}% over the last 5 minutes.`,
        minutesAgo: 4 + (i * 13) % 110,
      });
    }
  }
  return out.sort((a, b) => a.minutesAgo - b.minutesAgo);
})();

export function summary(list: Device[] = devices) {
  const online = list.filter((d) => d.status === "online").length;
  const degraded = list.filter((d) => d.status === "degraded").length;
  const offline = list.filter((d) => d.status === "offline").length;
  const live = list.filter((d) => d.status !== "offline");
  const avgLatency = live.length
    ? Math.round((live.reduce((s, d) => s + d.latencyMs, 0) / live.length) * 10) / 10
    : 0;
  const packetLoss = live.length
    ? Math.round((live.reduce((s, d) => s + d.packetLossPct, 0) / live.length) * 100) / 100
    : 0;
  const bandwidth = Math.round(list.reduce((s, d) => s + d.bandwidthMbps, 0) * 10) / 10;
  return {
    total: list.length,
    online,
    degraded,
    offline,
    avgLatency,
    packetLoss,
    bandwidth,
    capacityMbps: 10000,
  };
}

export const throughputSeries = Array.from({ length: 24 }, (_, i) => {
  const kickoff = i >= 14 && i <= 20;
  const base = kickoff ? 5200 : 1400;
  const wave = Math.sin(i / 2.2) * 420;
  return {
    time: `${String(i).padStart(2, "0")}:00`,
    mbps: Math.round(base + wave + (i % 3) * 180),
    clients: Math.round((kickoff ? 24000 : 4200) + wave * 4),
  };
});
