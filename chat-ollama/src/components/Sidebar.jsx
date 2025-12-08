import { useState } from 'react'
import './Sidebar.css'

function Sidebar({
  conversations,
  currentConversation,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return 'Hoje'
    if (diffDays === 2) return 'Ontem'
    if (diffDays <= 7) return `${diffDays} dias atrás`

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const groupConversationsByDate = () => {
    const groups = {
      hoje: [],
      ontem: [],
      semana: [],
      mais: []
    }

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)

    conversations.forEach(conv => {
      const convDate = new Date(conv.updatedAt)
      const convDateOnly = new Date(convDate.getFullYear(), convDate.getMonth(), convDate.getDate())

      if (convDateOnly.getTime() === today.getTime()) {
        groups.hoje.push(conv)
      } else if (convDateOnly.getTime() === yesterday.getTime()) {
        groups.ontem.push(conv)
      } else if (convDate >= weekAgo) {
        groups.semana.push(conv)
      } else {
        groups.mais.push(conv)
      }
    })

    return groups
  }

  const groups = groupConversationsByDate()

  const handleDelete = (e, conversationId) => {
    e.stopPropagation()
    if (window.confirm('Tem certeza que deseja excluir esta conversa?')) {
      onDeleteConversation(conversationId)
    }
  }

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {isCollapsed ? (
        <button
          className="sidebar-expand-btn"
          onClick={() => setIsCollapsed(false)}
          aria-label="Expandir sidebar"
          title="Expandir sidebar"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18"></path>
          </svg>
        </button>
      ) : (
        <>
          <div className="sidebar-header">
            <button
              className="new-conversation-btn"
              onClick={onNewConversation}
            >
              <svg className="icon-plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Nova Conversa</span>
            </button>
            <button
              className="sidebar-toggle-btn"
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label="Recolher sidebar"
              title="Recolher sidebar"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"></path>
              </svg>
            </button>
          </div>

          <div className="conversations-list">
            {groups.hoje.length > 0 && (
              <div className="conversation-group">
                <h3 className="group-title">Hoje</h3>
                {groups.hoje.map(conv => (
                  <div
                    key={conv.id}
                    className={`conversation-item ${currentConversation?.id === conv.id ? 'active' : ''}`}
                    onClick={() => onSelectConversation(conv.id)}
                  >
                    <svg className="icon-message" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span className="conversation-title">{conv.title}</span>
                    <button
                      className="delete-btn"
                      onClick={(e) => handleDelete(e, conv.id)}
                      aria-label="Excluir conversa"
                      title="Excluir conversa"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {groups.ontem.length > 0 && (
              <div className="conversation-group">
                <h3 className="group-title">Ontem</h3>
                {groups.ontem.map(conv => (
                  <div
                    key={conv.id}
                    className={`conversation-item ${currentConversation?.id === conv.id ? 'active' : ''}`}
                    onClick={() => onSelectConversation(conv.id)}
                  >
                    <svg className="icon-message" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span className="conversation-title">{conv.title}</span>
                    <button
                      className="delete-btn"
                      onClick={(e) => handleDelete(e, conv.id)}
                      aria-label="Excluir conversa"
                      title="Excluir conversa"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {groups.semana.length > 0 && (
              <div className="conversation-group">
                <h3 className="group-title">Últimos 7 dias</h3>
                {groups.semana.map(conv => (
                  <div
                    key={conv.id}
                    className={`conversation-item ${currentConversation?.id === conv.id ? 'active' : ''}`}
                    onClick={() => onSelectConversation(conv.id)}
                  >
                    <svg className="icon-message" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span className="conversation-title">{conv.title}</span>
                    <button
                      className="delete-btn"
                      onClick={(e) => handleDelete(e, conv.id)}
                      aria-label="Excluir conversa"
                      title="Excluir conversa"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {groups.mais.length > 0 && (
              <div className="conversation-group">
                <h3 className="group-title">Mais antigas</h3>
                {groups.mais.map(conv => (
                  <div
                    key={conv.id}
                    className={`conversation-item ${currentConversation?.id === conv.id ? 'active' : ''}`}
                    onClick={() => onSelectConversation(conv.id)}
                  >
                    <svg className="icon-message" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span className="conversation-title">{conv.title}</span>
                    <button
                      className="delete-btn"
                      onClick={(e) => handleDelete(e, conv.id)}
                      aria-label="Excluir conversa"
                      title="Excluir conversa"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {conversations.length === 0 && (
              <div className="empty-state">
                <p>Nenhuma conversa ainda</p>
                <p className="empty-hint">Clique em "Nova Conversa" para começar</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Sidebar
