# Ylyas Nurmuhammedov — Portfolio (v2)

Warm, friendly, multi-page portfolio. No build step, no heavy libraries —
native scroll, light CSS animations, IntersectionObserver reveals.

## Run it

```
python -m http.server 8741
```

Then open http://localhost:8741. (Or use the `portfolio` config in `.claude/launch.json`.)

## Pages

- `index.html` — home: hero with photo, featured work, vision teaser, CCNA badges, contact
- `work.html` — all three case studies at a glance
- `smarttax.html` — Case study 01: SmartTaxApp (blue theme)
- `campus.html` — Case study 02: Swinburne Campus App (violet theme)
- `semangoh.html` — Case study 03: Semangoh Park Guard (green theme)
- `about.html` — bio, "The Leap of Faith" personal story (#story), AI-infrastructure mission statement (#vision), skills, experience, certifications

## Shared

- `css/style.css` — design tokens + all components (each case study has an accent color)
- `js/site.js` — mobile nav, active-link highlight, reveal-on-scroll (~40 lines)
- `assets/` — photo, resume.pdf, 3 CCNA badge images
- Stack icons load from cdn.simpleicons.org (LinkedIn is inline SVG — Simple Icons dropped it)

## Conventions

- No arrow glyphs (→ ← ↗) anywhere — user preference; links use underlines/color instead
- No dots/nubs decorating headings, no marquee pill strips
- Photo crops use `object-position: 50% 62%` so face sits in the upper third
- Links: github.com/Ylyass · linkedin.com/in/ylyasnurmuhammedov
- CSS/JS links carry `?v=N` cache-busting — bump N when editing style.css or site.js
- All remote icon `<img>` tags carry explicit width/height (cache-proof sizing)
- Landing page extras: AI robot sidekick (eyes track cursor, typed speech bubble),
  rotating aurora background (pre-blurred gradients — never use `filter: blur` on
  large animated layers, it hangs the renderer), gradient scroll progress bar
