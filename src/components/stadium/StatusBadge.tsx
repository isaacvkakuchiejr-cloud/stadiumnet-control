import type { Status } from "@/lib/stadium-data";
import { cn } from "@/lib/utils";

const map: Record<Status, { label: string; className: string }> = {
  online: { label: "Online", className: "bg-success/15 text-success border-success/30" },
  degraded: { label: "Degraded", className: "bg-warning/15 text-warning border-warning/30" },
  offline: { label: "Offline", className: "bg-destructive/15 text-destructive border-destructive/30" },
};

export function StatusBadge({ status }: { status: Status }) {
  const s = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium",
        s.className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {s.label}
    </span>
  );
}
