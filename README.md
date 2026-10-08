# KETHWADI — Smart Agriculture & Land Leasing Platform

Client demo app. React Native + Expo + TypeScript + Expo Router. No backend, no API keys, no env vars.

**Tagline:** Cultivating Prosperity, Together.

## Run it

```bash
cd kethwadi
npm install
npx expo install --fix     # reconciles native module versions to your Expo SDK — do not skip
npx expo start
```

Press `a` for Android, or scan the QR with Expo Go.

## Build the APK

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview     # produces a downloadable .apk
```

`eas.json` already defines a `preview` profile with `buildType: apk`. For a Play Store bundle use `--profile production`.

Local build without EAS servers (needs Android SDK + JDK 17):

```bash
npx expo prebuild --platform android
cd android && ./gradlew assembleRelease
# APK at android/app/build/outputs/apk/release/app-release.apk
```

## Demo logins

The login screen has three one-tap shortcuts. OTP flow also works — any 10-digit number, OTP is `1234`.

| Role | Account |
|---|---|
| Landlord | Ramesh Reddy, Warangal |
| Renter farmer | Anil Kumar, Karimnagar |
| Admin | Platform operations |

Profile → "Switch to farmer/landlord view" flips the role live so one demo session covers both flows. "Reset demo data" clears AsyncStorage and reseeds.

## Screens (35)

Splash · Onboarding · Login · Register · Role select · Home · Land search · Land details · Land booking · Lease confirmation · My leases · Landlord dashboard · Add land · My lands · Lease requests · Marketplace · Product details · Cart · Checkout · Orders · Insurance · Insurance plans · Policy details · Raise claim · Claim tracking · Notifications · Profile · KYC · Admin dashboard · Admin users · Admin lands · Admin leases · Admin orders · Admin insurance · Admin claims

## Structure

```
app/            Expo Router routes (file = screen)
components/ui/  Button, Input, Chip, Badge, Card, BottomSheet, SuccessModal,
                ConfirmDialog, Skeleton, EmptyState, Photo, FadeIn
components/domain/  LandCard, LeaseCard, ProductCard, PolicyCard, ClaimCard,
                    StatTile, AdminScreen, Logo, Avatar
constants/      theme.ts (palette, spacing, type scale), format.ts (₹, dates)
data/           Seeded Telangana / AP / Maharashtra / Karnataka records
store/          AppStore.tsx — reducer + AsyncStorage persistence
hooks/          useToast
types/          Shared TypeScript models
```

## Wiring a real backend later

Every mutation goes through one reducer in `store/AppStore.tsx`. Swap the reducer cases for API calls and the UI does not change — no component reads from `data/` for anything it mutates.

## Notes

- Entrance animations use React Native's `Animated`, not Reanimated. That was deliberate: fewer native build failures.
- Land and product photos are remote URLs. Offline, `<Photo>` falls back to a branded gradient tile, so nothing renders broken.
- Payments, KYC verification, claim settlement and document uploads are mocked with realistic delays and states.
