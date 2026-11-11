import { useEffect, useMemo, useRef, useState } from "react";
import { groups, lessons, byId } from "./lessons/index.js";
import Lesson from "./engine/Lesson.jsx";

const parse = () => {
  const [, id, st, v] = location.hash.split("/");
  return { id: byId[id] ? id : lessons[0].id, step: Math.max(0, (parseInt(st, 10) || 1) - 1), view: v === "seq" ? "seq" : "sim" };
};

function Palette({ onPick, onClose }) {
  const [q, setQ] = useState(""), [sel, setSel] = useState(0);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return lessons.filter((l) => !s || (l.title + " " + l.blurb + " " + l.group).toLowerCase().includes(s));
  }, [q]);
  const ref = useRef(); useEffect(() => ref.current && ref.current.focus(), []);
  return (
    <div className="scrim" onMouseDown={onClose}>
      <div className="palette" role="dialog" aria-label="Search lessons" onMouseDown={(e) => e.stopPropagation()}>
        <input ref={ref} value={q} placeholder="Search lessons…  (try: event loop, rust, object)" onChange={(e) => { setQ(e.target.value); setSel(0); }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(list.length - 1, s + 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
            if (e.key === "Enter" && list[sel]) onPick(list[sel].id);
            if (e.key === "Escape") onClose();
          }} />
        <div className="plist">
          {list.length === 0 && <div className="empty">No lesson matches.</div>}
          {list.map((l, n) => (
            <button key={l.id} className={n === sel ? "on" : ""} onMouseEnter={() => setSel(n)} onClick={() => onPick(l.id)}>
              <b>{l.title}</b><small>{l.group} · {l.blurb}</small>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Keys({ onClose }) {
  const rows = [["Space", "Play / pause"], ["← →", "Previous / next step"], ["R", "Restart the lesson"], ["F", "Fullscreen"], ["I", "Inspect the current artifact"], ["Ctrl + K", "Search lessons"], ["T", "Light / dark"], ["?", "This list"], ["Esc", "Close"]];
  return (
    <div className="scrim" onMouseDown={onClose}>
      <div className="dialog" role="dialog" aria-label="Keyboard shortcuts" onMouseDown={(e) => e.stopPropagation()}>
        <h3>Keyboard shortcuts</h3>
        <dl>{rows.map(([k, v]) => <div key={k}><dt><kbd>{k}</kbd></dt><dd>{v}</dd></div>)}</dl>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState(parse);
  const [drawer, setDrawer] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [theme, setTheme] = useState(() => { const q = new URLSearchParams(location.search).get("theme"); if (q === "light" || q === "dark") return q; try { return localStorage.getItem("ce:theme") || ""; } catch { return ""; } });
  const lesson = byId[route.id];
  const group = groups.find((g) => g.ids.includes(route.id));
  const stepRef = useRef(route.step); stepRef.current = route.step;

  useEffect(() => {
    const on = () => setRoute(parse());
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  useEffect(() => {
    if (theme) document.documentElement.dataset.theme = theme; else delete document.documentElement.dataset.theme;
    try { theme ? localStorage.setItem("ce:theme", theme) : localStorage.removeItem("ce:theme"); } catch {}
  }, [theme]);
  useEffect(() => { document.title = lesson.title + " · Code Explorer"; }, [lesson]);
  useEffect(() => {
    const k = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setDialog("search"); return; }
      if (e.target.closest("input,textarea") || e.ctrlKey || e.metaKey) return;
      if (e.key === "?") setDialog("keys");
      if (e.key === "Escape") setDialog(null);
      if (e.key === "t" || e.key === "T") setTheme((t) => (t === "dark" ? "light" : "dark"));
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  const pick = (id) => { location.hash = `#/${id}/1`; setDrawer(false); setDialog(null); };
  const onStep = (i, view) => history.replaceState(null, "", `#/${route.id}/${i + 1}${view === "seq" ? "/seq" : ""}`);

  return (
    <div className="shell">
      <header className="top">
        <button className="ibtn menubtn" onClick={() => setDrawer(!drawer)} aria-label="Lessons">☰</button>
        <a className="brand" href="#/" onClick={(e) => { e.preventDefault(); pick(lessons[0].id); }}><span className="logo">▣</span> Code Explorer</a>
        <span className="tag">Learn how code really runs</span>
        <div className="grow" />
        <button className="search" onClick={() => setDialog("search")}>⌕ <span>Search lessons</span> <kbd>Ctrl K</kbd></button>
        <button className="ibtn" onClick={() => setDialog("keys")} aria-label="Keyboard shortcuts" title="Keyboard shortcuts (?)">⌨</button>
        <button className="ibtn" onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} aria-label="Toggle light and dark" title="Light / dark (T)">◐</button>
      </header>
      <div className="body">
        <nav className={"nav" + (drawer ? " open" : "")} aria-label="Lessons">
          {groups.map((g) => (
            <div key={g.name} data-tone={g.tone}>
              <h4><span className="dot" />{g.name}</h4>
              {g.ids.map((id) => (
                <button key={id} className={id === route.id ? "on" : ""} onClick={() => pick(id)}>
                  <b>{byId[id].title}</b><small>{byId[id].blurb}</small>
                </button>
              ))}
            </div>
          ))}
        </nav>
        {drawer && <div className="dscrim" onClick={() => setDrawer(false)} />}
        <main className="content">
          <Lesson key={route.id} lesson={lesson} group={group} startStep={route.step} startView={route.view} onStep={onStep} />
        </main>
      </div>
      {dialog === "search" && <Palette onPick={pick} onClose={() => setDialog(null)} />}
      {dialog === "keys" && <Keys onClose={() => setDialog(null)} />}
    </div>
  );
}
