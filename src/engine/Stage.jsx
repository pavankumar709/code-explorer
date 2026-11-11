import { useLayoutEffect, useRef, useState } from "react";
import { TYPES } from "./widgets.jsx";

function Fly({ fly, idx, rootRef, dur }) {
  const [pos, setPos] = useState(null);
  useLayoutEffect(() => {
    if (!fly || !rootRef.current) { setPos(null); return; }
    const root = rootRef.current, r = root.getBoundingClientRect();
    const a = root.querySelector(`[data-w="${fly.from}"]`), b = root.querySelector(`[data-w="${fly.to}"]`);
    if (!a || !b) { setPos(null); return; }
    const c = (el) => { const q = el.getBoundingClientRect(); return { x: q.left + q.width / 2 - r.left, y: q.top + q.height / 2 - r.top }; };
    setPos({ from: c(a), to: c(b), go: false });
    let id2;
    const id = requestAnimationFrame(() => { id2 = requestAnimationFrame(() => setPos((p) => p && { ...p, go: true })); });
    return () => { cancelAnimationFrame(id); cancelAnimationFrame(id2); };
  }, [idx]);
  if (!pos || !fly) return null;
  const p = pos.go ? pos.to : pos.from;
  return (
    <div className={"fly" + (fly.tone ? " tone-" + fly.tone : "")}
      style={{ transform: `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`, transitionDuration: dur + "ms" }}>
      {fly.label}
    </div>
  );
}

export default function Stage({ lesson, state, step, idx, speed, onInspect }) {
  const rootRef = useRef(null);
  const dur = Math.max(250, ((step.ms || 3800) * 0.35) / speed);
  return (
    <div className="stage" ref={rootRef}>
      {lesson.stage.map((row, r) => (
        <div className="srow" key={r}>
          {row.map((id) => {
            const def = { ...lesson.widgets[id], id };
            const W = TYPES[def.type];
            return <div className="scell" style={{ flex: def.flex || 1 }} key={id}><W def={def} s={state[id] || {}} onInspect={onInspect} /></div>;
          })}
        </div>
      ))}
      <Fly fly={step.fly} idx={idx} rootRef={rootRef} dur={dur} />
    </div>
  );
}
