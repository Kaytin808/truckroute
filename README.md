# HaulSafe

HaulSafe is an original, personal-use truck navigation project built with bare React Native and TypeScript. It is not affiliated with Trucker Path and does not use its branding, assets, or proprietary data.

Phase 1 includes:

- MapLibre with OpenFreeMap vector maps and visible OpenStreetMap attribution
- foreground location permission and follow mode
- multiple SQLite-backed truck profiles with standard US tractor-trailer defaults
- a vendor-neutral `RoutingProvider` contract and route cache key
- a local-first schema covering all planned feature areas
- Android APK and iOS IPA GitHub Actions workflows
- persistent in-app safety disclaimers

Read [provider/data research](docs/PROVIDER_AND_DATA_RESEARCH.md), [architecture](docs/ARCHITECTURE.md), and the [ordered roadmap](docs/ROADMAP.md) before adding the next feature phase.

## Local setup

Requirements: Node 22.11+ (Node 24 recommended), JDK 21 and Android SDK for Android, or Xcode 26 and CocoaPods for iOS.

```sh
npm ci
npm run verify
npm start
```

Then run `npm run android` or `npm run ios` from a correctly configured native development machine.

On Windows, keep the checkout path short (for example `C:\dev\haulsafe`). React Native's C++ code generation and Nitro SQLite can exceed the legacy 260-character tool limit when the repository is nested deeply.

## Personal sideload builds

Android CI accepts these repository secrets:

- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

Without them, the workflow still produces a sideloadable APK signed with the project debug key. Do not use that fallback for anything beyond personal testing.

Android developer verification begins enforcement in selected regions on September 30, 2026 and expands globally in 2027. Direct ADB installs remain available; Google's limited-distribution account is also free for hobbyists and supports up to 20 registered devices, but requires a Google account, two-step verification, and a payments profile. See the current [Android verification guide](https://developer.android.com/developer-verification/guides) before installing on a new device.

iOS CI always packages an IPA. With no signing secrets it is unsigned for Sideloadly to sign locally. For a development-signed IPA, export the current Apple Development certificate and free provisioning profile from a Mac and set:

- `IOS_CERTIFICATE_BASE64`
- `IOS_CERTIFICATE_PASSWORD`
- `IOS_PROVISIONING_PROFILE_BASE64`
- `IOS_TEAM_ID`
- `IOS_SIGNING_IDENTITY` (normally `Apple Development`)

Free Apple Personal Team profiles expire after about seven days. Refresh the profile/secrets and rebuild weekly, or let Sideloadly/LiveContainer handle local signing. The workflow does not require a paid Apple Developer membership.

## Safety

Restriction data may be incomplete, incorrect, or outdated. Posted signs and road-authority directions always take priority. HaulSafe is not an ELD and its future HOS feature will only be a personal reminder.

## License/attribution

Map and POI data: © OpenStreetMap contributors, ODbL. Online tiles/style: OpenFreeMap. Additional source attribution will be recorded alongside imported FHWA, NWS, and state data.
