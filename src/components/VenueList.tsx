import {
  KIND_LABELS,
  STATUS_COLORS_DARK,
  STATUS_LABELS,
  STATUS_ORDER,
  type ClassifiedVenue,
} from "../lib/compliance";

interface Props {
  items: ClassifiedVenue[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function VenueList({ items, selectedId, onSelect }: Props) {
  const sorted = [...items].sort((a, b) => {
    const byStatus =
      STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status);
    if (byStatus !== 0) return byStatus;
    return a.venue.name.localeCompare(b.venue.name, "mk");
  });

  if (sorted.length === 0) {
    return (
      <p className="rounded-lg border border-slate-800 bg-slate-800/40 px-3 py-4 text-center text-sm text-slate-400">
        Нема објекти што одговараат на филтрите.
      </p>
    );
  }

  return (
    <ul className="space-y-1.5">
      {sorted.map((c) => {
        const isSelected = c.venue.id === selectedId;
        return (
          <li key={c.venue.id}>
            <button
              type="button"
              onClick={() => onSelect(c.venue.id)}
              className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                isSelected
                  ? "border-indigo-500 bg-slate-800"
                  : "border-slate-800 bg-slate-800/40 hover:bg-slate-800"
              }`}
            >
              <span className="flex items-start gap-2">
                <span
                  className="mt-1.5 inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: STATUS_COLORS_DARK[c.status] }}
                  aria-label={STATUS_LABELS[c.status]}
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-slate-100">
                    {c.venue.name}
                  </span>
                  <span className="block text-xs text-slate-400">
                    {KIND_LABELS[c.venue.kind]}
                    {c.venue.municipality ? ` · ${c.venue.municipality}` : ""}
                    {c.nearestDistanceM !== null
                      ? ` · ${Math.round(c.nearestDistanceM)} м до училиште`
                      : ""}
                  </span>
                  {!c.venue.verified && (
                    <span className="mt-0.5 inline-block rounded bg-amber-900/50 px-1.5 py-0.5 text-[10px] font-medium text-amber-300">
                      непроверена локација
                    </span>
                  )}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
