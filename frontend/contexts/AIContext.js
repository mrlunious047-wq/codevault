'use client';

import { createContext, useContext, useState, useCallback } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const AIContext = createContext()

export function AIProvider({ children }) {
  const [selectedModel, setSelectedModel] = useState('gpt-4')
  const [isGenerating, setIsGenerating] = useState(false)
  const [history, setHistory] = useState([])

  const generateCode = useCallback(async (prompt, model = selectedModel, projectId = null) => {
    setIsGenerating(true)
    try {
      const response = await axios.post('/api/ai/generate', {
        prompt,
        model,
        context: { history },
        projectId
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      setHistory(prev => [...prev, {
        role: 'user',
        content: prompt
      }, {
        role: 'assistant',
        content: response.data.rawResponse,
        code: response.data.code
      }])

      return response.data
    } catch (error) {
      console.error('AI Generation Error:', error)
      toast.error(error.response?.data?.error || 'Failed to generate code')
      throw error
    } finally {
      setIsGenerating(false)
    }
  }, [selectedModel, history])

  const modifyCode = useCallback(async (code, modifications, model = selectedModel) => {
    try {
      const response = await axios.post('/api/ai/modify', {
        code,
        modifications,
        model
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      return response.data
    } catch (error) {
      console.error('Modification Error:', error)
      toast.error(error.response?.data?.error || 'Failed to modify code')
      throw error
    }
  }, [selectedModel])

  const clearHistory = () => {
    setHistory([])
  }

  return (
    <AIContext.Provider value={{
      selectedModel,
      setSelectedModel,
      isGenerating,
      generateCode,
      modifyCode,
      history,
      clearHistory
    }}>
      {children}
    </AIContext.Provider>
  )
}

export const useAI = () => {
  const context = useContext(AIContext)
  if (!context) {
    throw new Error('useAI must be used within an AIProvider')
  }
  return context
}
