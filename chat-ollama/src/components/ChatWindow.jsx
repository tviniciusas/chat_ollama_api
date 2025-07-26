import { useEffect, useRef } from 'react'
import MessageContent from './MessageContent'
import './ChatWindow.css'

function ChatWindow({ messages, isLoading }) {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender} ${message.isStreaming ? 'streaming' : ''}`}
          >
            <div className="message-content">
              {message.sender === 'assistant' ? (
                <>
                  {message.model && (
                    <div className="model-label">
                      {message.model}
                    </div>
                  )}
                  <MessageContent 
                    text={message.text} 
                    isStreaming={message.isStreaming}
                  />
                </>
              ) : (
                <div className="message-text">
                  {message.text}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant">
            <div className="message-content">
              <div className="message-text">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

export default ChatWindow