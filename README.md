# Meme Discovery App
Cross-platform meme browser built with React Native + Expo. Meme metadata is bundled in local JSON, and sample images are stored locally.

## Features
- Category filters and scrollable two-column feed
- Detail screen with title, description, source, and tap-to-toggle zoom
- Favorites persisted with AsyncStorage
- Share meme text using the platform share sheet
- Download images in a browser or to a mobile photo library
- Loading, retryable initialization error, and user feedback states
- Twelve original sample meme cards; no remote API required

## Requirements
- Node.js LTS and npm
- VS Code (recommended)
- Expo Go for physical phone testing, or Android Studio/Xcode for simulators

## Run
1. Extract this ZIP and open the project folder in VS Code.
2. Open a terminal in the folder and run `npm install`.
3. Run `npx expo start`.
4. Press `w` for web, scan the QR code with Expo Go for a phone, or press `a` for an Android emulator.
5. If Expo reports dependency mismatches, run `npx expo install --fix`, then restart.

## Structure
- `App.js`: app screens and interactions
- `src/data/memes.json`: local meme metadata
- `assets/memes/`: bundled PNG images
- `docs/TEST_RECORDS.md`: manual test plan and evidence log
- `docs/GOOGLE_DOCS_TEMPLATE.md`: report text to paste into Google Docs

## Adding a meme
Add an entry in `src/data/memes.json`, put its PNG in `assets/memes/`, then add a matching static `require(...)` in the `images` map in `App.js`. React Native requires static asset references at build time.

## Persistence and platform notes
Favorites are stored using AsyncStorage under `@meme-discovery/favorites`. Browser storage is used on web and app storage on mobile. On web, image downloads use a browser download link; on native, the app requests photo-library permission and saves the image. Sharing sends the meme title, description, and source text; it does not guarantee that every platform attaches the image itself.

The bundled JSON means the feed itself has no remote fetch failure. The loading/error UI covers local favorite-storage initialization. To test the error state, temporarily simulate a storage error in the initialization `try` block, verify the Retry state, and then revert the test change.

## GitHub submission
Create a **public** repository on GitHub. From the project folder run:
```bash
git init
git add .
git commit -m "Build Meme Discovery App"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/meme-discovery-app.git
git push -u origin main
```
Replace `YOUR_USERNAME`, then verify the repository is public and the README is visible while signed out.
