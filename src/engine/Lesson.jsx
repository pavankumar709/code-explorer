import { useEffect, useRef, useState } from "react";
import { SPEEDS, stateAt, useTimeline } from "./timeline.js";
import Stage from "./Stage.jsx";
import Sequence from "./Sequence.jsx";
import Inspector from "./Inspector.jsx";

export default function Lesson({ lesson, startStep, startView = "sim", onStep, group }) {
  const tl = useTimeline(lesson.steps, startStep);
  const [view, setView] = useState(startView);
  const [side, setSide] = useState("steps");
  const [art, setArt] = useState(() => { const q = new URLSearchParams(location.search).get("inspect"); return q && lesson.artifacts[q] ? q : null; });
  const [menu, setMenu] = useState(false);
  const root = useRef(null);
  const step = lesson.steps[tl.idx];
  const state = stateAt(lesson.steps, tl.idx);

  useEffect(() => { onStep(tl.idx, view); }, [tl.idx, view]);

  useEffect(() => {
    const k = (e) => {
      if (e.target.closest("input,textarea") || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === " ") { e.preventDefault(); tl.toggle(); }
      else if (e.key === "ArrowRight") tl.next();
      else if (e.key === "ArrowLeft") tl.prev();
      else if (e.key === "r" || e.key === "R") tl.restart();
      else if (e.key === "f" || e.key === "F") toggleFs();
      else if (e.key === "Escape") setArt(null);
      else if (e.key === "i" || e.key === "I") step.inspect && setArt(step.inspect[0]);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });

  const toggleFs = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else root.current && root.current.requestFullscreen && root.current.requestFullscreen();
  };
  const open = (id) => lesson.artifacts[id] && setArt(id);
  const outro = tl.done ? lesson.outro : null;

  return (
    <div className="lesson" data-tone={group.tone} ref={root}>
      <div className="lhead">
        <div>
          <div className="crumb"><span className="dot" />{group.name}</div>
          <h1>{lesson.title}</h1>
          <p className="intro">{lesson.intro}</p>
        </div>
        <div className="tabs" role="tablist">
          <button role="tab" aria-selected={view === "sim"} className={view === "sim" ? "on" : ""} onClick={() => setView("sim")}>Simulation</button>
          <button role="tab" aria-selected={view === "seq"} className={view === "seq" ? "on" : ""} onClick={() => setView("seq")}>Sequence</button>
        </div>
      </div>

      <div className="work">
        <div className="main">
          <div className="canvas">
            {view === "sim"
              ? <Stage lesson={lesson} state={state} step={step} idx={tl.idx} speed={tl.speed} onInspect={open} />
              : <Sequence lesson={lesson} idx={tl.idx} go={tl.go} />}
          </div>

          <div className="ctl">
            <button onClick={tl.restart} title="Restart (R)" aria-label="Restart">⏮</button>
            <button onClick={tl.prev} disabled={tl.idx === 0} title="Previous step (←)" aria-label="Previous step">◀</button>
            <button className="play" onClick={tl.toggle} title="Play / pause (Space)">
              {tl.done ? "↻ Replay" : tl.playing ? "❚❚ Pause" : "▶ Play"}
            </button>
            <button onClick={tl.next} disabled={tl.idx === lesson.steps.length - 1} title="Next step (→)" aria-label="Next step">▶</button>
            <div className="segs" role="group" aria-label="Steps">
              {lesson.steps.map((s, n) => (
                <button key={n} className={"seg" + (n < tl.idx ? " done" : n === tl.idx ? " cur" : "")} onClick={() => tl.go(n)} aria-label={`Step ${n + 1}: ${s.title}`}>
                  <i style={{ width: n < tl.idx ? "100%" : n === tl.idx ? tl.p * 100 + "%" : 0 }} />
                </button>
              ))}
            </div>
            <div className="menuwrap">
              <button onClick={() => setMenu(!menu)} aria-haspopup="menu" aria-expanded={menu}>{tl.speed}×</button>
              {menu && (
                <div className="menu" role="menu">
                  {SPEEDS.map((v) => <button key={v} role="menuitemradio" aria-checked={tl.speed === v} className={v === tl.speed ? "on" : ""} onClick={() => { tl.setSpeed(v); setMenu(false); }}>{v}×</button>)}
                </div>
              )}
            </div>
            <button onClick={toggleFs} title="Fullscreen (F)" aria-label="Fullscreen">⛶</button>
          </div>

          <div className="now" key={tl.idx}>
            <div className="nowtop"><span className="badge">STEP {tl.idx + 1} / {lesson.steps.length}</span></div>
            <h2>{step.title}</h2>
            <p>{step.text}</p>
            {step.inspect && (
              <div className="insp">
                {step.inspect.map((id) => <button key={id} onClick={() => open(id)}>🔍 Inspect: {lesson.artifacts[id].title}</button>)}
              </div>
            )}
          </div>

          {outro && (
            <div className="outro">
              <small>SUMMARY</small>
              <h3>{outro.title}</h3>
              <p>{outro.text}</p>
              <button onClick={tl.restart}>↻ Replay</button>
            </div>
          )}
        </div>

        <aside className="side2">
          <div className="stabs">
            <button className={side === "steps" ? "on" : ""} onClick={() => setSide("steps")}>Steps</button>
            <button className={side === "facts" ? "on" : ""} onClick={() => setSide("facts")}>Facts</button>
          </div>
          {side === "steps" ? (
            <ol className="steps">
              {lesson.steps.map((s, n) => (
                <li key={n}>
                  <button className={n === tl.idx ? "on" : n < tl.idx ? "past" : ""} onClick={() => tl.go(n)}>
                    <span className="num">{n + 1}</span><span>{s.title}</span>
                  </button>
                </li>
              ))}
            </ol>
          ) : (
            <dl className="facts">
              {lesson.facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            </dl>
          )}
        </aside>
      </div>

      {art && <Inspector art={lesson.artifacts[art]} onClose={() => setArt(null)} />}
    </div>
  );
}
