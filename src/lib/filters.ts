import type { SchoolType, Status, VenueKind } from "./types";

export interface FiltersState {
  kinds: Record<VenueKind, boolean>;
  statuses: Record<Status, boolean>;
  schoolTypes: Record<SchoolType, boolean>;
  municipality: string; // "all" или име на општина
  query: string;
  showSchools: boolean;
  showZones: boolean;
  showMunicipalities: boolean;
}

export const DEFAULT_FILTERS: FiltersState = {
  kinds: {
    casino: true,
    automat_club: true,
    electronic_games: true,
    betting_shop: true,
  },
  statuses: { compliant: true, restricted: true, must_relocate: true },
  schoolTypes: { primary: true, secondary: true },
  municipality: "all",
  query: "",
  showSchools: true,
  showZones: true,
  showMunicipalities: true,
};

export function isDefaultFilters(filters: FiltersState): boolean {
  return JSON.stringify(filters) === JSON.stringify(DEFAULT_FILTERS);
}
