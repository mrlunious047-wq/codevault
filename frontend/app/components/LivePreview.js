'use client';

import { useState, useEffect, useRef } from 'react'
import { RefreshCw, Maximize2, Minimize2, Download, Code } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function LivePreview({ initialCode }) {
  const [code, setCode] = useState(initialCode || {
    html: '<!DOCTYPE html>\n<html>\n<head>\n    <title>CodeVault Website</title>\n    <style>\n        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #0a0a0a; color: white; }\n        .container { max-width: 1200px; margin: 0 auto; }\n        .hero { text-align: center; padding: 80px 20px; }\n        .hero h1 { color: #00ff00; font-size: 3em; margin-bottom: 20px; }\n        .hero p { color: #888; font-size: 1.2em; max-width: 600px; margin: 0 auto; }\n    </style>\n</head>\n<body>\n    <div class="container">\n        <div class="hero">\n            <h1>Welcome to Your Website</h1>\n            <p>Generated with CodeVault AI. Start building amazing websites with AI power.</p>\n            <div style="margin-top: 40px;">\n                <button style="background: #00ff00; color: black; border: none; padding: 12px 30px; font-size: 16px; border-radius: 8px; cursor: pointer;">Get Started</button>\n            </div>\n        </div>\n    </div>\n</body>\n</html>',
    css: '',
    js: ''
  })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const iframeRef = useRef(null)

  // Listen for code updates from chat
  useEffect(() => {
    const handleCodeUpdate = (event) => {
      if (event.detail?.code) {
        setCode(event.detail.code)
        toast.success('Preview updated!')
      }
    }

    window.addEventListener('code-update', handleCodeUpdate)
    return () => window.removeEventListener('code-update', handleCodeUpdate)
  }, [])

  const generatePreviewHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>CodeVault Preview</title>
          <style>
              ${code.css}
              body {
                  margin: 0;
                  padding: 0;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
              }
              * {
                  box-sizing: border-box;
              }
          </style>
      </head>
      <body>
          ${code.html}
          <script>
              ${code.js}
              // Prevent navigation from iframe
              if (window.location !== window.parent.location) {
                  document.addEventListener('click', function(e) {
                      if (e.target.tagName === 'A') {
                          e.preventDefault();
                          console.log('Link clicked:', e.target.href);
                      }
                  });
              }
          </script>
      </body>
      </html>
    `
  }

  const refreshPreview = () => {
    if (iframeRef.current) {
      iframeRef.current.src = 'about:blank'
      setTimeout(() => {
        const html = generatePreviewHTML()
        const blob = new Blob([html], { type: 'text/html' })
        iframeRef.current.src = URL.createObjectURL(blob)
      }, 100)
    }
  }

  const downloadCode = () => {
    const zip = new JSZip()
    
    if (code.html) zip.file('index.html', code.html)
    if (code.css) zip.file('styles.css', code.css)
    if (code.js) zip.file('script.js', code.js)
    if (code.react) zip.file('App.jsx', code.react)
    
    zip.generateAsync({ type: 'blob' }).then((content) => {
      const link = document.createElement('a')
      link.href = URL.createObjectURL(content)
      link.download = 'codevault-project.zip'
      link.click()
      toast.success('Project downloaded!')
    })
  }

  useEffect(() => {
    refreshPreview()
  }, [code])

  return (
    <div className={`flex flex-col h-full bg-black ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Preview Header */}
      <div className="p-4 border-b border-green-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-green rounded-lg flex items-center justify-center">
              <Code size={18} className="text-black" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Live Preview</h2>
              <p className="text-sm text-gray-500">Real-time website preview</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshPreview}
              className="p-2 text-gray-400 hover:text-green-400 rounded-lg hover:bg-gray-900"
              title="Refresh preview"
            >
              <RefreshCw size={18} />
            </button>
            <button
              onClick={downloadCode}
              className="p-2 text-gray-400 hover:text-green-400 rounded-lg hover:bg-gray-900"
              title="Download project"
            >
              <Download size={18} />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-gray-400 hover:text-green-400 rounded-lg hover:bg-gray-900"
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
        </div>
        
        {/* Viewport Selector */}
        <div className="flex items-center gap-2 mt-4">
          <div className="text-xs text-gray-500">Viewport:</div>
          <div className="flex bg-gray-900 rounded-lg p-1">
            {['Desktop', 'Tablet', 'Mobile'].map((size) => (
              <button
                key={size}
                className="px-3 py-1 text-xs rounded-md hover:bg-gray-800"
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preview Container */}
      <div className="flex-1 relative bg-gray-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full">
            <iframe
              ref={iframeRef}
              className="w-full h-full border-0"
              title="Website Preview"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              referrerPolicy="no-referrer"
            />
            {/* Loading overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 hidden">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-150"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Preview Info Bar */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-lg rounded-lg px-4 py-2 border border-green-500/30">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-300">Live Preview Active</span>
            </div>
            <div className="text-gray-500">|</div>
            <div className="text-gray-400">
              Updates in real-time
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
