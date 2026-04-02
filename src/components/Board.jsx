import React, { useRef } from 'react'
import Card from './Card.jsx'

const COLS = [
  { id: 'todo', label: 'A Fazer', dot: '#b3b8c4' },
  { id: 'inprogress', label: 'Em Andamento', dot: '#228be6' },
  { id: 'done', label: 'Concluído', dot: '#37b24d' },
  { id: 'blocked', label: 'Bloqueado', dot: '#f03e3e' },
]

const AREAS = ['MGM', 'Acquisition', 'Retention', 'Recovery', 'General']

export default function Board({ cards, filterArea, search, onFilterArea, onSearch, onOpenNew, onOpenEdit, onMoveCard }) {
  const dragId = useRef(null)

  const handleDragStart = (e, id) => { dragId.current = id }
  const handleDrop = (e, status) => {
    e.preventDefault()
    if (dragId.current) { onMoveCard(dragId.current, status); dragId.current = null }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '20px 28px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        <input
          className="search-input"
          placeholder="🔍  Buscar tarefas..."
          value={search}
          onChange={e => onSearch(e.target.value)}
          style={{ padding: '6px 12px', borderRadius: 7, border: '1.5px solid #e2e5ea', fontSize: 13, outline: 'none', minWidth: 200 }}
        />
        {['', ...AREAS].map(a => (
          <span
            key={a}
            onClick={() => onFilterArea(a)}
            style={{
              padding: '5px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              border: '1.5px solid', borderColor: filterArea === a ? '#f06a35' : '#e2e5ea',
              background: filterArea === a ? '#fff5f0' : '#fff',
              color: filterArea === a ? '#f06a35' : '#6b6e7a'
            }}
          >
            {a || 'Todos'}
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 14, overflowX: 'auto', flex: 1, alignItems: 'flex-start', paddingBottom: 16 }}>
        {COLS.map(col => {
          const colCards = cards.filter(c => c.status === col.id)
          return (
            <div key={col.id} style={{ background: '#e9ecef', borderRadius: 10, width: 288, minWidth: 288, display: 'flex', flexDirection: 'column' }}
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleDrop(e, col.id)}
            >
              <div style={{ padding: '14px 14px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.7px', color: '#6b6e7a' }}>
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: col.dot, display: 'inline-block' }} />
                  {col.label}
                </div>
                <span style={{ fontSize: 11, color: '#9ea3ae', background: '#dde0e5', borderRadius: 99, padding: '2px 9px', fontWeight: 600 }}>{colCards.length}</span>
              </div>
              <div style={{ padding: '4px 10px', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 60, maxHeight: '70vh', overflowY: 'auto' }}>
                {colCards.length === 0
                  ? <div style={{ textAlign: 'center', padding: '24px 0', fontSize: 12, color: '#c0c4cc' }}>Sem tarefas</div>
                  : colCards.map(c => (
                    <Card key={c.id} card={c} onEdit={() => onOpenEdit(c)} onDragStart={handleDragStart} />
                  ))
                }
              </div>
              <button
                onClick={() => onOpenNew(col.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', margin: '6px 10px 10px', borderRadius: 7, fontSize: 13, color: '#9ea3ae', cursor: 'pointer', background: 'none', border: 'none', width: 'calc(100% - 20px)', textAlign: 'left', transition: 'all .15s' }}
                onMouseOver={e => { e.currentTarget.style.background = '#dde0e5'; e.currentTarget.style.color = '#1e1f21' }}
                onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#9ea3ae' }}
              >
                ＋ Adicionar tarefa
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
