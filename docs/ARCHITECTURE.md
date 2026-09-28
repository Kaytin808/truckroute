# HaulSafe architecture

HaulSafe is a local-first, personal-use React Native app. Network services improve current data but are not the system of record for profiles, logs, favorites, or the last usable route.

## Current phase: map, location, and truck profile

- `src/features/map` owns the MapLibre screen and user-follow state.
- `src/features/profiles` owns profile UI and application state.
- `src/data` contains the Nitro SQLite connection, schema, and repositories.
- `src/services/routing` defines the vendor-neutral contract and provider registry. Provider HTTP implementations intentionally remain phase 2.
- `src/services/location` handles platform permission state. Background navigation tracking and the Android foreground service are phase 2.
- `src/config/runtime.ts` selects the provider without exposing a key in source control.

## Routing contract rules

Every provider adapter must:

1. Submit every applicable active-truck attribute. Unsupported attributes must produce an explicit warning; they must never be silently dropped.
2. Normalize provider geometry, duration, distance, maneuvers, lanes, exits, tolls, and warnings into `TruckRoute`.
3. Throw `RoutingProviderError` with retryability and HTTP status rather than returning a car route.
4. Use `createRouteCacheKey`, store a bounded expiry, and allow the last successfully computed route to remain available offline.
5. Redact API keys and full location history from logs.

## Local database

Schema version 1 includes profiles/settings, route and geocode caches, cached POIs, bridge restrictions plus an R-tree, trips/stops, favorites, personal parking/weigh reports, HOS reminders, load/fuel logs, weather cache, and offline-region metadata. New schema changes should be forward migrations; never destroy the user's local logs during upgrade.

## Safety boundary

The routing provider is layer 1. The locally indexed FHWA/OSM restriction scan is independent layer 2. Neither layer replaces signs, permits, dispatch instructions, or road-authority directions. The warning is persistent in driving surfaces.
