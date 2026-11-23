# Example App

This is a minimal Expo application demonstrating how to use the open-wearables React Native SDK.

The app shows how to:

- Request HealthKit permissions
- Configure the SDK
- Authenticate a user
- Start background health data synchronization
- Manual health data synchronization
- Listen for SDK events

---

# Requirements

- Node.js 18+
- Xcode 15+
- iOS 15.1+
- Expo CLI

---

# iOS Bundle Identifier

The example project contains a default `bundleIdentifier` that may already be registered on another Apple Developer account.  
If you encounter a signing error when building the project, update the bundle identifier to a unique value.

You can change it in: example/app.json → "expo" → "ios" → "bundleIdentifier".

Then regenerate the native project (from the /example directory):

```sh
npx expo prebuild --clean
```

---

# Running the example

1. Install SDK dependencies from the repository root:

```sh
npm install
```

2. Install example app dependencies:

```sh
cd example
npm install
```

The example imports the SDK directly from the local repository so changes to the SDK can be tested immediately.

3. Run the app:

### iOS

```sh
npx expo run:ios
```

The app will launch in the iOS simulator or on a connected device.

### Android

Prerequisite: the Expo native project must already be generated.

```sh
npx expo prebuild
```

The module resolves the Android SDK (`v0.13.3`) from JitPack, so no extra setup is needed. To test
a local build of the Android SDK instead, publish it with `./gradlew publishToMavenLocal` from that
repository, add `mavenLocal()` first under `allprojects` → `repositories` in
`example/android/build.gradle`, and point the dependency in `../android/build.gradle` at the
coordinate it published.

Run the Android app (from the /example directory):

```sh
npx expo run:android
```
