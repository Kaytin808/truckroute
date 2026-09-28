import {schemaStatements} from '../src/data/database/schema';

describe('local-first schema', () => {
  it.each([
    'truck_profiles',
    'route_cache',
    'geocode_cache',
    'poi_cache',
    'bridge_restrictions_rtree',
    'trips',
    'fuel_log',
    'weather_cache',
    'offline_regions',
  ])('contains %s', table => {
    expect(schemaStatements.join('\n')).toContain(table);
  });
});
