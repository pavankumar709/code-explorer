# Code Explorer

An interactive, animated explainer for how code really runs: interpreters, compilers, where the binary goes,
objects in memory, the browser and Node.js event loops, Rust ownership, and how other languages compare.
Structure inspired by Protocol Explorer; all content and code are original.

```
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## How it works
- `src/engine/` runs any lesson: timeline, stage, sequence view, inspector.
- `src/lessons/*.js` is one file per lesson. A lesson is plain data: widgets, steps, artifacts.
- Artifacts (bytecode, machine code, compiler errors) are real output from node, python3, rustc, gcc, javap and go.

## Deep links
`#/<lesson>/<step>` and `#/<lesson>/<step>/seq` for the sequence view. Add `?theme=light|dark` or `?inspect=<artifact>`.

## Shortcuts
Space play/pause · ← → step · R restart · F fullscreen · I inspect · T theme · Ctrl+K search · ? help
