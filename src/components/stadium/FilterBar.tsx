import { DEVICE_TYPES, VLANS, ZONES, type Device } from "@/lib/stadium-data";

export interface Filters {
  type: string;
  zone: string;
  vlan: string;
  status: string;
}

export const emptyFilters: Filters = { type: "all", zone: "all", vlan: "all", status: "all" };

export function applyFilters(list: Device[], f: Filters) {
  return list.filter(
    (d) =>
      (f.type === "all" || d.type === f.type) &&
      (f.zone === "all" || d.zone === f.zone) &&
      (f.vlan === "all" || d.vlan === f.vlan) &&
      (f.status === "all" || d.status === f.status),
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-1 sm:max-w-52">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full rounded-lg border border-input bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="all">All</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function FilterBar({
  value,
  onChange,
}: {
  value: Filters;
  onChange: (f: Filters) => void;
}) {
  const set = (patch: Partial<Filters>) => onChange({ ...value, ...patch });
  const dirty = JSON.stringify(value) !== JSON.stringify(emptyFilters);

  return (
    <div className="flex flex-wrap items-end gap-3">
      <Select
        label="Device type"
        value={value.type}
        onChange={(v) => set({ type: v })}
        options={DEVICE_TYPES.map((t) => ({ value: t, label: t }))}
      />
      <Select
        label="Stadium zone"
        value={value.zone}
        onChange={(v) => set({ zone: v })}
        options={ZONES.map((z) => ({ value: z, label: z }))}
      />
      <Select
        label="VLAN"
        value={value.vlan}
        onChange={(v) => set({ vlan: v })}
        options={VLANS.map((v) => ({ value: v.id, label: `${v.id} · ${v.name}` }))}
      />
      <Select
        label="Status"
        value={value.status}
        onChange={(v) => set({ status: v })}
        options={[
          { value: "online", label: "Online" },
          { value: "degraded", label: "Degraded" },
          { value: "offline", label: "Offline" },
        ]}
      />
      {dirty && (
        <button
          onClick={() => onChange(emptyFilters)}
          className="h-9 rounded-lg border border-border px-3 text-sm text-muted-foreground transition-colors hover:bg-accent"
        >
          Reset
        </button>
      )}
    </div>
  );
}
