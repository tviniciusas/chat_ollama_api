import { useState, useRef } from 'react'
import ChatWindow from './components/ChatWindow'
import MessageInput from './components/MessageInput'
import ModelSelector from './components/ModelSelector'
import ThemeToggle from './components/ThemeToggle'
import { useTheme } from './hooks/useTheme'
import './App.css'

function App() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModels, setSelectedModels] = useState(['gpt-oss:20b'])
  const { theme, toggleTheme } = useTheme()
  const abortControllerRef = useRef(null)

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setIsLoading(false)
      
      setMessages(prev => 
        prev.map(msg => 
          msg.isStreaming 
            ? { ...msg, isStreaming: false }
            : msg
        )
      )
    }
  }

  const sendMessage = async (message) => {
    if (!message.trim() || selectedModels.length === 0) return

    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    abortControllerRef.current = new AbortController()

    try {
      const modelPromises = selectedModels.map(async (modelId, index) => {
        const assistantMessageId = Date.now() + index + 1
        const assistantMessage = {
          id: assistantMessageId,
          text: '',
          sender: 'assistant',
          timestamp: new Date(),
          isStreaming: true,
          model: modelId
        }

        setMessages(prev => [...prev, assistantMessage])

        try {
          const response = await fetch('http://192.168.0.210:11434/api/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: modelId,
              prompt: message,
              stream: true
            }),
            signal: abortControllerRef.current?.signal
          })

          if (!response.ok) {
            throw new Error(`Falha na requisição para ${modelId}`)
          }

          const reader = response.body.getReader()
          const decoder = new TextDecoder()

          while (true) {
            const { done, value } = await reader.read()
            
            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split('\n').filter(line => line.trim())

            for (const line of lines) {
              try {
                const data = JSON.parse(line)
                
                if (data.response) {
                  setMessages(prev => 
                    prev.map(msg => 
                      msg.id === assistantMessageId 
                        ? { ...msg, text: msg.text + data.response }
                        : msg
                    )
                  )
                }

                if (data.done) {
                  setMessages(prev => 
                    prev.map(msg => 
                      msg.id === assistantMessageId 
                        ? { ...msg, isStreaming: false }
                        : msg
                    )
                  )
                }
              } catch (e) {
                console.error('Erro ao parsear JSON:', e)
              }
            }
          }
        } catch (error) {
          if (error.name !== 'AbortError') {
            console.error(`Erro ao enviar mensagem para ${modelId}:`, error)
            setMessages(prev => 
              prev.map(msg => 
                msg.id === assistantMessageId 
                  ? { 
                      ...msg, 
                      text: `Erro ao conectar com ${modelId}. Verifique se o modelo está disponível.`,
                      isStreaming: false 
                    }
                  : msg
              )
            )
          }
        }
      })

      await Promise.allSettled(modelPromises)
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Erro geral:', error)
      }
    } finally {
      abortControllerRef.current = null
      setIsLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Chat com Ollama</h1>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </header>
      <main className="app-main">
        <div className="chat-controls">
          <ModelSelector onModelsChange={setSelectedModels} />
        </div>
        <ChatWindow messages={messages} isLoading={isLoading} />
        <MessageInput onSendMessage={sendMessage} onStop={stopGeneration} disabled={isLoading} />
      </main>
    </div>
  )
}

export default App
