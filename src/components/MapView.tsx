import { useEffect, useRef } from "react";
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import { divIcon, type Marker as LeafletMarker } from "leaflet";
import {
  KIND_GLYPHS,
  RESTRICTION_RADIUS_M,
  SCHOOL_COLOR,
  SCHOOL_TYPE_LABELS,
  STATUS_COLORS,
  type ClassifiedVenue,
} from "../lib/compliance";
import type { School } from "../lib/types";
import VenueDetail from "./VenueDetail";

const SKOPJE_CENTER: [number, number] = [41.9981, 21.4254];

function venueIcon(item: ClassifiedVenue) {
  return divIcon({
    className: "venue-marker",
    html: `<div class="marker-dot" style="background:${STATUS_COLORS[item.status]}">${KIND_GLYPHS[item.venue.kind]}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

const schoolIcon = divIcon({
  className: "school-marker",
  html: `<div class="marker-square" style="background:${SCHOOL_COLOR}">У</div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  popupAnchor: [0, -12],
});

interface SelectionProps {
  selected: ClassifiedVenue | null;
  markerRefs: React.RefObject<Map<string, LeafletMarker>>;
}

function SelectionController({ selected, markerRefs }: SelectionProps) {
  const map = useMap();
  useEffect(() => {
    if (!selected) return;
    const { lat, lng } = selected.venue;
    map.flyTo([lat, lng], Math.max(map.getZoom(), 15), { duration: 0.6 });
    const t = window.setTimeout(
      () => markerRefs.current.get(selected.venue.id)?.openPopup(),
      650,
    );
    return () => window.clearTimeout(t);
  }, [selected, map, markerRefs]);
  return null;
}

interface Props {
  schools: School[];
  venues: ClassifiedVenue[];
  showSchools: boolean;
  showZones: boolean;
  selected: ClassifiedVenue | null;
  onSelect: (id: string | null) => void;
}

export default function MapView({
  schools,
  venues,
  showSchools,
  showZones,
  selected,
  onSelect,
}: Props) {
  const markerRefs = useRef(new Map<string, LeafletMarker>());

  return (
    <MapContainer
      center={SKOPJE_CENTER}
      zoom={12}
      className="h-full w-full"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      {showZones &&
        schools.map((s) => (
          <Circle
            key={`zone-${s.id}`}
            center={[s.lat, s.lng]}
            radius={RESTRICTION_RADIUS_M}
            pathOptions={{
              color: "#dc2626",
              weight: 1,
              opacity: 0.5,
              fillColor: "#dc2626",
              fillOpacity: 0.08,
            }}
          />
        ))}

      {showSchools &&
        schools.map((s) => (
          <Marker key={s.id} position={[s.lat, s.lng]} icon={schoolIcon}>
            <Popup>
              <div className="min-w-[180px] space-y-1 text-sm">
                <p className="font-semibold text-slate-900">{s.name}</p>
                <p className="text-slate-500">
                  {SCHOOL_TYPE_LABELS[s.type]}
                  {s.municipality ? ` · ${s.municipality}` : ""}
                </p>
                <p className="text-xs text-slate-400">Извор: {s.source}</p>
              </div>
            </Popup>
          </Marker>
        ))}

      {venues.map((c) => (
        <Marker
          key={c.venue.id}
          position={[c.venue.lat, c.venue.lng]}
          icon={venueIcon(c)}
          ref={(m) => {
            if (m) markerRefs.current.set(c.venue.id, m);
            else markerRefs.current.delete(c.venue.id);
          }}
          eventHandlers={{ click: () => onSelect(c.venue.id) }}
        >
          <Popup maxWidth={300}>
            <VenueDetail item={c} />
          </Popup>
        </Marker>
      ))}

      <SelectionController selected={selected} markerRefs={markerRefs} />
    </MapContainer>
  );
}
