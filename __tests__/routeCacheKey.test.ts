import {createRouteCacheKey} from '../src/services/routing/RouteCacheKey';
import {STANDARD_TRACTOR_TRAILER, type TruckProfile} from '../src/types/truck';

const truck: TruckProfile = {
  ...STANDARD_TRACTOR_TRAILER,
  id: 'test',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('route cache keys', () => {
  it('changes when safety-relevant truck attributes change', () => {
    const request = {
      origin: {latitude: 33.4484, longitude: -112.074},
      destination: {latitude: 34.0522, longitude: -118.2437},
      stops: [],
      truck,
    };
    const original = createRouteCacheKey('tomtom', request);
    const taller = createRouteCacheKey('tomtom', {
      ...request,
      truck: {...truck, heightInches: truck.heightInches + 1},
    });
    expect(taller).not.toBe(original);
  });
});
