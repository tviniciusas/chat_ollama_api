import { useState, useRef, useEffect } from 'react'
import './ModelSelector.css'

function ModelSelector({ onModelsChange }) {
  const [selectedModels, setSelectedModels] = useState(['gpt-oss:20b'])
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  
  const availableModels = [

    { id: 'gpt-oss:20b', name: 'GPT 4', size: '14 GB' }
  ]

  const handleModelToggle = (modelId) => {
    const updatedModels = selectedModels.includes(modelId)
      ? selectedModels.filter(id => id !== modelId)
      : [...selectedModels, modelId]
    
    setSelectedModels(updatedModels)
    onModelsChange(updatedModels)
  }

  const getSelectedText = () => {
    if (selectedModels.length === 0) return 'Nenhum modelo selecionado'
    if (selectedModels.length === 1) {
      const model = availableModels.find(m => m.id === selectedModels[0])
      return model?.name || selectedModels[0]
    }
    return `${selectedModels.length} modelos selecionados`
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="model-selector" ref={dropdownRef}>
      <div 
        className={`model-select-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="selected-text">{getSelectedText()}</span>
        <svg 
          className={`dropdown-icon ${isOpen ? 'rotated' : ''}`} 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <polyline points="6,9 12,15 18,9"></polyline>
        </svg>
      </div>
      
      {isOpen && (
        <div className="model-dropdown">
          {availableModels.map(model => (
            <div 
              key={model.id} 
              className="model-option"
              onClick={() => handleModelToggle(model.id)}
            >
              <input
                type="checkbox"
                checked={selectedModels.includes(model.id)}
                onChange={() => {}}
                onClick={(e) => e.stopPropagation()}
              />
              <div className="model-info">
                <span className="model-name">{model.name}</span>
                <span className="model-size">{model.size}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ModelSelector