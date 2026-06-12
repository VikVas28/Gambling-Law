import {
  KIND_LABELS,
  STATUS_COLORS,
  STATUS_LABELS,
  type ClassifiedVenue,
} from "../lib/compliance";

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex gap-2">
      <dt className="w-24 shrink-0 text-slate-500">{label}</dt>
      <dd className="text-slate-800">{value}</dd>
    </div>
  );
}

export default function VenueDetail({ item }: { item: ClassifiedVenue }) {
  const { venue, status, nearestSchool, nearestDistanceM } = item;
  return (
    <div className="min-w-[220px] space-y-2 text-sm">
      <div>
        <p className="font-semibold text-slate-900">{venue.name}</p>
        <p className="text-slate-500">
          {KIND_LABELS[venue.kind]}
          {venue.municipality ? ` · ${venue.municipality}` : ""}
        </p>
      </div>

      <span
        className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white"
        style={{ background: STATUS_COLORS[status] }}
      >
        {STATUS_LABELS[status]}
      </span>

      {!venue.verified && (
        <p className="rounded border border-amber-300 bg-amber-50 px-2 py-1 text-xs text-amber-800">
          ⚠ Непроверена локација
          {venue.geocodePrecision === "city" && " (приближна — само град)"}
        </p>
      )}

      <dl className="space-y-1 text-xs">
        <Row label="Адреса" value={venue.address} />
        <Row label="Приредувач" value={venue.operator} />
        <Row label="Лиценца" value={venue.licenseNo} />
        <Row
          label="Најблиско уч."
          value={
            nearestSchool && nearestDistanceM !== null
              ? `${nearestSchool.name} — ${Math.round(nearestDistanceM)} м`
              : undefined
          }
        />
        <Row label="Извор" value={venue.source} />
      </dl>

      {venue.licenseUrl && (
        <a
          href={venue.licenseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-xs text-indigo-600 underline hover:text-indigo-800"
        >
          Лиценца — Министерство за финансии (PDF)
        </a>
      )}
    </div>
  );
}
