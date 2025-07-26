export function parseMessageContent(text) {
  const parts = []
  let lastIndex = 0
  
  // Regex para encontrar blocos de código com ```
  const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g
  
  let match
  while ((match = codeBlockRegex.exec(text)) !== null) {
    // Adiciona texto antes do bloco de código
    if (match.index > lastIndex) {
      const textBefore = text.slice(lastIndex, match.index)
      if (textBefore.trim()) {
        parts.push({
          type: 'text',
          content: textBefore
        })
      }
    }
    
    // Adiciona o bloco de código
    parts.push({
      type: 'code',
      language: match[1] || 'text',
      content: match[2].trim()
    })
    
    lastIndex = match.index + match[0].length
  }
  
  // Adiciona texto restante após o último bloco de código
  if (lastIndex < text.length) {
    const textAfter = text.slice(lastIndex)
    if (textAfter.trim()) {
      parts.push({
        type: 'text',
        content: textAfter
      })
    }
  }
  
  // Se não encontrou nenhum bloco de código, retorna o texto completo
  if (parts.length === 0) {
    parts.push({
      type: 'text',
      content: text
    })
  }
  
  return parts
}