export type HazmatClass =
  | 'none'
  | 'explosives'
  | 'gas'
  | 'flammable'
  | 'oxidizer'
  | 'poison'
  | 'radioactive'
  | 'corrosive'
  | 'other';

export interface TruckProfile {
  id: string;
  name: string;
  heightInches: number;
  grossWeightLb: number;
  tractorLengthInches: number;
  trailerLengthInches: number;
  widthInches: number;
  axleCount: number;
  trailerCount: number;
  hazmatClass: HazmatClass;
  safetyBufferInches: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const STANDARD_TRACTOR_TRAILER: Omit<
  TruckProfile,
  'id' | 'createdAt' | 'updatedAt'
> = {
  name: 'Standard 53 ft',
  heightInches: 13 * 12 + 6,
  grossWeightLb: 80000,
  tractorLengthInches: 20 * 12,
  trailerLengthInches: 53 * 12,
  widthInches: 8 * 12 + 6,
  axleCount: 5,
  trailerCount: 1,
  hazmatClass: 'none',
  safetyBufferInches: 6,
  isActive: true,
};

export function inchesToFeetAndInches(totalInches: number): string {
  return `${Math.floor(totalInches / 12)}' ${totalInches % 12}"`;
}

export function feetAndInchesToInches(feet: number, inches: number): number {
  return feet * 12 + inches;
}

export function poundsToKilograms(pounds: number): number {
  return Math.round(pounds * 0.45359237);
}

export function inchesToMeters(inches: number): number {
  return Number((inches * 0.0254).toFixed(3));
}
