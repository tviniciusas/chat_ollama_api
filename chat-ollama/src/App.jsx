import { useState, useRef, useEffect, useCallback } from 'react'
import ChatWindow from './components/ChatWindow'
import MessageInput from './components/MessageInput'
import ModelSelector from './components/ModelSelector'
import ThemeToggle from './components/ThemeToggle'
import Sidebar from './components/Sidebar'
import { useTheme } from './hooks/useTheme'
import { useConversations } from './hooks/useConversations'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModels, setSelectedModels] = useState(['qwen2.5-coder:14b'])
  const { theme, toggleTheme } = useTheme()
  const {
    conversations,
    currentConversation,
    isLoading: conversationsLoading,
    newConversation,
    selectConversation,
    addMessage,
    updateMessage,
    removeConversation
  } = useConversations()
  const abortControllerRef = useRef(null)

  // Sincronizar mensagens com a conversa atual
  const messages = currentConversation?.messages || []

  // Criar conversa inicial se não houver nenhuma
  useEffect(() => {
    if (!conversationsLoading && conversations.length === 0) {
      newConversation()
    }
  }, [conversationsLoading, conversations.length, newConversation])

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setIsLoading(false)

      // Atualizar mensagens em streaming para parar
      if (currentConversation) {
        currentConversation.messages.forEach(msg => {
          if (msg.isStreaming) {
            updateMessage(msg.id, { isStreaming: false })
          }
        })
      }
    }
  }, [currentConversation, updateMessage])

  // Construir contexto de conversa para a API
  const buildContext = useCallback(() => {
    if (!currentConversation || !currentConversation.messages.length) {
      return []
    }

    // Pegar últimas 10 mensagens para contexto (5 pares de pergunta/resposta)
    const recentMessages = currentConversation.messages.slice(-10)

    return recentMessages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }))
  }, [currentConversation])

  const sendMessage = async (message) => {
    if (!message.trim() || selectedModels.length === 0 || !currentConversation) return

    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date().toISOString()
    }

    // Adicionar mensagem do usuário
    await addMessage(userMessage)
    setIsLoading(true)

    abortControllerRef.current = new AbortController()

    // Construir contexto de conversa
    const context = buildContext()

    // Construir o prompt com contexto
    let fullPrompt = message
    if (context.length > 0) {
      // Formatar contexto para o modelo
      const contextText = context
        .map(msg => `${msg.role === 'user' ? 'Usuário' : 'Assistente'}: ${msg.content}`)
        .join('\n\n')
      fullPrompt = `Contexto da conversa:\n${contextText}\n\nUsuário: ${message}`
    }

    try {
      const modelPromises = selectedModels.map(async (modelId, index) => {
        const assistantMessageId = Date.now() + index + 1
        const assistantMessage = {
          id: assistantMessageId,
          text: '',
          sender: 'assistant',
          timestamp: new Date().toISOString(),
          isStreaming: true,
          model: modelId
        }

        await addMessage(assistantMessage)

        try {
          const response = await fetch('http://192.168.0.210:11434/api/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: modelId,
              prompt: fullPrompt,
              stream: true,
              system: 'Você é um assistente prestativo. Use o contexto da conversa anterior para fornecer respostas mais relevantes e coerentes.'
            }),
            signal: abortControllerRef.current?.signal
          })

          if (!response.ok) {
            throw new Error(`Falha na requisição para ${modelId}`)
          }

          const reader = response.body.getReader()
          const decoder = new TextDecoder()
          let accumulatedText = ''

          while (true) {
            const { done, value } = await reader.read()

            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split('\n').filter(line => line.trim())

            for (const line of lines) {
              try {
                const data = JSON.parse(line)

                if (data.response) {
                  accumulatedText += data.response
                  await updateMessage(assistantMessageId, {
                    text: accumulatedText
                  })
                }

                if (data.done) {
                  await updateMessage(assistantMessageId, {
                    isStreaming: false
                  })
                }
              } catch (e) {
                console.error('Erro ao parsear JSON:', e)
              }
            }
          }
        } catch (error) {
          if (error.name !== 'AbortError') {
            console.error(`Erro ao enviar mensagem para ${modelId}:`, error)
            await updateMessage(assistantMessageId, {
              text: `Erro ao conectar com ${modelId}. Verifique se o modelo está disponível.`,
              isStreaming: false
            })
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

  const handleNewConversation = async () => {
    await newConversation()
  }

  const handleSelectConversation = async (conversationId) => {
    await selectConversation(conversationId)
  }

  const handleDeleteConversation = async (conversationId) => {
    await removeConversation(conversationId)
  }

  return (
    <div className="app">
      <Sidebar
        conversations={conversations}
        currentConversation={currentConversation}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
      />
      <div className="main-content">
        <header className="app-header">
          <div className="header-content">
            <h1>Iluminus</h1>
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
    </div>
  )
}

export default App
