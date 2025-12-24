'use client';

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  Home, 
  LayoutDashboard, 
  Code2, 
  Folder, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FileCode,
  Zap
} from 'lucide-react'
import ModelSelector from './ModelSelector'

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    { icon: <Home size={20} />, label: 'Home', href: '/dashboard' },
    { icon: <Code2 size={20} />, label: 'Builder', href: '/builder/new' },
    { icon: <Folder size={20} />, label: 'Projects', href: '/dashboard' },
    { icon: <FileCode size={20} />, label: 'Templates', href: '/templates' },
    { icon: <Settings size={20} />, label: 'Settings', href: '/settings' },
  ]

  return (
    <div className={`flex flex-col h-screen bg-black border-r border-green-900/50 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo */}
      <div className="p-6 border-b border-green-900/50">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-green rounded-lg"></div>
              <span className="text-xl font-bold gradient-text">CodeVault</span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-gradient-green rounded-lg mx-auto"></div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-green-400"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </div>

      {/* Model Selector */}
      {!collapsed && (
        <div className="p-4">
          <ModelSelector collapsed={collapsed} />
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start'} gap-3 p-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'text-gray-400 hover:text-green-400 hover:bg-gray-900'
                  }`}
                >
                  {item.icon}
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Quick Actions */}
        {!collapsed && (
          <div className="mt-8">
            <h3 className="text-xs uppercase text-gray-500 font-semibold mb-3 px-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 bg-gradient-green/10 text-green-400 rounded-lg border border-green-500/30 hover:bg-gradient-green/20 transition">
                <Sparkles size={18} />
                <span className="font-medium">New Project</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/30 hover:bg-blue-500/20 transition">
                <Zap size={18} />
                <span className="font-medium">AI Assistant</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-green-900/50">
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-green rounded-full"></div>
              <div>
                <p className="font-medium">John Doe</p>
                <p className="text-xs text-gray-500">Pro Plan</p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-red-400">
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 bg-gradient-green rounded-full"></div>
            <button className="text-gray-400 hover:text-red-400">
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
