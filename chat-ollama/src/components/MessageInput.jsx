import { useState, useRef, useEffect } from 'react'
import PDFInput from './PDFInput'
import './MessageInput.css'

function MessageInput({ onSendMessage, onStop, disabled }) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef(null)

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (!textarea) return

    // Reset height to calculate scroll height
    textarea.style.height = 'auto'
    
    // Calculate available chat space
    const viewportHeight = window.innerHeight
    const header = document.querySelector('.app-header')
    const chatControls = document.querySelector('.chat-controls')
    const messageInput = document.querySelector('.message-input')
    
    // Calculate used space
    const headerHeight = header ? header.offsetHeight : 80
    const controlsHeight = chatControls ? chatControls.offsetHeight : 40
    const inputPadding = messageInput ? 40 : 40 // padding + margins
    
    // Available space for chat window
    const availableChatHeight = viewportHeight - headerHeight - controlsHeight - inputPadding
    
    // Max height should be 1/3 of available chat space, but at least 100px
    const maxHeight = Math.max(Math.floor(availableChatHeight / 3), 100)
    
    // Set height based on content, up to max
    const scrollHeight = textarea.scrollHeight
    const newHeight = Math.min(scrollHeight, maxHeight)
    
    textarea.style.height = `${newHeight}px`
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message)
      setMessage('')
      // Reset textarea height after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handlePDFExtracted = (extractedText, fileName) => {
    const pdfMessage = `📄 **PDF Analisado: ${fileName}**\n\nConteúdo extraído:\n\n${extractedText}`
    onSendMessage(pdfMessage)
  }

  const handleTextareaChange = (e) => {
    setMessage(e.target.value)
    adjustTextareaHeight()
  }

  // Adjust height on message change and on mount
  useEffect(() => {
    adjustTextareaHeight()
  }, [message])

  // Adjust height on window resize
  useEffect(() => {
    const handleResize = () => adjustTextareaHeight()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <div className="input-container">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyPress={handleKeyPress}
          placeholder="Digite sua mensagem..."
          disabled={disabled}
          rows={1}
        />
        <div className="input-actions">
          <PDFInput onPDFExtracted={handlePDFExtracted} disabled={disabled} />
          {disabled ? (
            <button
              type="button"
              onClick={onStop}
              className="stop-button"
              title="Parar geração"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="2"/>
              </svg>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!message.trim()}
              className="send-button"
              title="Enviar mensagem"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </form>
  )
}

export default MessageInput