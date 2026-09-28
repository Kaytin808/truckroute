# Provider and open-data decision

Checked on 2026-09-27. Recheck these terms before enabling a provider in a distributed build; quotas and licenses change.

## Routing recommendation

| Provider | Current free access | Signup/payment | Truck support | Decision |
|---|---:|---|---|---|
| TomTom Routing API | 20,000 routing requests/month | Account and API key; no credit card required | Truck mode, dimensions, weight, axle count, commercial status, hazmat/load types, instructions and traffic | Recommended first adapter for personal testing |
| openrouteservice | 2,000 directions/day, 40/minute on Standard | Free account and API key; no card indicated | `driving-hgv`, vehicle restrictions; 6,000 km driving route limit | Recommended fallback; open source/self-hostable later |
| HERE Routing API v8 | Limited plan: 1,000 requests/day and 10 truck-routing RPS without payment information | HERE account and API key; payment details not required for Limited | Excellent truck attributes, maneuvers and toll detail | Keep adapter slot, but do not make default until HERE confirms the planned use fits current exclusions |

Why not default to HERE immediately: HERE's current Limited/Base pricing page defines broad excluded use cases around managed assets and some safety-enhancement alerts. A personal, phone-mounted navigator may be distinguishable from fleet asset management, but the warning layer makes the fit ambiguous. Get written confirmation before depending on it. Requesting HERE toll costs also counts as an additional transaction.

Sources:

- [TomTom pricing](https://docs.tomtom.com/pricing)
- [TomTom truck routing parameters](https://docs.tomtom.com/routing-api/documentation/tomtom-maps/v1/calculate-route)
- [openrouteservice plans](https://openrouteservice.org/plans/)
- [openrouteservice API restrictions](https://openrouteservice.org/restrictions/)
- [HERE Routing v8 setup](https://docs.here.com/routing/docs/routing-v8-get-started)
- [HERE limits and exclusions](https://www.here.com/get-started/pricing/rps-limits-excluded-use-cases)
- [HERE toll responses](https://docs.here.com/routing/docs/routing-v8-tolls-for-route)

The route cache key includes coordinates and all safety-relevant truck attributes. Responses and geocodes are stored locally with explicit expiry timestamps. The app must never silently fall back to car routing.

## Map tiles and offline use

OpenFreeMap is selected for the phase-1 online map because its public instance states that it is free with no map-view/request limit. The style used by the app is `https://tiles.openfreemap.org/styles/liberty`; visible OpenStreetMap/OpenFreeMap attribution remains on the map.

Do not bulk-download the public OpenFreeMap service for offline packs without permission. For phase 6, produce regional Protomaps PMTiles/another self-hosted extract from OSM data, or use a provider whose terms explicitly permit offline downloads. Protomaps publishes daily basemap builds under the ODbL Produced Work terms, supports region extracts, and requires OpenStreetMap attribution.

- [OpenFreeMap](https://openfreemap.org/)
- [OpenFreeMap terms](https://openfreemap.org/tos/)
- [Protomaps basemap downloads](https://docs.protomaps.com/basemaps/downloads)

## Safety and POI datasets

### OpenStreetMap and Overpass

- License: ODbL; show `© OpenStreetMap contributors` and link to the copyright page. If a derived database is publicly distributed, ODbL share-alike obligations may apply. Personal internal use is simpler, but attribution remains in the UI.
- Coverage/update: global community data; edits can become available quickly, but restriction and amenity tagging is incomplete and not safety-certified.
- Tags to ingest include `maxheight`, `maxweight`, `maxaxleload`, `maxlength`, `highway=rest_area`, `highway=services`, `amenity=fuel` with HGV-related tags, `amenity=parking` plus `hgv=yes/designated`, and `amenity=weighbridge`. Also inspect the less-standard `service=weigh_station`; do not assume one tag finds every enforcement station.
- Public Overpass is for light, sequential queries. Its current guidance for recurring apps is roughly under 100 queries and 10 MB/day, with a unique User-Agent, caching, backoff on 429/504, and no parallel scraping. Region extracts are preferable for bulk/offline ingestion.

### FHWA National Bridge Inventory

- US federal public data covering bridges subject to National Bridge Inspection Standards (generally public-road bridges over 20 ft), not every low overhead obstruction.
- States and federal agencies submit annually; final annual highway-bridge files have historically been published around June 15, with corrections possible during the year. A field inspection can be older than the submission year.
- The legacy NBI has clearance fields such as Items 53/54 and load-rating/posting fields. The new SNBI submission started in 2026 and changes/crosswalks fields including highway clearance and posting status. The importer must version the source schema and retain source/update dates.
- NBI/SNBI values are an independent warning input, never a guarantee of clearance or legal load.

- [FHWA NBI downloads](https://www.fhwa.dot.gov/bridge/nbi/ascii.cfm)
- [FHWA annual submission notes](https://www.fhwa.dot.gov/bridge/nbi/element.cfm)
- [NBI record format](https://www.fhwa.dot.gov/bridge/nbi/format.cfm)
- [SNBI crosswalk](https://www.fhwa.dot.gov/bridge/snbi/datacrosswalk.cfm)

### NWS weather

- `api.weather.gov` is US government open data, free for any purpose with reasonable unpublished rate limits.
- Send an identifying User-Agent, honor cache headers, and cache route samples locally. For alerts, NWS recommends polling no more often than every 30 seconds; a navigation app should poll much less often and only while active.
- Coverage is US forecasts, observations, and alerts. Weather warnings inform the driver but do not determine road legality or closure status.

- [NWS API](https://www.weather.gov/documentation/services-web-api)
- [NWS alerts service](https://www.weather.gov/documentation/services-web-alerts)

### State DOT / 511 feeds

Treat every state as a separate optional adapter behind a feature flag. Before enabling one, record its endpoint, license/attribution, geographic coverage, freshness/latency, authentication, redistribution terms, and failure behavior. There is no single national free feed that reliably covers live parking or weigh-station open/closed state.

## Personal Android sideloading after September 2026

Google's developer-verification rollout starts enforcement in selected participating stores/regions on September 30, 2026 and expands globally in 2027. This does not remove direct sideloading: advanced-flow unregistered installs and ADB remain available. A free limited-distribution account is another personal-use option for up to 20 registered devices; it requires a Google account, two-step verification, and a payments profile but no government ID or registration fee.

- [Android developer verification](https://developer.android.com/developer-verification/guides)
- [Limited distribution](https://developer.android.com/developer-verification/guides/limited-distribution)
