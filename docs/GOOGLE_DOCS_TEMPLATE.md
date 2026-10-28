# Meme Discovery App — Project Report

**Student name(s):** [Enter name(s)]  
**Course / class:** [Enter course]  
**Submission date:** [Enter date]  
**Public GitHub repository:** [Paste URL]

## 1. Project overview
Meme Discovery is a cross-platform app that lets users browse memes by category, open meme details, save favorites, share meme information, and download images. It uses React Native and Expo with a bundled local JSON file.

## 2. Objectives
- Display category-based meme collections and a scrollable feed.
- Filter memes by category.
- Show image, title, source, description, and zoom interaction.
- Support favorites, sharing, and downloading.
- Persist favorite IDs across sessions.
- Provide loading, error, and retry feedback.
- Run on web and mobile from one codebase.

## 3. Tools and technologies
React Native, Expo, JavaScript, local JSON, AsyncStorage, Expo MediaLibrary/FileSystem, GitHub.

## 4. Application design
The home screen has category chips, a favorites control, and a two-column feed. Selecting a card opens its detail view. The detail view provides image zoom, source information, favorite, share, and download actions.

## 5. Data design
Meme metadata is stored in `src/data/memes.json`. Each record includes ID, title, category, description, source, and an image key. PNG files are bundled in `assets/memes/`.

## 6. Screenshots
Insert actual screenshots from the running app:
- Home screen: [Insert screenshot]
- Category-filtered feed: [Insert screenshot]
- Meme detail and zoom: [Insert screenshot]
- Favorites screen: [Insert screenshot]
- Share/download interaction: [Insert screenshot]
- Error and retry state: [Insert screenshot]

## 7. Testing and results
Copy the completed test table from `docs/TEST_RECORDS.md` here. Include actual results, pass/fail status, test environment, and screenshot evidence. Do not claim tests passed unless you ran them.

## 8. Limitations and future improvements
The sample data is bundled and does not refresh automatically. Sharing sends text/source rather than guaranteeing an image attachment on every platform. Zoom is a fit/zoom toggle rather than pinch-to-zoom. Future versions could add search, pagination, user-submitted memes, and a moderated remote API.

## 9. Conclusion
Update this section after testing both platforms. Summarize which required features were verified and any known limitations.

## 10. Submission checklist
- [ ] Public GitHub repository created
- [ ] README setup instructions checked
- [ ] Web version tested
- [ ] Mobile version tested
- [ ] Real screenshots inserted
- [ ] Test records completed
- [ ] Google Docs sharing set to “Anyone with the link — Viewer”
- [ ] GitHub and Google Docs links submitted
