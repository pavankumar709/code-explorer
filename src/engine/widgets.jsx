// The building blocks a lesson stage is made of. Each one only draws what it is told.
const tone = (t) => (t ? " tone-" + t : "");

export const Box = ({ id, title, badge, className = "", children }) => (
  <div className={"w " + className} data-w={id}>
    <div className="wh"><span>{title}</span>{badge ? <em>{badge}</em> : null}</div>
    <div className="wb">{children}</div>
  </div>
);

function Code({ def, s }) {
  const hl = s.hl == null ? [] : Array.isArray(s.hl) ? s.hl : [s.hl];
  const lines = s.lines || def.lines;
  return (
    <Box id={def.id} title={def.title} badge={s.badge}>
      <pre className="code">
        {lines.map((l, n) => (
          <div key={n} className={"cl" + (hl.includes(n) ? " on" : "") + (s.bad === n ? " bad" : "")}>
            <span className="ln">{n + 1}</span><span>{l || " "}</span>
          </div>
        ))}
      </pre>
      {s.note ? <div className="wnote">{s.note}</div> : null}
    </Box>
  );
}

function Pipeline({ def, s, onInspect }) {
  const at = s.at ?? -1;
  return (
    <Box id={def.id} title={def.title}>
      <div className="pipe">
        {def.stages.map((st, n) => {
          const state = n < at ? "done" : n === at ? "active" : "todo";
          const click = st.artifact && n <= at;
          return (
            <div className="pstage" key={n}>
              {n > 0 && <span className={"parr " + (n <= at ? "on" : "")}>→</span>}
              <button className={"pbox " + state} disabled={!click} onClick={() => click && onInspect(st.artifact)}
                title={click ? "Click to look inside" : ""}>
                <b>{st.name}</b>
                {st.sub ? <small>{st.sub}</small> : null}
                {click ? <i>inspect</i> : null}
              </button>
            </div>
          );
        })}
      </div>
      {s.label ? <div className="wnote">{s.label}</div> : null}
    </Box>
  );
}

function List({ def, s }) {
  const items = s.items || [];
  return (
    <Box id={def.id} title={def.title} badge={s.badge} className={"list-" + (def.layout || "rows")}>
      <div className={"items " + (def.layout || "rows")}>
        {items.length === 0 && <div className="empty">empty</div>}
        {items.map((it, n) => {
          const o = typeof it === "string" ? { t: it } : it;
          return (
            <div key={o.t + ":" + n} className={"item" + tone(o.tone) + (s.hl === n ? " hl" : "")}>
              <span>{o.t}</span>{o.sub ? <small>{o.sub}</small> : null}
            </div>
          );
        })}
      </div>
    </Box>
  );
}

function Ring({ def, s }) {
  const N = def.phases.length, R = 104, cx = 150, cy = 124;
  return (
    <Box id={def.id} title={def.title} badge={s.badge}>
      <div className="ring" style={{ height: 250 }}>
        <svg viewBox="0 0 300 250" className="ringsvg"><circle cx={cx} cy={cy} r={R} /></svg>
        <div className="ringc">{s.center || "loop"}</div>
        {def.phases.map((ph, n) => {
          const a = (n / N) * Math.PI * 2 - Math.PI / 2;
          return (
            <div key={n} className={"rph" + (s.at === n ? " on" : "")}
              style={{ left: ((cx + R * Math.cos(a)) / 300) * 100 + "%", top: ((cy + R * Math.sin(a)) / 250) * 100 + "%" }}>
              {ph}
            </div>
          );
        })}
      </div>
    </Box>
  );
}

function Bytes({ def, s }) {
  const rows = s.rows || def.rows || [];
  return (
    <Box id={def.id} title={def.title} badge={s.badge}>
      <table className="bytes"><tbody>
        {rows.map((r, n) => (
          <tr key={n} className={(s.hl === n ? "on " : "") + (r.tone ? "tone-" + r.tone : "")}>
            <td className="ba">{r.a}</td><td className="bb">{r.b}</td><td className="bt">{r.t}</td>
          </tr>
        ))}
      </tbody></table>
      {s.note ? <div className="wnote">{s.note}</div> : null}
    </Box>
  );
}

function Out({ def, s }) {
  const lines = s.lines || [];
  return (
    <Box id={def.id} title={def.title}>
      <div className="out">
        {lines.length === 0 && <span className="empty">nothing printed yet</span>}
        {lines.map((l, n) => <div key={n}><span className="pr">&gt;</span> {l}</div>)}
      </div>
    </Box>
  );
}

function Objects({ def, s }) {
  const objs = s.objs || [];
  return (
    <Box id={def.id} title={def.title} badge={s.badge}>
      <div className="objs">
        {objs.length === 0 && <div className="empty">nothing here</div>}
        {objs.map((o) => (
          <div key={o.id} className={"obj" + tone(o.tone)}>
            <div className="oh"><b>{o.id}</b> <span>{o.title}</span></div>
            {(o.fields || []).map(([k, v], n) => <div key={n} className="of"><span>{k}</span><span>{v}</span></div>)}
          </div>
        ))}
      </div>
    </Box>
  );
}

function Lanes({ def, s }) {
  const lanes = s.lanes || [];
  return (
    <Box id={def.id} title={def.title} badge={s.badge}>
      <div className="lanes">
        {lanes.map((ln, n) => (
          <div className="lane" key={n}>
            <div className="lname">{ln.name}</div>
            <div className="lblocks">
              {(ln.blocks || []).length === 0 && <span className="empty">idle</span>}
              {(ln.blocks || []).map((b, i) => <div key={b.t + i} className={"blk" + tone(b.tone)}>{b.t}</div>)}
            </div>
          </div>
        ))}
      </div>
    </Box>
  );
}

export const TYPES = { code: Code, pipeline: Pipeline, list: List, ring: Ring, bytes: Bytes, out: Out, objects: Objects, lanes: Lanes };
