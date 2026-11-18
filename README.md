# Armaan & Meher — Noor Mahal

An original royal Punjabi wedding experience by **Invite Wonderland**, built from the Project Infinity foundation and reimagined around eight new couple photographs.

Live invitation: https://invitewonderland.github.io/armaan-meher-noor-mahal/

Repository: https://github.com/invitewonderland/armaan-meher-noor-mahal

## Open and build

The complete static site is in `dist/`. Serve it with:

```powershell
python -m http.server 4193 --bind 127.0.0.1 --directory dist
```

Then open http://127.0.0.1:4193/. The source root can also be served directly. Use Node 20+:

```powershell
npm ci
npm run build
npm test
```

If npm is unavailable but the included dependencies are present, `node scripts/build.cjs` and `node --test tests/noor.test.mjs` perform the same build and active checks.

## The experience

1. **The first light.** An ivory-and-gold, scalloped palace portrait, engraved names and an animated monogram seal open the story.
2. **The portrait salon.** Eight intact photographs in a gilded editorial gallery. Mouse movement gives the frame a subtle perspective; touch and keyboard controls select each memory.
3. **From Punjab, with love.** A sunlit mustard-field portrait, Punjabi dedication and a touch-triggered dance of marigold petals.
4. **The celebrations.** Four photographic rooms for Mehndi, Sangeet, Anand Karaj and Reception. Each opens its own invitation and a standards-compliant calendar download in India time.
5. **The heartbeat.** A custom illustrated dhol with four Web Audio percussion voices. Play by touch, A/S/D/F, or a finite original celebration rhythm. Muting, navigating away or hiding the page stops the rhythm.
6. **The phulkari of wishes.** A procedural embroidered textile lights up around a blessing. Up to eight blessings stay only in the visitor's browser. They can be removed from the visible result; no submissions go to a server.
7. **An invitation from the heart.** A formal family invitation and a 1200 × 1600 JPEG keepsake generated locally from the supplied portrait.
8. **Our forever.** Floating photographic keepsakes, a golden monogram and an interactive six-petal light sculpture. Share using the native share sheet or link clipboard, or replay the complete story.

The journey is manually paced. Use next/back, chapter dots, the chapter menu, horizontal background swipes or arrow keys. Native fullscreen is available where supported; the home-screen manifest requests fullscreen presentation. Mobile browser chrome remains controlled by the browser.

## Celebration details

With the user's permission, the creative concept uses **18–20 December 2026**, hosted by **the Singh & Kaur families** at an **imagined Noor Mahal in Patiala**. These are creative invitation details, not a verified venue or booking.

| Celebration | India time | Imagined palace room |
| --- | --- | --- |
| Mehndi | Friday 18 December, 3 PM | The Marigold Court |
| Sangeet | Saturday 19 December, 7 PM | The Sheesh Mahal |
| Anand Karaj | Sunday 20 December, 10 AM | The Darbar Sahib |
| Reception | Sunday 20 December, 7:30 PM | The Palace Gardens |

Event content and calendar instants live in `src/noor/story.mjs`. The opening, formal invitation, metadata and keepsake text also contain the chosen ceremony date. Update all of these together when replacing the concept details.

## Architecture and quality

- `src/noor/experience.mjs`: scene state, queued transitions, gestures, dialogs, gallery, storage, calendar and JPEG export.
- `src/noor/realm.mjs`: instanced metallic petals, shader stars, a tubular light sculpture and a functional Canvas fallback.
- `src/noor/sound.mjs`: gesture-unlocked score, synthesised dhol voices and bounded rhythm lifecycle.
- `src/noor/weave.mjs`: stitched phulkari-inspired Canvas artwork with local bloom animation.
- `noor.css`, `noor-fonts.css`: responsive compositions and locally bundled fonts.
- `scripts/build.cjs`: bundles Three.js, adds content hashes to CSS/JS URLs and prepares the complete `dist/`.

All eight full-size photographs are optimised WebP copies; the supplied PNG originals in the original workspace’s `assets/punjabi images/` are untouched. The selected soundtrack is the user-supplied **A Canopy of White Roses**, carried forward from the foundation. All runtime assets, including fonts and Three.js, are served locally; there are no runtime CDNs, trackers, remote forms or analytics.

WebGL uses a maximum pixel ratio of 2, instancing and bounded allocations. Reduced-motion settings preserve the static artwork and every action. Hidden scenes are inert; native dialogs manage focus. Page hiding suspends rendering and audio. The opt-in `?profile=1` writes a 240-frame CPU rendering sample into `#realm[data-profile]`; it is not a GPU benchmark or a physical-phone measurement.

The older Infinity source and QA are retained in the original workspace for reference and are not included in this repository or the new static deployment. `qa/noor/` contains the new verification and screenshots. `RECORDING.md` contains a suggested mobile recording sequence.

GitHub Pages publishes this invitation from the `codex/noor-mahal` branch, root `/`, in the separate `invitewonderland/armaan-meher-noor-mahal` repository. The ready-built HTML, CSS, JavaScript and media are checked in. After changing source, run the build and tests, then push this branch. The original Project Infinity repository remains unchanged.

The local GitHub publication checkout is `publication/github-pages/`. The earlier owner-only Sites preview is separate; its `.openai/hosting.json` stays in the original workspace and is excluded from this GitHub repository.

## Credits

Three.js is MIT licensed; see `THREE-LICENSE.txt`. Cormorant Garamond, Manrope and Noto Serif Gurmukhi use the included SIL Open Font Licenses under `assets/noor/fonts/`. Brand and commission links lead to https://www.instagram.com/invitewonderland.
