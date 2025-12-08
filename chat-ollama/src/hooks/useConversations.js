import { useState, useEffect } from 'react'
import {
  initDB,
  createConversation,
  getAllConversations,
  getConversation,
  updateConversation,
  addMessageToConversation,
  updateMessageInConversation,
  deleteConversation
} from '../utils/db'

export const useConversations = () => {
  const [conversations, setConversations] = useState([])
  const [currentConversation, setCurrentConversation] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Inicializar banco de dados e carregar conversas
  useEffect(() => {
    const init = async () => {
      try {
        await initDB()
        await loadConversations()
      } catch (error) {
        console.error('Erro ao inicializar banco de dados:', error)
      } finally {
        setIsLoading(false)
      }
    }

    init()
  }, [])

  // Carregar todas as conversas
  const loadConversations = async () => {
    try {
      const allConversations = await getAllConversations()
      setConversations(allConversations)

      // Se não houver conversa atual e existirem conversas, selecionar a primeira
      if (!currentConversation && allConversations.length > 0) {
        setCurrentConversation(allConversations[0])
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error)
    }
  }

  // Criar nova conversa
  const newConversation = async (title = 'Nova Conversa') => {
    try {
      const conversation = await createConversation(title)
      setConversations(prev => [conversation, ...prev])
      setCurrentConversation(conversation)
      return conversation
    } catch (error) {
      console.error('Erro ao criar conversa:', error)
      throw error
    }
  }

  // Selecionar conversa
  const selectConversation = async (conversationId) => {
    try {
      const conversation = await getConversation(conversationId)
      setCurrentConversation(conversation)
      return conversation
    } catch (error) {
      console.error('Erro ao selecionar conversa:', error)
      throw error
    }
  }

  // Adicionar mensagem à conversa atual
  const addMessage = async (message) => {
    if (!currentConversation) {
      throw new Error('Nenhuma conversa selecionada')
    }

    try {
      const updatedConversation = await addMessageToConversation(
        currentConversation.id,
        message
      )

      setCurrentConversation(updatedConversation)
      setConversations(prev =>
        prev.map(conv =>
          conv.id === updatedConversation.id ? updatedConversation : conv
        )
      )

      return updatedConversation
    } catch (error) {
      console.error('Erro ao adicionar mensagem:', error)
      throw error
    }
  }

  // Atualizar mensagem na conversa atual
  const updateMessage = async (messageId, updates) => {
    if (!currentConversation) {
      throw new Error('Nenhuma conversa selecionada')
    }

    try {
      const updatedConversation = await updateMessageInConversation(
        currentConversation.id,
        messageId,
        updates
      )

      setCurrentConversation(updatedConversation)
      setConversations(prev =>
        prev.map(conv =>
          conv.id === updatedConversation.id ? updatedConversation : conv
        )
      )

      return updatedConversation
    } catch (error) {
      console.error('Erro ao atualizar mensagem:', error)
      throw error
    }
  }

  // Atualizar conversa (ex: mudar título ou modelos)
  const updateConversationData = async (conversationId, updates) => {
    try {
      const updatedConversation = await updateConversation(conversationId, updates)

      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId ? updatedConversation : conv
        )
      )

      if (currentConversation?.id === conversationId) {
        setCurrentConversation(updatedConversation)
      }

      return updatedConversation
    } catch (error) {
      console.error('Erro ao atualizar conversa:', error)
      throw error
    }
  }

  // Deletar conversa
  const removeConversation = async (conversationId) => {
    try {
      await deleteConversation(conversationId)

      setConversations(prev => {
        const filtered = prev.filter(conv => conv.id !== conversationId)

        // Se a conversa deletada era a atual, selecionar outra
        if (currentConversation?.id === conversationId) {
          setCurrentConversation(filtered[0] || null)
        }

        return filtered
      })
    } catch (error) {
      console.error('Erro ao deletar conversa:', error)
      throw error
    }
  }

  return {
    conversations,
    currentConversation,
    isLoading,
    newConversation,
    selectConversation,
    addMessage,
    updateMessage,
    updateConversationData,
    removeConversation,
    loadConversations
  }
}
