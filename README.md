# 🌟 Iluminus - Chat com IA usando Ollama

<div align="center">

![Iluminus Logo](https://img.shields.io/badge/Iluminus-Chat%20IA-2563eb?style=for-the-badge&logo=react&logoColor=white)

**Uma aplicação de chat moderna e intuitiva para interagir com modelos de IA locais usando Ollama**

[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0.4-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

[Recursos](#-recursos) • [Instalação](#-instalação) • [Configuração](#%EF%B8%8F-configuração) • [Uso](#-uso) • [Tecnologias](#-tecnologias)

</div>

---

## 📖 Sobre o Projeto

**Iluminus** é uma aplicação web de chat desenvolvida em React que permite interagir com modelos de linguagem de IA executados localmente através do [Ollama](https://ollama.ai/). A aplicação oferece uma interface moderna, intuitiva e rica em recursos para conversas com múltiplos modelos simultaneamente.

### 🎯 Principais Diferenciais

- 💬 **Conversas Persistentes**: Histórico de conversas armazenado localmente usando IndexedDB
- 🎨 **Interface Moderna**: Design clean e responsivo com tema claro/escuro
- 🔄 **Streaming em Tempo Real**: Respostas renderizadas em tempo real conforme são geradas
- 🤖 **Múltiplos Modelos**: Suporte para conversar com vários modelos simultaneamente
- 📝 **Formatação de Código**: Syntax highlighting para blocos de código nas respostas
- 📄 **Upload de PDFs**: Funcionalidade para análise de documentos PDF (em desenvolvimento)
- 🧠 **Contexto Inteligente**: Mantém contexto das últimas 10 mensagens da conversa
- 🛑 **Controle de Geração**: Capacidade de parar a geração de respostas a qualquer momento

---

## ✨ Recursos

### 💡 Funcionalidades Principais

| Recurso | Descrição |
|---------|-----------|
| **Chat Inteligente** | Interface de chat com suporte a streaming de respostas em tempo real |
| **Gerenciamento de Conversas** | Crie, selecione e exclua conversas organizadas por data |
| **Seleção de Modelos** | Escolha entre diferentes modelos de IA disponíveis no Ollama |
| **Temas Personalizados** | Alterne entre modo claro e escuro conforme sua preferência |
| **Formatação Avançada** | Suporte completo para Markdown e syntax highlighting de código |
| **Histórico Persistente** | Todas as conversas são salvas localmente no navegador |
| **Contexto de Conversa** | Sistema inteligente de contexto para respostas mais relevantes |
| **Upload de Documentos** | Prepare documentos PDF para análise (feature em desenvolvimento) |

### 🎨 Interface do Usuário

- **Sidebar Colapsável**: Navegue entre conversas de forma eficiente
- **Agrupamento por Data**: Conversas organizadas em "Hoje", "Ontem", "Última Semana" e "Mais Antigas"
- **Indicadores Visuais**: Feedback visual durante carregamento e streaming
- **Design Responsivo**: Funciona perfeitamente em diferentes tamanhos de tela

---

## 🚀 Instalação

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior) - [Download](https://nodejs.org/)
- **npm** ou **yarn** (gerenciador de pacotes)
- **Ollama** instalado e rodando localmente - [Instruções de instalação](https://ollama.ai/)

### Passos de Instalação

1️⃣ **Clone o repositório**
```bash
git clone https://github.com/tviniciusas/chat_ollama_api.git
cd chat_ollama_api/chat-ollama
```

2️⃣ **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3️⃣ **Baixe um modelo no Ollama**
```bash
# Exemplo com o modelo qwen2.5-coder
ollama pull qwen2.5-coder:14b

# Outros modelos populares
ollama pull llama2
ollama pull mistral
ollama pull codellama
```

4️⃣ **Inicie o servidor de desenvolvimento**
```bash
npm run dev
# ou
yarn dev
```

5️⃣ **Acesse a aplicação**

Abra seu navegador e acesse: `http://localhost:5173`

---

## ⚙️ Configuração

### Configuração da API Ollama

Por padrão, a aplicação está configurada para conectar ao Ollama em:
```
http://192.168.0.210:11434/api/generate
```

Para alterar o endpoint da API, edite o arquivo `src/App.jsx`:

```javascript
// Linha ~106
const response = await fetch('http://SEU_IP:11434/api/generate', {
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
```

### Configuração de Modelos

Para modificar o modelo padrão, edite a linha no `src/App.jsx`:

```javascript
const [selectedModels, setSelectedModels] = useState(['qwen2.5-coder:14b'])
```

Substitua `'qwen2.5-coder:14b'` pelo modelo de sua preferência.

---

## 🎯 Uso

### Iniciando uma Conversa

1. **Nova Conversa**: Clique no botão "Nova Conversa" na sidebar
2. **Digite sua Mensagem**: Use o campo de entrada na parte inferior
3. **Envie**: Pressione Enter ou clique no botão de enviar
4. **Aguarde a Resposta**: A resposta será renderizada em tempo real

### Gerenciando Conversas

- **Selecionar Conversa**: Clique em qualquer conversa na sidebar
- **Excluir Conversa**: Clique no ícone de lixeira ao lado da conversa
- **Organização Automática**: Conversas são agrupadas por data automaticamente

### Alternando Temas

Clique no ícone de sol/lua no canto superior direito para alternar entre modo claro e escuro.

### Trabalhando com Código

A aplicação detecta e formata automaticamente blocos de código nas respostas:

````markdown
```javascript
function exemplo() {
  console.log("Olá, mundo!");
}
```
````

### Parando a Geração

Se uma resposta estiver muito longa, clique no botão "Parar Geração" para interromper o streaming.

---

## 🛠️ Tecnologias

### Core Technologies

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **React** | 19.1.0 | Biblioteca para construção da interface |
| **Vite** | 7.0.4 | Build tool e dev server |
| **JavaScript** | ES6+ | Linguagem de programação |

### Dependências Principais

```json
{
  "react": "^19.1.0",
  "react-dom": "^19.1.0",
  "xlsx": "^0.18.5"
}
```

### Ferramentas de Desenvolvimento

- **ESLint**: Linting e análise de código
- **Vite Plugin React**: Plugin para suporte React no Vite
- **IndexedDB**: Banco de dados do navegador para persistência

### APIs e Serviços

- **Ollama API**: Interface para modelos de IA locais
- **IndexedDB API**: Armazenamento local de conversas

---

## 📁 Estrutura do Projeto

```
chat-ollama/
├── public/
│   ├── favicon.ico
│   └── favicon.png
├── src/
│   ├── components/
│   │   ├── ChatWindow.jsx      # Janela de exibição de mensagens
│   │   ├── MessageInput.jsx    # Campo de entrada de mensagens
│   │   ├── ModelSelector.jsx   # Seletor de modelos
│   │   ├── ThemeToggle.jsx     # Botão de alternar tema
│   │   ├── Sidebar.jsx         # Barra lateral de conversas
│   │   └── PDFInput.jsx        # Upload de arquivos PDF
│   ├── hooks/
│   │   ├── useTheme.js         # Hook para gerenciamento de tema
│   │   └── useConversations.js # Hook para gerenciamento de conversas
│   ├── utils/
│   │   ├── db.js               # Operações IndexedDB
│   │   └── messageParser.js    # Parser de mensagens e código
│   ├── App.jsx                  # Componente principal
│   ├── main.jsx                 # Ponto de entrada
│   ├── App.css                  # Estilos principais
│   └── index.css                # Estilos globais
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

---

## 🔧 Scripts Disponíveis

```bash
# Modo de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Lint do código
npm run lint
```

---

## 🌐 Compatibilidade

### Navegadores Suportados

- ✅ Chrome/Edge (versões recentes)
- ✅ Firefox (versões recentes)
- ✅ Safari (versões recentes)
- ✅ Opera (versões recentes)

### Requisitos de Sistema

- **Navegador**: Suporte a ES6+ e IndexedDB
- **Ollama**: Rodando localmente ou em rede acessível
- **Memória**: Depende do modelo escolhido (mínimo 8GB RAM recomendado)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga o fluxo de trabalho Gitflow documentado em `gitflow.md`.

### Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📝 Roadmap

### Em Desenvolvimento

- [ ] Extração real de texto de PDFs
- [ ] Suporte a upload de imagens
- [ ] Exportação de conversas (JSON, MD, TXT)
- [ ] Busca no histórico de conversas
- [ ] Configurações de temperatura e parâmetros do modelo

### Planejado

- [ ] Suporte a plugins
- [ ] Integração com outros providers de IA
- [ ] Modo de voz (speech-to-text e text-to-speech)
- [ ] Compartilhamento de conversas
- [ ] Sincronização em nuvem (opcional)

---

## 🐛 Problemas Conhecidos

- A funcionalidade de PDF está em modo simulação (necessita backend)
- Conversas são armazenadas apenas localmente (podem ser perdidas ao limpar dados do navegador)

---

## 📄 Licen��a

Este projeto está sob licença aberta. Sinta-se livre para usar, modificar e distribuir.

---

## 👨‍💻 Autor

**[@tviniciusas](https://github.com/tviniciusas)**

---

## 🙏 Agradecimentos

- [Ollama](https://ollama.ai/) - Por fornecer uma maneira simples de executar LLMs localmente
- [React](https://reactjs.org/) - Pela excelente biblioteca de UI
- [Vite](https://vitejs.dev/) - Pelo build tool extremamente rápido
- Comunidade open-source - Por todas as ferramentas incríveis

---

<div align="center">

**⭐ Se este projeto foi útil para você, considere dar uma estrela!**

**Made with ❤️ and ☕**

</div>
