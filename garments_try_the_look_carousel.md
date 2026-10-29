# Plan: "Try the Look" carousel for the garments section
Site: zabulanakakil.github.io/dreamers-den-event-management, page services.html, garments panel
Reference: https://www.facebook.com/share/r/1FCXFpQijS/ (site shown: mojibrand.io, creator unknown). Written 2026-10-29.

## What the reference does
- Two columns: about 68% for the carousel on the left and about 32% for an "In this look" sidebar.
- Cutout models (transparent PNGs) on a plain background, with no cards. Five are visible: the centre one plus two on each side.
- Depth comes from flat 2D effects, not 3D tilt. Centre: full size, sharp, fully visible. Next one out: about 78% size, about 55% visible, a little blur. Outer: about 55% size, about 25% visible, heavy blur.
- Dragging moves the carousel with your finger or mouse, then it springs to the nearest item. The sidebar updates when an item reaches the centre.
- When you hover the centre item, the cursor becomes a black circle that says "VIEW".
- A thin line with small tick marks at the bottom shows your place, instead of dots.
- The sidebar shows a "1/10" counter and an item list with a thumbnail, name, size and price, plus a fixed "Complete the look" block at the bottom with a button.

## How it maps to your site
- Show the tracksuits first: 36 looks from `GARMENTS_DATA.tracksuits` (each one already has a name, a note and colours). Gift combos (45) can reuse the same component later.
- The "In this look" sidebar would list jacket, trousers, colours, the print/pattern and the note. Swap "Add to bag" for "Request a quote" (your existing contact or quote link), because the site doesn't sell online.
- Keep your dark theme (`#0a0a0a`) and the amber/teal garments accents. The VIEW cursor becomes an amber circle (`--color-garments`). Fonts stay Outfit and Source Sans 3.

## Build steps (plain JS/CSS, no new library)
1. **Images.** The tracksuit photos are flat-lay JPGs (`tracksuits/01-navy-horizon.jpg` and so on). For the cutout look, make transparent PNG or WebP versions (background removed, 800px tall, under 150KB) in `assets/images/garments/tracksuits/cutouts/`. Until those exist, use the JPGs with rounded corners and a soft shadow.
2. **Markup.** In `js/main.js` `renderGarmentsCatalogue()`, replace or add above `#tracksuit-studio` a new `section#try-the-look` containing `.ttl-stage` (a track of `figure.ttl-item` elements), `.ttl-scrubber` (the tick line) and `aside.ttl-panel`.
3. **Motion.** Keep one float, `position`, and use pointer events (pointerdown, move, up) to follow the drag 1:1. On release, keep the drag speed, ease it to the nearest whole number over about 450ms, and update in `requestAnimationFrame`. For each item, take `d = i - position` (wrapping round for an endless loop) and apply `transform: translateX(d*28%) scale(1-0.22*|d|)`, `opacity: 1-0.4*|d|`, `filter: blur(|d|*4px)`, and a z-index based on `|d|`. Hide items with `|d| > 2.5`.
4. **Controls.** Arrow keys and clicking a side item move the carousel. The scrubber ticks are clickable. Add `aria-roledescription="carousel"` and announce changes with `aria-live` in the panel.
5. **Cursor.** Use a `div.ttl-cursor` that is shown only on a fine pointer over the centre item and follows the mouse via transform. Clicking opens your existing tracksuit-studio swatch view for that look.
6. **Mobile (my addition, not shown in the reel).** Stack the layout so the stage sits on top and the panel below it. Show three items (centre and ±1). Swipe works through the same pointer code. No custom cursor.
7. **Performance and accessibility.** Animate only transform and opacity. Blur is expensive, so limit it to the visible items and drop it under `prefers-reduced-motion`. Load images outside the centre ±2 lazily. Keep alt text from the look names.
8. **CSS.** Put the new `.ttl-*` styles in `css/pages.css` next to `.journey-carousel` (around line 1650) and reuse the existing variables.
9. **Test.** Check Chrome, Firefox and Android Chrome, light and dark themes, deep links such as `#tracksuit-studio`, and that the existing combo viewer still works.

## Open choices
- Whether to replace the current tracksuit studio or sit above it. I suggest above, with "VIEW" opening the studio.
- Whether you want cutout PNGs made or prefer to keep the flat-lay photos.
- The figures for size, opacity, blur and timing are my estimates from the video, not measured values.

## Decisions from Capt Tanvir (2026-10-29 09:14), which override the above
- **Images:** use only the current garment photos (`tracksuits/*.jpg`, `souvenirs/items/*.jpg`). No cutouts, so step 1 is dropped. Each photo sits in a rounded frame with a soft shadow, and the depth effect (size, fade, blur) is applied to the frames.
- **Carousel scope:** one shared component, `initLookCarousel(el, items, renderPanel)`, used twice:
  1. Tracksuits (36). The panel shows the name, note, colours and a "Request a quote" button.
  2. Individual souvenirs (16), replacing the current `.souvenir-grid` view. The panel shows the name, details and a "Request a quote" button. Souvenir filters (if kept) re-feed the carousel's items.
- **Gift combos:** no change. `#gift-combos` stays exactly as it is.
- **PC "View all":** each carousel gets a "View all (36)" or "View all (16)" button. On desktop it opens a full-width grid of every item as a large overlay with a close button and Esc to close. Clicking any item closes the grid and jumps the carousel to it. This replaces scrolling through the long list. On mobile the same button opens a scrollable grid sheet.
- **Order:** build the shared component and the tracksuits first, then the souvenirs, then View all, then the tests.
