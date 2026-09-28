import type {RoutingProviderId} from '../services/routing/types';

// API keys are injected at build time later. Never commit live keys.
export interface RuntimeConfig {
  routingProvider: RoutingProviderId;
  tomTomApiKey?: string;
  openRouteServiceApiKey?: string;
  hereApiKey?: string;
}

export const runtimeConfig: RuntimeConfig = {
  routingProvider: 'tomtom',
};
