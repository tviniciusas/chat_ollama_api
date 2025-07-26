import CodeBlock from './CodeBlock'
import { parseMessageContent } from '../utils/messageParser'
import './MessageContent.css'

function MessageContent({ text, isStreaming }) {
  const parts = parseMessageContent(text)
  
  return (
    <div className="message-content-wrapper">
      {parts.map((part, index) => {
        if (part.type === 'code') {
          return (
            <CodeBlock 
              key={index}
              code={part.content}
              language={part.language}
            />
          )
        } else {
          return (
            <div key={index} className="message-text">
              {part.content}
              {isStreaming && index === parts.length - 1 && (
                <span className="cursor">▋</span>
              )}
            </div>
          )
        }
      })}
    </div>
  )
}

export default MessageContent