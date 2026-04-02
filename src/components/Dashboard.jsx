import React from 'react'

const AREA_COLORS = { MGM: '#f06a35', Acquisition: '#37b24d', Retention: '#228be6', Recovery: '#f03e3e', General: '#7950f2' }

export default function Dashboard({ cards }) {
  const total = cards.length
  const todo = cards.filter(c => c.status === 'todo').length
  const inp = cards.filter(c => c.status === 'inprogress').length
  const done = cards.filter(c => c.status === 'done').length
  const blocked = cards.filter(c => c.status === 'blocked').length
  const high = cards.filter(c => c.priority === 'high').length
  const pct = total ? Math.round(done / total * 100) : 0

  const areas = ['MGM', 'Acquisition', 'Retention', 'Recovery', 'General']

  const r = 52, cx = 64, cy = 64, circum = 2 * Math.PI * r
  const segs = [
    { val: todo, color: '#b3b8c4', label: 'A Fazer' },
    { val: inp, color: '#228be6', label: 'Em Andamento' },
    { val: done, color: '#37b24d', label: 'Concluído' },
    { val: blocked, color: '#f03e3e', label: 'Bloqueado' },
  ]
  let offset = 0
  const paths = segs.map((s, i) => {
    if (!total || !s.val) return null
    const arc = circum * (s.val / total)
    const el = <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth={18} strokeDasharray={`${arc} ${circum - arc}`} strokeDashoffset={-offset} transform={`rotate(-90 ${cx} ${cy})`} />
    offset += arc
    return el
  })

  const panel = { background: '#fff', borderRadius: 10, padding: 20, border: '1.5px solid #e2e5ea' }
  const h3 = { fontSize: 13, fontWeight: 700, color: '#6b6e7a', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 16 }

  return (
    <div style={{ padding: '24px 28px', overflowY: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, marginBottom: 24 }}>
        {[['Total', total, '#1e1f21'], ['Em Andamento', inp, '#228be6'], ['Concluídas', done, '#37b24d'], ['Alta Prioridade', high, '#c92a2a']].map(([label, val, color]) => (
          <div key={label} style={panel}>
            <div style={{ fontSize: 32, fontWeight: 800, color, lineHeight: 1 }}>{val}</div>
            <div style={{ fontSize: 13, color: '#6b6e7a', marginTop: 6 }}>{label}</div>
            {label === 'Concluídas' && <div style={{ fontSize: 11, marginTop: 4, fontWeight: 600, color: '#37b24d' }}>{pct}% completo</div>}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={panel}>
          <h3 style={h3}>Status das tarefas</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
            <svg width={128} height={128} viewBox="0 0 128 128">
              {paths}
              <text x={64} y={69} textAnchor="middle" fontSize={18} fontWeight={800} fill="#1e1f21">{pct}%</text>
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {segs.map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#6b6e7a' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
                  {s.label} ({s.val})
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={panel}>
          <h3 style={h3}>Tarefas por área</h3>
          {areas.map(a => {
            const n = cards.filter(c => c.area === a).length
            const w = total ? Math.round(n / total * 100) : 0
            return (
              <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: '#1e1f21', minWidth: 100, fontWeight: 500 }}>{a}</span>
                <div style={{ flex: 1, height: 8, background: '#eee', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 99, width: `${w}%`, background: AREA_COLORS[a] }} />
                </div>
                <span style={{ fontSize: 12, color: '#6b6e7a', minWidth: 28, textAlign: 'right', fontWeight: 600 }}>{n}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
