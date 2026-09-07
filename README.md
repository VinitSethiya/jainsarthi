# JainSarthi Expo app

Frontend-only Expo React Native app. It implements the supplied splash, login landing, sign-up, mobile login, and OTP designs.

## Run

```bash
npm install
npm start
```

## Structure

- `src/screens` — feature screens
- `src/components` — reusable UI primitives
- `src/navigation` — temporary local navigator; replace with React Navigation when the route list grows
- `src/services` — mock service boundary; swap mock calls for API calls later
- `src/theme` — shared colours and design tokens
- `src/types` — shared TypeScript types

The OTP flow is deliberately mocked. Any four digits verify successfully; no network or backend is required.
