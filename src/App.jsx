import React, { useState, useEffect, useCallback } from 'react'
import { SEED_CARDS } from './data/seed.js'
import Board from './components/Board.jsx'
import Dashboard from './components/Dashboard.jsx'
import Timeline from './components/Timeline.jsx'
import Modal from './components/Modal.jsx'
import './App.css'

const STORAGE_KEY = 'vip-kanban-v2'

function loadCards() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return SEED_CARDS.map(c => ({ ...c }))
}

function saveCards(cards) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards))
}

function uid() {
  return 'c-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8)
}

export default function App() {
  const [cards, setCards] = useState(loadCards)
  const [view, setView] = useState('board')
  const [modal, setModal] = useState(null) // null | { mode: 'new'|'edit', card?, defaultStatus? }
  const [filterArea, setFilterArea] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => { saveCards(cards) }, [cards])

  const updateCards = useCallback((fn) => setCards(prev => { const next = fn(prev); saveCards(next); return next }), [])

  const openNew = (status = 'todo') => setModal({ mode: 'new', defaultStatus: status })
  const openEdit = (card) => setModal({ mode: 'edit', card })
  const closeModal = () => setModal(null)

  const saveCard = (data) => {
    if (modal?.mode === 'edit') {
      updateCards(prev => prev.map(c => c.id === data.id ? { ...c, ...data } : c))
    } else {
      updateCards(prev => [{ id: uid(), ...data }, ...prev])
    }
    closeModal()
  }

  const deleteCard = (id) => {
    updateCards(prev => prev.filter(c => c.id !== id))
    closeModal()
  }

  const moveCard = (id, newStatus) => {
    updateCards(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c))
  }

  const exportData = () => {
    const blob = new Blob([JSON.stringify(cards, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `vip-kanban-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
  }

  const importData = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        if (Array.isArray(data)) { updateCards(() => data) }
      } catch {}
      e.target.value = ''
    }
    reader.readAsText(file)
  }

  const filtered = cards.filter(c => {
    if (filterArea && c.area !== filterArea) return false
    if (search) {
      const q = search.toLowerCase()
      if (!c.title.toLowerCase().includes(q) && !(c.description || '').toLowerCase().includes(q)) return false
    }
    return true
  })

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">V</div>
          <div><div className="logo-text">VIP Team</div><div className="logo-sub">Task Board</div></div>
        </div>
        <div className="sidebar-section">Visualizações</div>
        <nav>
          {[['board','📋','Board'],['timeline','📅','Timeline'],['dashboard','📊','Dashboard']].map(([id,icon,label]) => (
            <div key={id} className={`nav-item${view===id?' active':''}`} onClick={() => setView(id)}>
              <span className="nav-icon">{icon}</span> {label}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">💾 Salvo automaticamente</div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="topbar-left">
            <span className="topbar-title">VIP Team Kanban</span>
            <span className="topbar-sub">{cards.length} tarefas</span>
          </div>
          <div className="topbar-right">
            <button className="btn btn-outline btn-sm" onClick={exportData}>⬇ Exportar</button>
            <label className="btn btn-outline btn-sm" style={{cursor:'pointer'}}>
              ⬆ Importar<input type="file" accept=".json" onChange={importData} style={{display:'none'}} />
            </label>
            <button className="btn btn-primary" onClick={() => openNew('todo')}>+ Nova Tarefa</button>
          </div>
        </header>

        {view === 'board' && (
          <Board
            cards={filtered}
            filterArea={filterArea}
            search={search}
            onFilterArea={setFilterArea}
            onSearch={setSearch}
            onOpenNew={openNew}
            onOpenEdit={openEdit}
            onMoveCard={moveCard}
          />
        )}
        {view === 'dashboard' && <Dashboard cards={cards} />}
        {view === 'timeline' && <Timeline cards={cards} onOpenEdit={openEdit} />}
      </div>

      {modal && (
        <Modal
          mode={modal.mode}
          card={modal.card}
          defaultStatus={modal.defaultStatus}
          onSave={saveCard}
          onDelete={deleteCard}
          onClose={closeModal}
        />
      )}
    </div>
  )
}
