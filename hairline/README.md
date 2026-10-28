# Voice console · Hairline

An isometric five-channel mixer. Picking a channel raises its fader and moves its neighbours less, staggered by distance. Leaving returns to the uneven rest pose.

- Engine: unchanged Hairline kernel and bench, assembled with the `hairline-create` skill.
- Rules: fixed hit areas, distance stagger, one stroke highlight, composed rest, discrete easing, rounded solids.
- Tour: right channel → middle channel → left channel → rest.
- Interactive file: `hairline-voice-console.html`; open with `?play=1` to play the tour.
- GitHub assets: `../assets/voice-console-{light,dark}.gif`. The README uses these because GitHub does not execute page JavaScript.

The static validator passes. The generated light and dark image sequences were visually inspected. The interactive figure was **not looked at in a browser**: Chrome could not launch in the available environment. Browser console checks, pointer interaction, reduced-motion behaviour and the live tour remain unverified.

`export-voice-console.cjs` renders the actual figure with Hairline geometry and easing in a minimal offline DOM; it does not alter the engine or bench. Its local paths refer to the installed skill and cached Sharp package. The exported SVGs are static rest snapshots.

## Additional portfolio studies

`documents.js` and `server-kit.js` reuse the existing figures from the local portfolio's `scripts/hairline/` directory. The MIT license for Hairline is preserved in `LICENSE`.

- Documents: rear document → middle → front → rest. Rules 1, 2, 4, 5, 8, 9.
- Server kit: registry → configuration → runtime → rest. Rules 1, 3, 4, 5, 7, 9.
- Both standalone pages pass the unchanged Hairline validator. Exported image sequences were inspected in light and dark at 240px wide. Rest poses, staged responses, highlights, and returns to rest were checked. Live browser interaction remains unverified.
- The README cards use looping GIFs and static SVG snapshots for reduced-motion preferences. Case-study links match the portfolio's local `work/[slug]` routes; live availability was not verified.

Re-export from the repository root:

```sh
node hairline/export-figure.cjs documents
node hairline/export-figure.cjs server-kit
python3 scripts/assemble-hairline.py
```

The exporter requires the installed Hairline skill and Sharp. Set `SHARP_PATH` to an alternative installed Sharp package if needed. Frame folders are temporary export output; the GIFs and SVGs under `assets/` are the README artifacts.
