# Test Records — Meme Discovery App

Run every test yourself, record the actual result, and attach genuine screenshots. Do not mark tests as passed before executing them.

| ID | Procedure | Expected result | Actual result / status | Screenshot |
|---|---|---|---|---|
| T01 | Launch app | Loading indicator briefly appears; feed then loads | Fill in | T01-home.png |
| T02 | Select Animals | Only animal memes appear | Fill in | T02-animals.png |
| T03 | Select All and scroll | Feed scrolls | Fill in | T03-scroll.png |
| T04 | Open a card | Image, title, category, description, source appear | Fill in | T04-detail.png |
| T05 | Tap detail image twice | Zoom/fit view toggles | Fill in | T05-zoom.png |
| T06 | Tap a heart | Favorite status/count updates | Fill in | T06-favorite.png |
| T07 | Close and reopen app | Favorite remains saved | Fill in | T07-persistence.png |
| T08 | Open Favorites | Only saved memes appear | Fill in | T08-favorites.png |
| T09 | Tap Share | Platform share UI opens | Fill in | T09-share.png |
| T10 | Download on web | PNG download starts | Fill in | T10-download-web.png |
| T11 | Download on mobile | Permission is requested if needed; image is saved | Fill in | T11-download-mobile.png |
| T12 | Remove all favorites | Empty state and Explore button appear | Fill in | T12-empty.png |
| T13 | Simulate storage initialization failure | Error message and Retry button appear | Fill in | T13-error.png |
| T14 | Restore storage and tap Retry | App returns to feed | Fill in | T14-retry.png |
| T15 | Test web and phone | Main features work on both targets | Fill in | T15-platforms.png |

## Test environment
- Date/time:
- Browser/version:
- OS / phone model:
- Node version (`node --version`):
- Expo version (`npx expo --version`):

For T13, temporarily insert a deliberate throw in the initialization `try` block, verify the error state, then remove the throw and test Retry. Do not commit the deliberate failure. Capture real screenshots from the running application.
