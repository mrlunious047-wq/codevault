'use client';

import { useState, useRef, useEffect } from 'react'
import { Send, Copy, RefreshCw, Bot, User, Sparkles } from 'lucide-react'
import SyntaxHighlighter from './SyntaxHighlighter'
import { toast } from 'react-hot-toast'
import { useAI } from '@/contexts/AIContext'

export default function ChatInterface({ projectId }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hello! I'm CodeVault AI. What website would you like me to build for you today? I can generate complete HTML, CSS, JS, React, or even backend APIs. Just describe your vision!",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const { selectedModel, generateCode } = useAI()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await generateCode(input, selectedModel, projectId)
      
      const aiMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: response.rawResponse || 'Generated your website!',
        code: response.code,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
      
      // Trigger preview update via event
      if (response.code) {
        window.dispatchEvent(new CustomEvent('code-update', {
          detail: { code: response.code }
        }))
      }

    } catch (error) {
      toast.error(error.message || 'Failed to generate code')
    } finally {
      setIsLoading(false)
    }
  }

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
    toast.success('Code copied to clipboard!')
  }

  const regenerate = async (messageId) => {
    const message = messages.find(m => m.id === messageId - 1)
    if (message?.content) {
      setInput(message.content)
      // Trigger resend
      setTimeout(() => {
        document.querySelector('form')?.dispatchEvent(new Event('submit'))
      }, 100)
    }
  }

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Chat Header */}
      <div className="p-4 border-b border-green-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-green rounded-lg flex items-center justify-center">
              <Sparkles size={18} className="text-black" />
            </div>
            <div>
              <h2 className="font-bold text-lg">CodeVault AI</h2>
              <p className="text-sm text-gray-500">Powered by {selectedModel}</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {messages.length} messages
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              message.role === 'user' 
                ? 'bg-blue-500/20 border border-blue-500/30' 
                : 'bg-gradient-green'
            }`}>
              {message.role === 'user' ? (
                <User size={16} className="text-blue-400" />
              ) : (
                <Bot size={16} className="text-black" />
              )}
            </div>

            {/* Message Content */}
            <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
              <div className={`inline-block max-w-3xl rounded-2xl p-4 ${
                message.role === 'user'
                  ? 'bg-blue-500/10 border border-blue-500/20'
                  : 'bg-gray-900 border border-gray-800'
              }`}>
                <p className="whitespace-pre-wrap">{message.content}</p>
                
                {/* Code Blocks */}
                {message.code && (
                  <div className="mt-4 space-y-4">
                    {message.code.html && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-400">HTML</span>
                          <button
                            onClick={() => copyCode(message.code.html)}
                            className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300"
                          >
                            <Copy size={12} /> Copy
                          </button>
                        </div>
                        <SyntaxHighlighter language="html" code={message.code.html} />
                      </div>
                    )}
                    
                    {message.code.css && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-400">CSS</span>
                          <button
                            onClick={() => copyCode(message.code.css)}
                            className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300"
                          >
                            <Copy size={12} /> Copy
                          </button>
                        </div>
                        <SyntaxHighlighter language="css" code={message.code.css} />
                      </div>
                    )}
                    
                    {message.code.js && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-400">JavaScript</span>
                          <button
                            onClick={() => copyCode(message.code.js)}
                            className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300"
                          >
                            <Copy size={12} /> Copy
                          </button>
                        </div>
                        <SyntaxHighlighter language="javascript" code={message.code.js} />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Message Actions */}
              <div className={`flex items-center gap-3 mt-2 ${message.role === 'user' ? 'justify-end' : ''}`}>
                <span className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {message.role === 'assistant' && message.code && (
                  <button
                    onClick={() => regenerate(message.id)}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-green-400"
                  >
                    <RefreshCw size={12} /> Regenerate
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-gradient-green rounded-full flex items-center justify-center">
              <Bot size={16} className="text-black" />
            </div>
            <div className="flex-1">
              <div className="inline-block rounded-2xl p-4 bg-gray-900 border border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-150"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-300"></div>
                  <span className="text-sm text-gray-400 ml-2">AI is generating your website...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-green-900/50">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe the website you want to build (e.g., 'Create a modern portfolio website with dark theme')"
              className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 px-4 pr-12 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-400 disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Press Enter to send • Shift+Enter for new line
        </p>
      </form>
    </div>
  )
}
