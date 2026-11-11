// The same lesson as a sequence diagram: who handed what to whom, step by step.
export default function Sequence({ lesson, idx, go }) {
  const flies = lesson.steps.map((s) => s.fly).filter(Boolean);
  const ids = [];
  flies.forEach((f) => { [f.from, f.to].forEach((x) => ids.includes(x) || ids.push(x)); });
  const colW = Math.min(190, 860 / Math.max(1, ids.length)), padX = 80, rowH = 58, top = 56;
  const W = padX * 2 + colW * (ids.length - 1) + 1, H = top + lesson.steps.length * rowH + 20;
  const x = (id) => padX + ids.indexOf(id) * colW;
  return (
    <div className="seq">
      <svg viewBox={`0 0 ${Math.max(W, 520)} ${H}`} width="100%" role="img" aria-label="Sequence diagram">
        {ids.map((id) => (
          <g key={id}>
            <text x={x(id)} y={26} textAnchor="middle" className="sq-actor">{lesson.widgets[id].short || lesson.widgets[id].title}</text>
            <line x1={x(id)} x2={x(id)} y1={38} y2={H - 8} className="sq-life" />
          </g>
        ))}
        {lesson.steps.map((s, n) => {
          const y = top + n * rowH + 22, cls = n === idx ? "now" : n < idx ? "past" : "future";
          const f = s.fly;
          return (
            <g key={n} className={"sq-row " + cls} onClick={() => go(n)}>
              <rect x={0} y={y - 26} width={Math.max(W, 520)} height={rowH} className="sq-hit" />
              <circle cx={14} cy={y} r={11} className="sq-num" /><text x={14} y={y + 4} textAnchor="middle" className="sq-n">{n + 1}</text>
              {f && f.from !== f.to ? (
                <>
                  <line x1={x(f.from)} x2={x(f.to)} y1={y} y2={y} className="sq-arrow" />
                  <polygon className="sq-head" points={`${x(f.to)},${y} ${x(f.to) + (x(f.to) > x(f.from) ? -9 : 9)},${y - 5} ${x(f.to) + (x(f.to) > x(f.from) ? -9 : 9)},${y + 5}`} />
                  <text x={(x(f.from) + x(f.to)) / 2} y={y - 8} textAnchor="middle" className="sq-label">{f.label}</text>
                </>
              ) : (
                <text x={f ? x(f.from) : 40} y={y - 8} className="sq-note" textAnchor={f ? "middle" : "start"}>{s.title}</text>
              )}
              <text x={Math.max(W, 520) - 6} y={y + 18} textAnchor="end" className="sq-step">{s.title}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
