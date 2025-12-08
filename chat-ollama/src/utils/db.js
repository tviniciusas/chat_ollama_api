// IndexedDB para armazenar conversas
const DB_NAME = 'iluminusDB'
const DB_VERSION = 1
const CONVERSATIONS_STORE = 'conversations'

let db = null

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const db = event.target.result

      // Store para conversas
      if (!db.objectStoreNames.contains(CONVERSATIONS_STORE)) {
        const conversationStore = db.createObjectStore(CONVERSATIONS_STORE, {
          keyPath: 'id',
          autoIncrement: true
        })
        conversationStore.createIndex('timestamp', 'timestamp', { unique: false })
        conversationStore.createIndex('updatedAt', 'updatedAt', { unique: false })
      }
    }
  })
}

// Criar nova conversa
export const createConversation = async (title = 'Nova Conversa') => {
  if (!db) await initDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CONVERSATIONS_STORE], 'readwrite')
    const store = transaction.objectStore(CONVERSATIONS_STORE)

    const conversation = {
      title,
      messages: [],
      timestamp: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      models: ['Iluminus']
    }

    const request = store.add(conversation)

    request.onsuccess = () => {
      conversation.id = request.result
      resolve(conversation)
    }
    request.onerror = () => reject(request.error)
  })
}

// Buscar todas as conversas
export const getAllConversations = async () => {
  if (!db) await initDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CONVERSATIONS_STORE], 'readonly')
    const store = transaction.objectStore(CONVERSATIONS_STORE)
    const index = store.index('updatedAt')
    const request = index.openCursor(null, 'prev') // Ordenar por mais recente

    const conversations = []

    request.onsuccess = (event) => {
      const cursor = event.target.result
      if (cursor) {
        conversations.push(cursor.value)
        cursor.continue()
      } else {
        resolve(conversations)
      }
    }

    request.onerror = () => reject(request.error)
  })
}

// Buscar conversa por ID
export const getConversation = async (id) => {
  if (!db) await initDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CONVERSATIONS_STORE], 'readonly')
    const store = transaction.objectStore(CONVERSATIONS_STORE)
    const request = store.get(id)

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// Atualizar conversa
export const updateConversation = async (id, updates) => {
  if (!db) await initDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CONVERSATIONS_STORE], 'readwrite')
    const store = transaction.objectStore(CONVERSATIONS_STORE)
    const getRequest = store.get(id)

    getRequest.onsuccess = () => {
      const conversation = getRequest.result
      if (!conversation) {
        reject(new Error('Conversa não encontrada'))
        return
      }

      const updatedConversation = {
        ...conversation,
        ...updates,
        updatedAt: new Date().toISOString()
      }

      const updateRequest = store.put(updatedConversation)
      updateRequest.onsuccess = () => resolve(updatedConversation)
      updateRequest.onerror = () => reject(updateRequest.error)
    }

    getRequest.onerror = () => reject(getRequest.error)
  })
}

// Adicionar mensagem a uma conversa
export const addMessageToConversation = async (conversationId, message) => {
  if (!db) await initDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CONVERSATIONS_STORE], 'readwrite')
    const store = transaction.objectStore(CONVERSATIONS_STORE)
    const getRequest = store.get(conversationId)

    getRequest.onsuccess = () => {
      const conversation = getRequest.result
      if (!conversation) {
        reject(new Error('Conversa não encontrada'))
        return
      }

      conversation.messages.push(message)
      conversation.updatedAt = new Date().toISOString()

      // Atualizar título automaticamente se for a primeira mensagem do usuário
      if (conversation.messages.length === 1 && message.sender === 'user') {
        conversation.title = message.text.substring(0, 50) + (message.text.length > 50 ? '...' : '')
      }

      const updateRequest = store.put(conversation)
      updateRequest.onsuccess = () => resolve(conversation)
      updateRequest.onerror = () => reject(updateRequest.error)
    }

    getRequest.onerror = () => reject(getRequest.error)
  })
}

// Atualizar mensagem em uma conversa
export const updateMessageInConversation = async (conversationId, messageId, updates) => {
  if (!db) await initDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CONVERSATIONS_STORE], 'readwrite')
    const store = transaction.objectStore(CONVERSATIONS_STORE)
    const getRequest = store.get(conversationId)

    getRequest.onsuccess = () => {
      const conversation = getRequest.result
      if (!conversation) {
        reject(new Error('Conversa não encontrada'))
        return
      }

      conversation.messages = conversation.messages.map(msg =>
        msg.id === messageId ? { ...msg, ...updates } : msg
      )
      conversation.updatedAt = new Date().toISOString()

      const updateRequest = store.put(conversation)
      updateRequest.onsuccess = () => resolve(conversation)
      updateRequest.onerror = () => reject(updateRequest.error)
    }

    getRequest.onerror = () => reject(getRequest.error)
  })
}

// Deletar conversa
export const deleteConversation = async (id) => {
  if (!db) await initDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CONVERSATIONS_STORE], 'readwrite')
    const store = transaction.objectStore(CONVERSATIONS_STORE)
    const request = store.delete(id)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

// Limpar todas as conversas
export const clearAllConversations = async () => {
  if (!db) await initDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CONVERSATIONS_STORE], 'readwrite')
    const store = transaction.objectStore(CONVERSATIONS_STORE)
    const request = store.clear()

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}
