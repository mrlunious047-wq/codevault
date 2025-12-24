'use client';

import { useState } from 'react'
import { Brain, Zap, Cpu } from 'lucide-react'
import { useAI } from '@/contexts/AIContext'

export default function ModelSelector({ collapsed }) {
  const { selectedModel, setSelectedModel } = useAI()
  
  const models = [
    {
      id: 'gpt-4',
      name: 'ChatGPT-4',
      description: 'Most capable model',
      icon: <Brain size={16} />,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'claude-3',
      name: 'Claude 3',
      description: 'Creative & detailed',
      icon: <Zap size={16} />,
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'deepseek',
      name: 'DeepSeek',
      description: 'Fast & efficient',
      icon: <Cpu size={16} />,
      color: 'from-blue-500 to-cyan-600'
    }
  ]

  return (
    <div className="space-y-3">
      {!collapsed && (
        <h3 className="text-xs uppercase text-gray-500 font-semibold">
          AI Model
        </h3>
      )}
      <div className={`space-y-2 ${collapsed ? '' : 'p-2 bg-gray-900/50 rounded-lg'}`}>
        {models.map((model) => (
          <button
            key={model.id}
            onClick={() => setSelectedModel(model.id)}
            className={`w-full flex ${collapsed ? 'justify-center' : 'justify-start'} items-center gap-3 p-3 rounded-lg transition-all ${
              selectedModel === model.id
                ? 'bg-gray-800 border border-gray-700'
                : 'hover:bg-gray-800/50'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${model.color} flex items-center justify-center`}>
              {model.icon}
            </div>
            {!collapsed && (
              <div className="flex-1 text-left">
                <p className="font-medium text-sm">{model.name}</p>
                <p className="text-xs text-gray-500">{model.description}</p>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
