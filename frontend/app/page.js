'use client';

import { motion } from 'framer-motion'
import { ArrowRight, Code, Zap, Globe, Shield, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  const features = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "AI-Powered Generation",
      description: "Generate complete websites with any of three AI models: ChatGPT, Claude, or DeepSeek."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Preview",
      description: "See your website come to life instantly with our live preview sandbox."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Full Stack Support",
      description: "Generate HTML, CSS, JS, React, Next.js, and backend APIs."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Private",
      description: "Your API keys are encrypted and never exposed. Projects are stored securely."
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Smart Templates",
      description: "Start with professionally designed templates for any type of website."
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-lg z-50 border-b border-green-900/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-green rounded-lg"></div>
              <span className="text-2xl font-bold gradient-text">CodeVault</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/auth/login" className="text-gray-300 hover:text-green-400 transition">
                Login
              </Link>
              <Link href="/auth/signup" className="bg-gradient-green px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Build <span className="gradient-text">Any Website</span>
              <br />
              With <span className="neon-glow">AI Power</span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
              CodeVault is the ultimate AI website builder. Generate complete, production-ready websites 
              using ChatGPT, Claude, or DeepSeek. No coding experience required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/auth/signup" 
                className="bg-gradient-green px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:scale-105 transition"
              >
                Start Building Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/templates" 
                className="border border-green-500/50 px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-500/10 transition"
              >
                Browse Templates
              </Link>
            </div>
          </motion.div>

          {/* Preview Demo */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-20 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-transparent blur-3xl"></div>
            <div className="relative bg-codevault-medium-gray rounded-2xl border border-green-500/30 p-2">
              <div className="bg-black rounded-xl overflow-hidden">
                {/* Mock builder interface */}
                <div className="flex h-96">
                  <div className="w-1/3 border-r border-gray-800 p-4">
                    <div className="h-10 bg-gray-800 rounded-lg mb-4"></div>
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-4 bg-gray-800 rounded animate-pulse"></div>
                      ))}
                    </div>
                  </div>
                  <div className="w-2/3 bg-gray-900">
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-green rounded-full mx-auto mb-4 flex items-center justify-center">
                          <Sparkles className="w-8 h-8 text-black" />
                        </div>
                        <p className="text-green-400 font-semibold">Live Preview Active</p>
                        <p className="text-gray-400 text-sm mt-2">Website generated in real-time</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Why <span className="gradient-text">CodeVault</span>?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-codevault-dark-gray p-6 rounded-xl border border-gray-800 hover:border-green-500/50 transition group"
              >
                <div className="w-12 h-12 bg-gradient-green rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-black/50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            How It <span className="gradient-text">Works</span>
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {[
                { step: "1", title: "Describe Your Vision", desc: "Tell our AI what website you want to build. Be as detailed or simple as you like." },
                { step: "2", title: "AI Generates Code", desc: "Choose between ChatGPT, Claude, or DeepSeek to generate complete website code." },
                { step: "3", title: "Live Preview", desc: "Watch your website come to life instantly in our real-time preview sandbox." },
                { step: "4", title: "Edit & Refine", desc: "Ask the AI to modify your site, or tweak the code manually. Download when ready." }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="flex items-start gap-6"
                >
                  <div className="w-12 h-12 bg-gradient-green rounded-full flex items-center justify-center font-bold text-black text-xl shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-400">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-black via-codevault-dark-gray to-black rounded-3xl p-12 border border-green-500/30"
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Build <span className="neon-glow">Amazing Websites</span>?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of developers, designers, and entrepreneurs creating with AI.
            </p>
            <Link 
              href="/auth/signup" 
              className="inline-flex items-center gap-2 bg-gradient-green px-10 py-4 rounded-xl font-bold text-lg hover:scale-105 transition"
            >
              Start Free Today
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-gray-500 mt-6">No credit card required • Free forever plan</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-900 py-8 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-green rounded"></div>
              <span className="text-xl font-bold">CodeVault</span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2024 CodeVault AI. Building the future of web development.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
