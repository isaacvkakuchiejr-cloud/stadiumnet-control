import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type Tone = "default" | "success" | "warning" | "danger";

const toneClass: Record<Tone, string> = {
  default: "text-primary bg-primary/15",
  success: "text-success bg-success/15",
  warning: "text-warning bg-warning/15",
  danger: "text-destructive bg-destructive/15",
};

export function StatCard({
  label,
  value,
  unit,
  hint,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  unit?: string;
  hint?: string;
  icon: LucideIcon;
  tone?: Tone;
}) {
  return (
    <div className="panel p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <span className={cn("grid size-8 shrink-0 place-items-center rounded-lg", toneClass[tone])}>
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tabular-nums">
        {value}
        {unit && <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span>}
      </p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
