import type {TruckProfile} from '../../types/truck';

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface RouteStop extends Coordinate {
  id: string;
  label: string;
  notes?: string;
}

export interface RouteRequest {
  origin: Coordinate;
  destination: Coordinate;
  stops: RouteStop[];
  truck: TruckProfile;
  departureTime?: string;
  alternatives?: number;
}

export interface LaneGuidance {
  lanes: Array<{directions: string[]; recommended: boolean}>;
}

export interface RouteManeuver {
  id: string;
  instruction: string;
  distanceFromStartMeters: number;
  coordinate: Coordinate;
  exitNumber?: string;
  laneGuidance?: LaneGuidance;
}

export interface TruckRoute {
  provider: RoutingProviderId;
  providerRouteId?: string;
  geometry: Coordinate[];
  distanceMeters: number;
  durationSeconds: number;
  tollCost?: {currency: string; amount: number};
  maneuvers: RouteManeuver[];
  warnings: string[];
  computedAt: string;
  expiresAt: string;
}

export type RoutingProviderId = 'tomtom' | 'openrouteservice' | 'here';

export interface RoutingProvider {
  readonly id: RoutingProviderId;
  readonly displayName: string;
  isConfigured(): boolean;
  calculateRoute(request: RouteRequest): Promise<TruckRoute>;
}

export class RoutingProviderError extends Error {
  constructor(
    message: string,
    readonly provider: RoutingProviderId,
    readonly retryable: boolean,
    readonly statusCode?: number,
  ) {
    super(message);
    this.name = 'RoutingProviderError';
  }
}
