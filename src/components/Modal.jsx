import React, { useState, useEffect } from 'react'

export default function Modal({ mode, card, defaultStatus, onSave, onDelete, onClose }) {
  const [form, setForm] = useState({
    title: '', area: '', description: '', priority: 'medium', status: defaultStatus || 'todo', source: ''
  })

  useEffect(() => {
    if (mode === 'edit' && card) setForm({ title: card.title, area: card.area || '', description: card.description || '', priority: card.priority || 'medium', status: card.status, source: card.source || '' })
    else setForm({ title: '', area: '', description: '', priority: 'medium', status: defaultStatus || 'todo', source: '' })
  }, [mode, card, defaultStatus])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.title.trim()) return
    onSave(mode === 'edit' ? { ...card, ...form } : form)
  }

  const fg = { marginBottom: 14 }
  const label = { fontSize: 12, fontWeight: 600, color: '#6b6e7a', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.4px' }
  const input = { width: '100%', border: '1.5px solid #e2e5ea', borderRadius: 7, padding: '9px 11px', fontSize: 13, color: '#1e1f21', outline: 'none', fontFamily: 'inherit', background: '#fff' }

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ display: 'flex', position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 1000, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 14, padding: 30, width: 520, maxWidth: '96vw', boxShadow: '0 24px 80px rgba(0,0,0,.22)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700 }}>{mode === 'edit' ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, color: '#bbb', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={fg}><label style={label}>Título *</label><input style={input} value={form.title} onChange={e => set('title', e.target.value)} placeholder="O que precisa ser feito?" autoFocus /></div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ ...fg, flex: 1 }}>
            <label style={label}>Área</label>
            <select style={input} value={form.area} onChange={e => set('area', e.target.value)}>
              <option value="">— nenhuma —</option>
              {['MGM','Acquisition','Retention','Recovery','General'].map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div style={{ ...fg, flex: 1 }}>
            <label style={label}>Prioridade</label>
            <select style={input} value={form.priority} onChange={e => set('priority', e.target.value)}>
              <option value="high">🔴 Alta</option>
              <option value="medium">🟡 Média</option>
              <option value="low">🟢 Baixa</option>
            </select>
          </div>
        </div>

        <div style={fg}><label style={label}>Descrição</label><textarea style={{ ...input, minHeight: 80, resize: 'vertical' }} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Detalhes ou contexto..." /></div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ ...fg, flex: 1 }}>
            <label style={label}>Status</label>
            <select style={input} value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="todo">A Fazer</option>
              <option value="inprogress">Em Andamento</option>
              <option value="done">Concluído</option>
              <option value="blocked">Bloqueado</option>
            </select>
          </div>
          <div style={{ ...fg, flex: 1 }}>
            <label style={label}>Fonte</label>
            <input style={input} value={form.source} onChange={e => set('source', e.target.value)} placeholder="ex: Reunião semanal" />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 22 }}>
          <div>
            {mode === 'edit' && <button onClick={() => { if(confirm('Deletar esta tarefa?')) onDelete(card.id) }} style={{ background: 'none', border: 'none', color: '#e03131', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>🗑 Deletar</button>}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-outline" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSave}>Salvar tarefa</button>
          </div>
        </div>
      </div>
    </div>
  )
}
