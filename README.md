# Armaan & Meher — Noor Mahal / The Woven Light

A living royal Punjabi palace, imagined and crafted by **Invite Wonderland**. This is a complete new experience built on the Project Infinity technical foundation, with eight intact couple photographs, original palace environments and seven connected rooms.

[Open the invitation](https://invitewonderland.github.io/armaan-meher-noor-mahal/) · [GitHub repository](https://github.com/invitewonderland/armaan-meher-noor-mahal)

## Enter the palace

1. **The royal seal.** A physical ivory-and-gold doorway, engraved names and a monogram seal. Touch the seal to swing the two carved leaves open.
2. **The story of us.** Eight lyrical photographic moments: the palace, the Punjab countryside, the bride, the groom, Mehndi, Sangeet and the sacred beginning. Every complete photograph has its own fitted gilt mat and an uncluttered full-image viewer.
3. **The celebrations.** Four photographic invitations for Mehndi, Sangeet, Anand Karaj and Reception. Each contains date, time, venue, attire and an India-time calendar download.
4. **The rang mahal.** A sculpted lacquer-and-gold dhol, with curved exterior lacing, moving membranes and tassels. Play four synthesised voices, compose a phrase of up to sixteen beats, and replay your own rhythm or the original celebration pattern.
5. **The blessing.** Your words become a personal phulkari-inspired embroidery. A deterministic pattern grows outward through the cloth. Keep the embroidered card as a 1200 × 1600 PNG.
6. **A letter from our hearts.** An unfolding formal invitation, the complete Anand Karaj photograph, a calendar action and a 1200 × 1600 portrait keepsake.
7. **Beyond forever.** Golden infinity ribbons and rising points of light surround the complete couple portrait. Let their forever take flight, share the invitation, or experience the palace again.

A fine golden thread, a silk-like light veil and three architectural archways connect the rooms. Physical columns and hanging glass lanterns add a foreground depth layer. Touching the palace water sends expanding ripples into the reflection. The dhol now floats above a dimensional emerald-and-gold ceremonial platform whose rings respond to each note. A sixteen-petal lotus sculpture surrounds the final portrait and opens into the rising constellation. The palace transforms between the mirrored hall, dawn courtyard, luminous blue hour and moonlit water garden. These effects support the place and story; the guest controls the pace.

## The Woven Light refinement

Gate names are synchronously removed with the hidden attribute before the door animation begins, with explicit opening/journey display guards. Returning to the seal restores them. All four celebration dialogs now give the complete original photograph a full-width hero presentation, progressively upgraded to its lossless master. Sticky close controls and native internal scrolling preserve access to the details and calendar.

The formal letter contains a substantially larger portrait within its paper. Its complete text and keepsake controls fit taller phones; compact screens and landscape support internal reading scroll rather than compressing the words or cropping the photograph.

The phulkari uses an all-over bagh-inspired geometric stitch field, including the centre and every quadrant. A curved golden shuttle reveals the whole fabric over 4.8 seconds. Two cached canvas layers hold the cloth and embroidery, so each animated frame composites those layers with one light front and twelve tiny glints. The animation stops on completion, leaving the chapter, or hiding the page; reduced motion draws the finished cloth immediately. Blessings still stay only on the guest's device.

The finale adds fine moving gold orbits, restrained carved lotus petals, soft peripheral shader light and a written infinity flourish. These share the existing WebGL renderer and loop. Text has its own foreground stacking layers, separate from the portrait afterglow. Existing room transitions, sound, rhythm, sharing, complete-photo viewer, keepsakes and replay remain available.

## Controls

The portrait itself opens its full-image viewer; pointer movement gives its heirloom frame a subtle optical tilt. Typing a blessing previews its individual embroidery before the guest saves it.

Use next/back, the seven navigation dots, or the palace title to open the room map. Swipe the background horizontally on touch devices. Swipe a gallery photograph or use its thumbnails to change photographs. Arrow keys navigate; when the gallery controls or full-image viewer have focus, arrows browse photographs. Celebration tabs support arrows, Home and End. A/S/D/F play the dhol.

Sound starts after a guest gesture and has an explicit mute control. Rhythm playback is finite and stops on mute, room exit or page hiding. Native fullscreen is requested where supported; the responsive layout follows the visual viewport and safe areas. Browser chrome, device recording and home-screen support remain controlled by each browser.

Sharing opens a small card with a copyable canonical link, a Copy action, and native sharing where available. No blessing is sent when someone shares the invitation.

## Run, build and test

Use Node 20+ and Python 3:

```powershell
npm ci
npm run build
npm test
python -m http.server 4207 --bind 127.0.0.1 --directory dist
```

Open `http://127.0.0.1:4207/`. The checked-in root is also a complete static site. If npm is not on PATH but dependencies are installed, use `node scripts/build.cjs` and `node --test tests/beyond.test.mjs`.

The build bundles Three.js, hashes browser CSS/JS URLs and regenerates a clean, complete `dist/` directory. There are no runtime CDNs, trackers, analytics, remote forms or backend dependencies.

## Content and photograph integrity

The authorised creative details are **18–20 December 2026**, **the Singh & Kaur families**, at an **imagined Noor Mahal in Patiala**. They are concept invitation details, not a verified venue or booking.

| Celebration | India time | Imagined palace room |
| --- | --- | --- |
| Mehndi | Friday 18 December, 3 PM | The Marigold Court |
| Sangeet | Saturday 19 December, 7 PM | The Sheesh Mahal |
| Anand Karaj | Sunday 20 December, 10 AM | The Darbar Sahib |
| Reception | Sunday 20 December, 7:30 PM | The Palace Gardens |

Event instants, venues and attire are in `src/noor/story.mjs`. The opening, formal letter, sharing metadata, manifest and keepsakes also contain the concept names/date; update these together when changing the invitation.

The eight production portraits in `assets/beyond/portraits/` preserve the original dimensions and every decoded RGB pixel of the supplied PNGs. Their originals remain untouched in the local workspace. They have no face retouching, generative alterations, filters, clip paths or crop transformations. The fitted image box follows the source ratio. Smaller previews are used only for the thumbnail rail and loading/error fallbacks. Complete 840-pixel previews load promptly during the sealed opening and gallery selection; the lossless original upgrades the same frame in the background. Opening never waits for that large master. One adjacent small preview is prefetched as the gallery is explored; full-image views and keepsake exports use the lossless original.

Fraunces and DM Sans form the new optical-size-aware typography system, bundled as WOFF2 with their SIL licenses. Noto Serif Gurmukhi preserves the Punjabi dedication.

The palace plates are original generated environment artwork; they do not depict an actual booked venue. See [new artwork prompts and provenance](assets/beyond/ARTWORK-V4.md) and [foundation environments](assets/beyond/ARTWORK.md). The user-supplied score, *A Canopy of White Roses*, is carried forward from the foundation. Fonts and media are hosted with the invitation.

## Architecture and verification

- `beyond.html`: authored semantic template; the build writes the hashed `index.html`.
- `beyond-v4.css`: deliberate desktop, tablet, portrait, short-phone and landscape compositions.
- `src/beyond/main.mjs`: queued navigation, image loading, accessible dialogs, gallery, events, custom rhythm, private keepsakes, sharing and replay.
- `src/beyond/cinema.mjs`: physical colonnades, suspended cut-glass lanterns, light shafts, responsive dhol dais and the lotus sculpture, sharing the world renderer.
- `src/beyond/world.mjs`: Three.js doors, dhol, meadow, infinity/light sculpture, animated environment plates and architectural passages. Static geometry is batched by material while hinges, membranes and tassels remain independent.
- `src/beyond/layout.mjs`: source-ratio photo mat fitting.
- `src/beyond/phulkari.mjs`: seeded embroidery, stitch animation and PNG card.
- `src/beyond/story.mjs`: seven rooms and eight photographic narratives.
- `src/noor/sound.mjs` and `src/noor/story.mjs`: retained sound/calendar/storage foundations.
- `tests/beyond.test.mjs`: photograph layout, packaging, calendar/Unicode correctness, embroidery geometry, storage limits, geometry batching and the full GPU-free reduced-motion journey.

The renderer caps pixel ratio at 2. It suspends on page hiding, respects reduced motion and falls back to the photographed palace plus functional HTML when WebGL is unavailable or lost. Hidden rooms are inert; native dialogs manage modal focus. Blessings remain on the visitor's device, bounded to eight, with a visible clear action and an in-memory fallback when storage is denied.

For local diagnostics, `?profile=1` records 240 render samples per room in `#worldCanvas[data-profile]`. This measures CPU submission time in the current browser, not GPU time or physical-phone performance. The local workspace contains the responsive screenshots, source-pixel integrity checks, real-browser interactions and performance notes under `qa/beyond/`. Test evidence does not replace a final device check for a particular phone/browser or recording setup.

## Publish

GitHub Pages serves **`invitewonderland/armaan-meher-noor-mahal`**, branch **`codex/noor-mahal`**, root **`/`**. The ready-built runtime is checked in. Build and test before pushing that branch.

The local publication checkout is `publication/github-pages/`; it has its own Git remote. The original Project Infinity repository and its source history are retained separately. Do not push this invitation through the original Infinity remote. The earlier private Sites preview is separate from this GitHub deployment.

## Credits

Three.js is MIT licensed; see `THREE-LICENSE.txt`. Bodoni Moda and DM Sans include their SIL Open Font Licenses in `assets/beyond/fonts/`; Noto Serif Gurmukhi retains its license in `assets/noor/fonts/`. All brand and commission links lead to [Invite Wonderland on Instagram](https://www.instagram.com/invitewonderland).
