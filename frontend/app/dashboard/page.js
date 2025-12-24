'use client';

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Folder, 
  Clock, 
  Star, 
  Search,
  Grid,
  List,
  Filter
} from 'lucide-react'
import ProjectCard from '@/components/ProjectCard'
import Sidebar from '@/components/Sidebar'

export default function DashboardPage() {
  const [projects, setProjects] = useState([])
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Fetch projects
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setProjects(data.projects)
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    }
  }

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="border-b border-green-900/50 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
              <p className="text-gray-400">Build amazing websites with AI assistance</p>
            </div>
            <Link
              href="/builder/new"
              className="bg-gradient-green px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 transition"
            >
              <Plus size={20} />
              New Project
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Projects', value: projects.length, icon: <Folder />, color: 'text-blue-400' },
              { label: 'Active Today', value: '3', icon: <Clock />, color: 'text-green-400' },
              { label: 'Favorites', value: '5', icon: <Star />, color: 'text-yellow-400' },
              { label: 'AI Generations', value: '127', icon: <Filter />, color: 'text-purple-400' }
            ].map((stat, index) => (
              <div key={index} className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </div>
                  <div className={`p-2 rounded-lg bg-gray-800 ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold">Recent Projects</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-green-500 w-64"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-gray-800 text-green-400' : 'text-gray-400 hover:text-green-400'}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-gray-800 text-green-400' : 'text-gray-400 hover:text-green-400'}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {filteredProjects.length > 0 ? (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
              {filteredProjects.map((project) => (
                <ProjectCard key={project._id} project={project} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-gray-800 rounded-2xl">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Folder className="text-gray-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
              <p className="text-gray-400 mb-6">Create your first AI-generated website</p>
              <Link
                href="/builder/new"
                className="bg-gradient-green px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 hover:opacity-90 transition"
              >
                <Plus size={20} />
                Create First Project
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
