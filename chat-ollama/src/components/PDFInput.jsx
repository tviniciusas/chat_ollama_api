import { useState, useRef } from 'react'
import './PDFInput.css'

function PDFInput({ onPDFExtracted, disabled }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [fileName, setFileName] = useState('')
  const fileInputRef = useRef(null)

  const extractTextFromPDF = async (file) => {
    console.log('Iniciando processo de PDF:', file.name)
    
    try {
      setIsProcessing(true)
      setFileName(file.name)

      // Para demonstração, vamos usar um placeholder
      // Em um ambiente real, você usaria um serviço backend para processar o PDF
      const placeholderText = `
📄 PDF Carregado: ${file.name}
Tamanho: ${(file.size / 1024).toFixed(2)} KB

[SIMULAÇÃO] Este é o conteúdo extraído do PDF.
Em um ambiente de produção, o PDF seria processado no servidor.

Para implementar a extração real de PDF:
1. Use um serviço backend (Node.js + pdf-parse)
2. Ou use uma API externa como Adobe PDF Services
3. Ou implemente um worker separado

Arquivo carregado com sucesso para análise.
Você pode solicitar ao modelo que analise este documento.`

      console.log('Processamento simulado concluído')
      return placeholderText.trim()
      
    } catch (error) {
      console.error('Erro ao processar arquivo:', error)
      throw new Error('Falha ao processar o arquivo')
    } finally {
      setIsProcessing(false)
      setFileName('')
    }
  }

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    
    if (!file) return
    
    // Check file type and size
    if (file.type !== 'application/pdf') {
      alert('Por favor, selecione apenas arquivos PDF')
      return
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      alert('Arquivo muito grande. Limite de 50MB')
      return
    }

    console.log('Arquivo selecionado:', {
      name: file.name,
      size: file.size,
      type: file.type
    })

    try {
      const extractedText = await extractTextFromPDF(file)
      console.log('Texto extraído com sucesso, enviando para callback')
      onPDFExtracted(extractedText, file.name)
    } catch (error) {
      console.error('Erro no handleFileChange:', error)
      alert(`Erro: ${error.message}`)
    } finally {
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="pdf-input">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        disabled={disabled || isProcessing}
        className="pdf-file-input"
        id="pdf-upload"
      />
      <label 
        htmlFor="pdf-upload" 
        className={`pdf-upload-label ${disabled || isProcessing ? 'disabled' : ''}`}
        title="Carregar PDF para análise"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10,9 9,9 8,9"/>
        </svg>
{isProcessing && <span className="processing-text">...</span>}
      </label>
      {fileName && (
        <span className="pdf-processing">
          Processando: {fileName}
        </span>
      )}
    </div>
  )
}

export default PDFInput