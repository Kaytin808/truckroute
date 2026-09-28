import {getDatabase, initializeDatabase} from '../database/database';
import {
  STANDARD_TRACTOR_TRAILER,
  type HazmatClass,
  type TruckProfile,
} from '../../types/truck';

type TruckProfileRow = Record<string, string | number | boolean | ArrayBuffer | null> & {
  id: string;
  name: string;
  height_inches: number;
  gross_weight_lb: number;
  tractor_length_inches: number;
  trailer_length_inches: number;
  width_inches: number;
  axle_count: number;
  trailer_count: number;
  hazmat_class: string;
  safety_buffer_inches: number;
  is_active: number;
  created_at: string;
  updated_at: string;
};

const fromRow = (row: TruckProfileRow): TruckProfile => ({
  id: row.id,
  name: row.name,
  heightInches: row.height_inches,
  grossWeightLb: row.gross_weight_lb,
  tractorLengthInches: row.tractor_length_inches,
  trailerLengthInches: row.trailer_length_inches,
  widthInches: row.width_inches,
  axleCount: row.axle_count,
  trailerCount: row.trailer_count,
  hazmatClass: row.hazmat_class as HazmatClass,
  safetyBufferInches: row.safety_buffer_inches,
  isActive: row.is_active === 1,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const makeId = (): string =>
  `truck-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export async function listTruckProfiles(): Promise<TruckProfile[]> {
  await initializeDatabase();
  const result = await getDatabase().executeAsync<TruckProfileRow>(
    'SELECT * FROM truck_profiles ORDER BY is_active DESC, name COLLATE NOCASE',
  );
  return result.rows._array.map(fromRow);
}

export async function ensureDefaultTruckProfile(): Promise<TruckProfile[]> {
  const profiles = await listTruckProfiles();
  if (profiles.length > 0) {
    return profiles;
  }
  const now = new Date().toISOString();
  await saveTruckProfile({
    ...STANDARD_TRACTOR_TRAILER,
    id: makeId(),
    createdAt: now,
    updatedAt: now,
  });
  return listTruckProfiles();
}

export async function saveTruckProfile(profile: TruckProfile): Promise<void> {
  await initializeDatabase();
  const db = getDatabase();
  await db.transaction(async tx => {
    if (profile.isActive) {
      tx.execute('UPDATE truck_profiles SET is_active = 0');
    }
    tx.execute(
      `INSERT INTO truck_profiles(
        id, name, height_inches, gross_weight_lb, tractor_length_inches,
        trailer_length_inches, width_inches, axle_count, trailer_count,
        hazmat_class, safety_buffer_inches, is_active, created_at, updated_at
      ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        height_inches = excluded.height_inches,
        gross_weight_lb = excluded.gross_weight_lb,
        tractor_length_inches = excluded.tractor_length_inches,
        trailer_length_inches = excluded.trailer_length_inches,
        width_inches = excluded.width_inches,
        axle_count = excluded.axle_count,
        trailer_count = excluded.trailer_count,
        hazmat_class = excluded.hazmat_class,
        safety_buffer_inches = excluded.safety_buffer_inches,
        is_active = excluded.is_active,
        updated_at = excluded.updated_at`,
      [
        profile.id,
        profile.name,
        profile.heightInches,
        profile.grossWeightLb,
        profile.tractorLengthInches,
        profile.trailerLengthInches,
        profile.widthInches,
        profile.axleCount,
        profile.trailerCount,
        profile.hazmatClass,
        profile.safetyBufferInches,
        profile.isActive ? 1 : 0,
        profile.createdAt,
        profile.updatedAt,
      ],
    );
  });
}

export async function activateTruckProfile(id: string): Promise<void> {
  await initializeDatabase();
  await getDatabase().transaction(async tx => {
    tx.execute('UPDATE truck_profiles SET is_active = 0');
    tx.execute(
      'UPDATE truck_profiles SET is_active = 1, updated_at = ? WHERE id = ?',
      [new Date().toISOString(), id],
    );
  });
}

export async function removeTruckProfile(id: string): Promise<void> {
  await initializeDatabase();
  await getDatabase().executeAsync(
    'DELETE FROM truck_profiles WHERE id = ? AND is_active = 0',
    [id],
  );
}

export function newTruckProfile(name = 'New profile'): TruckProfile {
  const now = new Date().toISOString();
  return {
    ...STANDARD_TRACTOR_TRAILER,
    id: makeId(),
    name,
    isActive: false,
    createdAt: now,
    updatedAt: now,
  };
}
