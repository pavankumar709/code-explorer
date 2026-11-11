import { useCallback, useEffect, useRef, useState } from "react";

export const SPEEDS = [0.5, 1, 1.5, 2];
const DEFAULT_MS = 3800;

// Plays a list of steps. Each step lasts `ms` (default 3800) at speed 1.
export function useTimeline(steps, startIdx = 0) {
  const last = steps.length - 1;
  const [s, setS] = useState({ idx: Math.min(startIdx, last), p: 0 });
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeedState] = useState(() => {
    try { const v = Number(localStorage.getItem("ce:speed")); return SPEEDS.includes(v) ? v : 1; } catch { return 1; }
  });
  const spd = useRef(speed); spd.current = speed;
  const stepsRef = useRef(steps); stepsRef.current = steps;
  const done = s.idx === last && s.p >= 1;

  useEffect(() => {
    if (!playing) return;
    let prev = performance.now();
    const id = setInterval(() => {
      const now = performance.now(); const dt = now - prev; prev = now;
      setS((c) => {
        const dur = stepsRef.current[c.idx].ms || DEFAULT_MS;
        const p = c.p + (dt * spd.current) / dur;
        if (p < 1) return { idx: c.idx, p };
        if (c.idx < last) return { idx: c.idx + 1, p: 0 };
        return { idx: c.idx, p: 1 };
      });
    }, 40);
    return () => clearInterval(id);
  }, [playing, last]);

  useEffect(() => { if (done) setPlaying(false); }, [done]);

  const go = useCallback((i) => { setS({ idx: Math.max(0, Math.min(last, i)), p: 0 }); setPlaying(true); }, [last]);
  const setSpeed = (v) => { setSpeedState(v); try { localStorage.setItem("ce:speed", v); } catch {} };
  return {
    idx: s.idx, p: s.p, playing, done, speed, setSpeed, go,
    next: () => go(s.idx + 1), prev: () => go(s.idx - 1),
    restart: () => go(0),
    toggle: () => (done ? go(0) : setPlaying((x) => !x)),
    pause: () => setPlaying(false),
  };
}

// Folds each step's widget props onto the previous ones (later wins, per widget).
export function stateAt(steps, idx) {
  const out = {};
  for (let i = 0; i <= idx; i++) {
    const w = steps[i].w || {};
    for (const k of Object.keys(w)) out[k] = { ...(out[k] || {}), ...w[k] };
  }
  return out;
}
