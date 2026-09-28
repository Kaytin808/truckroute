import {runtimeConfig} from '../../config/runtime';
import type {RoutingProvider, RoutingProviderId} from './types';
import {UnconfiguredProvider} from './providers/UnconfiguredProvider';

const providers: Record<RoutingProviderId, RoutingProvider> = {
  tomtom: new UnconfiguredProvider(
    'tomtom',
    'TomTom Routing',
    runtimeConfig.tomTomApiKey,
  ),
  openrouteservice: new UnconfiguredProvider(
    'openrouteservice',
    'openrouteservice HGV',
    runtimeConfig.openRouteServiceApiKey,
  ),
  here: new UnconfiguredProvider(
    'here',
    'HERE Routing v8',
    runtimeConfig.hereApiKey,
  ),
};

export function getRoutingProvider(id: RoutingProviderId): RoutingProvider {
  return providers[id];
}

export function getSelectedRoutingProvider(): RoutingProvider {
  return getRoutingProvider(runtimeConfig.routingProvider);
}

export function listRoutingProviders(): RoutingProvider[] {
  return Object.values(providers);
}
