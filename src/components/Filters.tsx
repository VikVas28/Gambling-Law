import { KIND_LABELS, SCHOOL_COLORS } from "../lib/compliance";
import type { SchoolType, VenueKind } from "../lib/types";
import {
  SKOPJE_ALL,
  SKOPJE_MUNICIPALITIES,
  type FiltersState,
} from "../lib/filters";

const KINDS: VenueKind[] = [
  "casino",
  "automat_club",
  "electronic_games",
  "betting_shop",
];

const SCHOOL_TYPES: [SchoolType, string][] = [
  ["primary", "Основни училишта"],
  ["secondary", "Средни училишта"],
];

interface Props {
  filters: FiltersState;
  municipalities: string[];
  onChange: (filters: FiltersState) => void;
}

function CheckRow({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-1.5 text-sm text-slate-200 hover:bg-slate-800">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 shrink-0 accent-indigo-500"
      />
      {children}
    </label>
  );
}

export default function Filters({ filters, municipalities, onChange }: Props) {
  const skopje = municipalities.filter((m) => SKOPJE_MUNICIPALITIES.has(m));
  const others = municipalities.filter((m) => !SKOPJE_MUNICIPALITIES.has(m));

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-200">
          Пребарај објект за игри на среќа
        </span>
        <input
          type="search"
          value={filters.query}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
          placeholder="на пр. казино, Евротип…"
          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2.5 text-[15px] text-slate-100 placeholder:text-slate-500"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-200">
          Општина
        </span>
        <select
          value={filters.municipality}
          onChange={(e) =>
            onChange({ ...filters, municipality: e.target.value })
          }
          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2.5 text-[15px] text-slate-100"
        >
          <option value="all">Сите општини</option>
          {skopje.length > 0 && (
            <optgroup label="Скопје">
              <option value={SKOPJE_ALL}>Цело Скопје</option>
              {skopje.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </optgroup>
          )}
          {others.length > 0 && (
            <optgroup label="Други градови и општини">
              {others.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </optgroup>
          )}
        </select>
      </label>

      <details className="group rounded-lg border border-slate-700 bg-slate-800/50">
        <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2.5 text-sm font-medium text-slate-200 [&::-webkit-details-marker]:hidden">
          Дополнителни поставки
          <span
            aria-hidden
            className="text-slate-400 transition-transform group-open:rotate-180"
          >
            ▾
          </span>
        </summary>
        <div className="space-y-4 border-t border-slate-700 px-3 py-3">
          <fieldset>
            <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Тип на објект
            </legend>
            {KINDS.map((kind) => (
              <CheckRow
                key={kind}
                checked={filters.kinds[kind]}
                onChange={() =>
                  onChange({
                    ...filters,
                    kinds: { ...filters.kinds, [kind]: !filters.kinds[kind] },
                  })
                }
              >
                {KIND_LABELS[kind]}
              </CheckRow>
            ))}
          </fieldset>

          <fieldset>
            <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Училишта на мапата
            </legend>
            <CheckRow
              checked={filters.showSchools}
              onChange={() =>
                onChange({ ...filters, showSchools: !filters.showSchools })
              }
            >
              Прикажи ги училиштата
            </CheckRow>
            {SCHOOL_TYPES.map(([type, label]) => (
              <CheckRow
                key={type}
                checked={filters.schoolTypes[type]}
                onChange={() =>
                  onChange({
                    ...filters,
                    schoolTypes: {
                      ...filters.schoolTypes,
                      [type]: !filters.schoolTypes[type],
                    },
                  })
                }
              >
                <span
                  className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: SCHOOL_COLORS[type] }}
                  aria-hidden
                />
                {label}
              </CheckRow>
            ))}
          </fieldset>

          <fieldset>
            <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Слоеви на мапата
            </legend>
            <CheckRow
              checked={filters.showZones}
              onChange={() =>
                onChange({ ...filters, showZones: !filters.showZones })
              }
            >
              Црвена зона од 500 м околу училиштата
            </CheckRow>
            <CheckRow
              checked={filters.showMunicipalities}
              onChange={() =>
                onChange({
                  ...filters,
                  showMunicipalities: !filters.showMunicipalities,
                })
              }
            >
              Граници и имиња на општините
            </CheckRow>
          </fieldset>

          <p className="text-[11px] leading-snug text-slate-500">
            Овие поставки влијаат само на приказот. Статусот на објектите
            секогаш се пресметува спрема сите основни и средни училишта, како
            што бара законот.
          </p>
        </div>
      </details>
    </div>
  );
}
