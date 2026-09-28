import type {
  RouteRequest,
  RoutingProvider,
  RoutingProviderId,
  TruckRoute,
} from '../types';
import {RoutingProviderError} from '../types';

export class UnconfiguredProvider implements RoutingProvider {
  constructor(
    readonly id: RoutingProviderId,
    readonly displayName: string,
    private readonly apiKey?: string,
  ) {}

  isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  async calculateRoute(_request: RouteRequest): Promise<TruckRoute> {
    throw new RoutingProviderError(
      `${this.displayName} needs an API key before routing can be used.`,
      this.id,
      false,
    );
  }
}
