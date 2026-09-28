import type {RouteRequest, RoutingProviderId} from './types';

const rounded = (value: number): number => Math.round(value * 100000) / 100000;

export function createRouteCacheKey(
  provider: RoutingProviderId,
  request: RouteRequest,
): string {
  const points = [request.origin, ...request.stops, request.destination]
    .map(point => `${rounded(point.latitude)},${rounded(point.longitude)}`)
    .join('|');
  const truck = request.truck;
  return [
    provider,
    points,
    truck.heightInches,
    truck.grossWeightLb,
    truck.tractorLengthInches + truck.trailerLengthInches,
    truck.widthInches,
    truck.axleCount,
    truck.trailerCount,
    truck.hazmatClass,
  ].join(':');
}
