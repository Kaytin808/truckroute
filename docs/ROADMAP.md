# Ordered build gates

- [x] 1. Map + foreground location permission + multiple truck profiles
  - TypeScript, lint, and unit tests pass.
  - Android arm64 debug and standalone release APKs build successfully with JDK 21/SDK 37; the release APK signature was verified.
  - iOS pods/archive require the macOS GitHub runner.
- [ ] 2. Truck routing + maneuver guidance + off-route rerouting
- [ ] 3. FHWA/OSM bridge and weight-restriction import, spatial scan, two-stage warnings
- [ ] 4. Along-route truck stops, rest areas, parking, and weigh stations
- [ ] 5. HOS reminder, load log, fuel/MPG, and NWS route weather
- [ ] 6. Regional offline packs and driving-mode polish
- [ ] 7. Android parity and device matrix

Do not begin a later gate until the preceding gate runs on a physical phone. The next required external input is a no-card TomTom API key for phase 2.
