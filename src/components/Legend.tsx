import { SCHOOL_COLOR, STATUS_COLORS } from "../lib/compliance";

function Dot({ color }: { color: string }) {
  return (
    <span
      className="inline-block h-3 w-3 shrink-0 rounded-full border border-white shadow"
      style={{ background: color }}
    />
  );
}

export default function Legend() {
  return (
    <div className="space-y-1.5 rounded-lg bg-white/95 px-3 py-2.5 text-xs text-slate-700 shadow-lg ring-1 ring-slate-900/10">
      <p className="text-[13px] font-semibold text-slate-900">Легенда</p>
      <p className="flex items-center gap-2">
        <Dot color={STATUS_COLORS.must_relocate} /> Мора да се релоцира
      </p>
      <p className="flex items-center gap-2">
        <Dot color={STATUS_COLORS.restricted} /> Со ограничување (без VLT/е-игри)
      </p>
      <p className="flex items-center gap-2">
        <Dot color={STATUS_COLORS.compliant} /> Сообразен
      </p>
      <p className="flex items-center gap-2">
        <Dot color={SCHOOL_COLOR} /> Училиште
      </p>
      <p className="flex items-center gap-2">
        <span className="inline-block h-3 w-3 shrink-0 rounded-full border border-red-500 bg-red-500/10" />
        Зона од 500 м околу училиште
      </p>
    </div>
  );
}
