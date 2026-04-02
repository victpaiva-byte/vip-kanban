import React, { useState } from 'react'

const BADGE = { MGM: 'b-MGM', Acquisition: 'b-Acq', Retention: 'b-Ret', Recovery: 'b-Rec', General: 'b-Gen' }
const STATUS_MAP = { todo: ['sp-todo','A Fazer'], inprogress: ['sp-inprogress','Em Andamento'], done: ['sp-done','Concluído'], blocked: ['sp-blocked','Bloqueado'] }
const PP_MAP = { high: ['pp-high','Alta'], medium: ['pp-medium','Média'], low: ['pp-low','Baixa'] }

export default function Timeline({ cards, onOpenEdit }) {
  const [filterStatus, setFilterStatus] = useState('')
  const [sort, setSort] = useState({ col: '', dir: 1 })

  const filtered = cards.filter(c => !filterStatus || c.status === filterStatus)
  const sorted = sort.col ? [...filtered].sort((a, b) => {
    const av = a[sort.col] || '', bv = b[sort.col] || ''
    return av < bv ? -sort.dir : av > bv ? sort.dir : 0
  }) : filtered

  const toggle = (col) => setSort(s => s.col === col ? { col, dir: -s.dir } : { col, dir: 1 })

  return (
    <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
        {[['', 'Todos'], ['todo','A Fazer'], ['inprogress','Em Andamento'], ['done','Concluído'], ['blocked','Bloqueado']].map(([val, lbl]) => (
          <span key={val} onClick={() => setFilterStatus(val)} style={{ padding: '5px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: '1.5px solid', borderColor: filterStatus === val ? '#f06a35' : '#e2e5ea', background: filterStatus === val ? '#fff5f0' : '#fff', color: filterStatus === val ? '#f06a35' : '#6b6e7a' }}>{lbl}</span>
        ))}
      </div>
      <div style={{ overflowX: 'auto', flex: 1 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 10, overflow: 'hidden', border: '1.5px solid #e2e5ea' }}>
          <thead>
            <tr>
              {[['title','Título'],['area','Área'],['status','Status'],['priority','Prioridade'],['source','Fonte']].map(([col, lbl]) => (
                <th key={col} onClick={() => toggle(col)} style={{ padding: '11px 14px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: '#6b6e7a', background: '#f7f9fc', borderBottom: '1.5px solid #e2e5ea', textAlign: 'left', cursor: 'pointer', userSelect: 'none' }}>
                  {lbl} <span style={{ opacity: .5, fontSize: 10 }}>{sort.col === col ? (sort.dir === 1 ? '↑' : '↓') : '↕'}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0
              ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: '#bbb' }}>Sem tarefas</td></tr>
              : sorted.map(c => {
                const [scls, slbl] = STATUS_MAP[c.status] || STATUS_MAP.todo
                const [pcls, plbl] = PP_MAP[c.priority] || PP_MAP.medium
                return (
                  <tr key={c.id} onClick={() => onOpenEdit(c)} style={{ cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background='#fafbfc'} onMouseOut={e => e.currentTarget.style.background=''}>
                    <td style={{ padding: '11px 14px', fontSize: 13, fontWeight: 500, maxWidth: 280, borderBottom: '1px solid #f0f2f5' }}>{c.title}</td>
                    <td style={{ padding: '11px 14px', borderBottom: '1px solid #f0f2f5' }}>{c.area ? <span className={`badge ${BADGE[c.area]||'b-def'}`}>{c.area}</span> : '—'}</td>
                    <td style={{ padding: '11px 14px', borderBottom: '1px solid #f0f2f5' }}><span className={`status-pill ${scls}`}>{slbl}</span></td>
                    <td style={{ padding: '11px 14px', borderBottom: '1px solid #f0f2f5' }}><span className={`pp ${pcls}`}>{plbl}</span></td>
                    <td style={{ padding: '11px 14px', fontSize: 12, color: '#aaa', borderBottom: '1px solid #f0f2f5' }}>{c.source || '—'}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}
