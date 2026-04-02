import React from 'react'

const BADGE = { MGM: 'b-MGM', Acquisition: 'b-Acq', Retention: 'b-Ret', Recovery: 'b-Rec', General: 'b-Gen' }
const PP = { high: ['pp-high', 'Alta'], medium: ['pp-medium', 'Média'], low: ['pp-low', 'Baixa'] }

export default function Card({ card: c, onEdit, onDragStart }) {
  const [cls, label] = PP[c.priority] || PP.medium
  return (
    <div
      draggable
      onDragStart={e => onDragStart(e, c.id)}
      onClick={onEdit}
      style={{ background: '#fff', borderRadius: 9, padding: '13px 14px', cursor: 'pointer', border: '1.5px solid transparent', transition: 'box-shadow .15s,border-color .15s' }}
      onMouseOver={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,.1)'; e.currentTarget.style.borderColor = '#d0d4db' }}
      onMouseOut={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'transparent' }}
    >
      {c.area && <span className={`badge ${BADGE[c.area] || 'b-def'}`} style={{ marginBottom: 7 }}>{c.area}</span>}
      <div style={{ fontSize: 13, fontWeight: 600, color: '#1e1f21', lineHeight: 1.45, marginBottom: 9 }}>{c.title}</div>
      {c.description && <div style={{ fontSize: 12, color: '#888', lineHeight: 1.5, marginBottom: 9, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{c.description}</div>}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
        <span className={`pp ${cls}`}>{label}</span>
        {c.source && <span style={{ fontSize: 10, color: '#c0c4cc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140 }}>{c.source}</span>}
      </div>
    </div>
  )
}
