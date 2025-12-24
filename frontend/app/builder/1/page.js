'use client';

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import ChatInterface from '@/components/ChatInterface'
import LivePreview from '@/components/LivePreview'
import CodeEditor from '@/components/CodeEditor'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { Code, MessageSquare, Eye } from 'lucide-react'

export default function BuilderPage() {
  const params = useParams()
  const projectId = params.id || 'new'
  const [activeTab, setActiveTab] = useState('chat') // 'chat' | 'code' | 'preview'
  const [code, setCode] = useState(null)

  useEffect(() => {
    // Load project if exists
    if (projectId && projectId !== 'new') {
      // Fetch project data
    }
  }, [projectId])

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-green-900/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {projectId === 'new' ? 'New Project' : 'Project Builder'}
              </h1>
              <p className="text-gray-500 text-sm">
                Build your website with AI assistance
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 bg-gradient-green rounded-lg font-semibold hover:opacity-90 transition">
                Save Project
              </button>
              <button className="px-4 py-2 border border-green-500/50 rounded-lg font-semibold hover:bg-green-500/10 transition">
                Export
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-800 mt-4">
            {[
              { id: 'chat', label: 'AI Chat', icon: <MessageSquare size={16} /> },
              { id: 'code', label: 'Code Editor', icon: <Code size={16} /> },
              { id: 'preview', label: 'Live Preview', icon: <Eye size={16} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium transition ${
                  activeTab === tab.id
                    ? 'border-green-400 text-green-400'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'chat' && (
            <PanelGroup direction="horizontal" className="h-full">
              <Panel defaultSize={60} minSize={40}>
                <ChatInterface projectId={projectId} />
              </Panel>
              <PanelResizeHandle className="w-2 bg-green-900/50 hover:bg-green-500 transition" />
              <Panel defaultSize={40} minSize={30}>
                <LivePreview />
              </Panel>
            </PanelGroup>
          )}

          {activeTab === 'code' && (
            <CodeEditor code={code} onChange={setCode} />
          )}

          {activeTab === 'preview' && (
            <div className="h-full">
              <LivePreview />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
