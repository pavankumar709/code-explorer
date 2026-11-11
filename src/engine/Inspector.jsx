import { useState } from "react";

// Click a thing and see what it is made of, with the matching raw lines lit up.
export default function Inspector({ art, onClose }) {
  const [sel, setSel] = useState(0);
  const lines = art.raw.text.split("\n");
  const lit = (art.fields[sel] && art.fields[sel][3]) || [];
  return (
    <div className="inspector" role="dialog" aria-label={"Inspector: " + art.title}>
      <div className="ih">
        <div><small>INSPECTOR</small><h3>{art.title}</h3></div>
        <button onClick={onClose} aria-label="Close">✕</button>
      </div>
      <p className="idesc">{art.desc}</p>
      <div className="icols">
        <table className="ifields"><tbody>
          {art.fields.map(([k, v, note], n) => (
            <tr key={n} className={n === sel ? "on" : ""} onClick={() => setSel(n)}>
              <td className="ik">{k}</td><td className="iv">{v}</td>
              <td className="in">{note}</td>
            </tr>
          ))}
        </tbody></table>
        <div className="iraw">
          <div className="irl">{art.raw.label}</div>
          <pre>{lines.map((l, n) => <div key={n} className={lit.includes(n) ? "hl" : ""}>{l || " "}</div>)}</pre>
        </div>
      </div>
      {art.real ? <div className="ireal">Real output from: <code>{art.real}</code></div> : null}
    </div>
  );
}
