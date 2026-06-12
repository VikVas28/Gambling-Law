export type SchoolType = "primary" | "secondary";
export type VenueKind =
  | "casino"
  | "automat_club"
  | "electronic_games"
  | "betting_shop";
export type Status = "compliant" | "restricted" | "must_relocate";

export interface School {
  id: string;
  name: string;
  type: SchoolType;
  lat: number;
  lng: number;
  municipality?: string;
  address?: string;
  source: string;
}

export interface Venue {
  id: string;
  name: string;
  kind: VenueKind;
  operator?: string;
  licenseNo?: string;
  licenseUrl?: string; // PDF на лиценцата (Министерство за финансии)
  geocodePrecision?: "street" | "poi" | "city"; // за геокодирани адреси
  lat: number;
  lng: number;
  municipality?: string;
  address?: string;
  source: string;
  verified: boolean;
}
