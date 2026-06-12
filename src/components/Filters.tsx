import { KIND_LABELS } from "../lib/compliance";
import type { VenueKind } from "../lib/types";
import type { FiltersState } from "../App";

const KINDS: VenueKind[] = [
  "casino",
  "automat_club",
  "electronic_games",
  "betting_shop",
];

interface Props {
  filters: FiltersState;
  municipalities: string[];
  onChange: (filters: FiltersState) => void;
}

export default function Filters({ filters, municipalities, onChange }: Props) {
  return (
    <div className="space-y-3">
      <label className="block">
        <span className="sr-only">Пребарување</span>
        <input
          type="search"
          value={filters.query}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
          placeholder="Пребарај по име, приредувач, адреса…"
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
        />
      </label>

      <fieldset>
        <legend className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Тип на објект
        </legend>
        <div className="grid grid-cols-2 gap-1.5">
          {KINDS.map((kind) => (
            <label
              key={kind}
              className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-800 bg-slate-800/60 px-2 py-1.5 text-sm text-slate-200"
            >
              <input
                type="checkbox"
                checked={filters.kinds[kind]}
                onChange={() =>
                  onChange({
                    ...filters,
                    kinds: { ...filters.kinds, [kind]: !filters.kinds[kind] },
                  })
                }
                className="accent-indigo-500"
              />
              {KIND_LABELS[kind]}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
          Општина
        </span>
        <select
          value={filters.municipality}
          onChange={(e) =>
            onChange({ ...filters, municipality: e.target.value })
          }
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100"
        >
          <option value="all">Сите општини</option>
          {municipalities.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </label>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-200">
          <input
            type="checkbox"
            checked={filters.showSchools}
            onChange={() =>
              onChange({ ...filters, showSchools: !filters.showSchools })
            }
            className="accent-indigo-500"
          />
          Прикажи училишта
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-200">
          <input
            type="checkbox"
            checked={filters.showZones}
            onChange={() =>
              onChange({ ...filters, showZones: !filters.showZones })
            }
            className="accent-indigo-500"
          />
          Прикажи зони од 500 м
        </label>
      </div>
    </div>
  );
}
