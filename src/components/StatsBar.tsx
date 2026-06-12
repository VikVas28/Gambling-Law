import {
  STATUS_COLORS,
  STATUS_COLORS_DARK,
  STATUS_LABELS,
  STATUS_ORDER,
} from "../lib/compliance";
import type { Status } from "../lib/types";

interface Props {
  counts: Record<Status, number>;
  active: Record<Status, boolean>;
  onToggle: (status: Status) => void;
}

// Големи редови со штиклирање — целиот ред е кликабилен.
export default function StatsBar({ counts, active, onToggle }: Props) {
  return (
    <div className="space-y-1.5">
      {STATUS_ORDER.map((s) => (
        <label
          key={s}
          className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition ${
            active[s]
              ? "border-slate-600 bg-slate-800 hover:bg-slate-700/70"
              : "border-slate-800 bg-slate-900 opacity-60 hover:opacity-80"
          }`}
        >
          <input
            type="checkbox"
            checked={active[s]}
            onChange={() => onToggle(s)}
            className="h-4 w-4 shrink-0 accent-indigo-500"
          />
          <span
            className="inline-block h-3.5 w-3.5 shrink-0 rounded-full"
            style={{ background: STATUS_COLORS[s] }}
            aria-hidden
          />
          <span className="flex-1 text-[15px] leading-tight text-slate-100">
            {STATUS_LABELS[s]}
          </span>
          <span
            className="text-lg font-bold tabular-nums"
            style={{ color: STATUS_COLORS_DARK[s] }}
          >
            {counts[s]}
          </span>
        </label>
      ))}
    </div>
  );
}
