// LandingPage.jsx
// Redesigned — Futuristic, Agentic, Cyberpunk/Terminal aesthetic
// Eye-catching first impression with glitch effects and pipeline visualization

import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Sparkles, Cpu, Zap, ArrowRight, ChevronRight } from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()
  const [glitchText, setGlitchText] = useState(false)
  const [cursorVisible, setCursorVisible] = useState(true)

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible(v => !v), 600)
    return () => clearInterval(interval)
  }, [])

  // Random glitch trigger
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchText(true)
      setTimeout(() => setGlitchText(false), 200)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const agentNames = ['Profiler', 'Curator', 'Writer', 'Assembler', 'Keeper']

  return (
    <div className="min-h-screen bg-[#050510] text-white flex flex-col items-center justify-center px-4 sm:px-6 relative overflow-hidden selection:bg-cyan-500/30">

      {/* Animated grid background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 70%)',
        }}
      />

      {/* Floating orbs / glow effects */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-red-500/10 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Top-left glitch dot */}
      <motion.div
        className="absolute top-6 left-6 w-3 h-3 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.7)]"
        animate={{ opacity: [1, 0.2, 1], scale: [1, 0.8, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Top-right status indicator */}
      <div className="absolute top-6 right-6 flex items-center gap-2 text-xs font-mono text-zinc-500">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        SYS.ONLINE
      </div>

      <div className="relative z-10 text-center max-w-3xl w-full">

        {/* Terminal-style label */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-mono text-zinc-400 tracking-[0.15em] uppercase">
            The Glitch Protocol <span className="text-zinc-600">v2.0</span>
          </span>
          <span className={`text-cyan-400 transition-opacity ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}>_</span>
        </motion.div>

        {/* Main headline with glitch effect */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.1] mb-6"
          style={{ fontFamily: "'Orbitron', 'Inter', sans-serif" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className={glitchText ? 'text-red-500' : 'text-white transition-colors duration-200'}>
            Because some apologies
          </span>
          <br />
          deserve more than a{' '}
          <span className={`relative inline-block ${glitchText ? 'animate-pulse' : ''}`}>
            <span className="relative z-10 text-cyan-400">
              blue tick.
            </span>
            {/* Glitch offset text */}
            <span 
              className="absolute inset-0 z-0 text-red-500 opacity-70"
              style={{ transform: glitchText ? 'translate(3px, -2px)' : 'translate(0, 0)', transition: 'transform 0.15s' }}
              aria-hidden="true"
            >
              blue tick.
            </span>
            <span 
              className="absolute inset-0 z-0 text-blue-500 opacity-70"
              style={{ transform: glitchText ? 'translate(-3px, 2px)' : 'translate(0, 0)', transition: 'transform 0.15s' }}
              aria-hidden="true"
            >
              blue tick.
            </span>
          </span>
        </motion.h1>

        {/* Subheading — explains what the product does */}
        <motion.p
          className="text-zinc-400 text-lg md:text-xl mb-4 leading-relaxed max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          An <span className="text-white font-medium">AI-driven platform</span> that turns your personal message into a 
          <span className="text-cyan-400"> cinematic web experience</span> —
          built by a 5-agent pipeline, delivered as a unique link.
        </motion.p>

        {/* Agent Pipeline Visualization */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {agentNames.map((name, i) => (
            <motion.div
              key={name}
              className="flex items-center gap-1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.12 }}
            >
              {/* Agent badge */}
              <div className="group relative flex flex-col items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border border-zinc-700/50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                  <span className="text-[10px] sm:text-xs font-mono text-cyan-400 font-semibold group-hover:text-cyan-300 transition-colors">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] font-mono text-zinc-600 mt-1.5 uppercase tracking-wider group-hover:text-zinc-400 transition-colors">
                  {name}
                </span>
              </div>
              {/* Connector arrow */}
              {i < agentNames.length - 1 && (
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-zinc-700 -ml-1 -mr-1 sm:ml-0 sm:mr-0 mt-[-10px]" />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Stats / Social Proof */}
        <motion.div
          className="flex items-center justify-center gap-6 sm:gap-8 mb-10 text-xs text-zinc-600 font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-yellow-500" />
            <span>Under 15s</span>
          </div>
          <div className="w-px h-4 bg-zinc-800" />
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>5 AI Agents</span>
          </div>
          <div className="w-px h-4 bg-zinc-800" />
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-500">●</span>
            <span>174 Components</span>
          </div>
        </motion.div>

        {/* CTA Button — Futuristic style */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <motion.button
            onClick={() => navigate('/occasion')}
            className="group relative px-8 py-4 bg-cyan-500 text-black font-bold text-base uppercase tracking-wider font-mono overflow-hidden transition-all duration-300 hover:bg-white"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Button glitch effect overlay */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700" />
            <span className="relative z-10 flex items-center gap-2">
              Start Building <ArrowRight className="w-4 h-4" />
            </span>
          </motion.button>
          
          <p className="text-zinc-600 text-xs font-mono">
            No account required • Free forever
          </p>
        </motion.div>

        {/* Bottom decorative scan line */}
        <motion.div
          className="mt-12 h-px w-full max-w-md mx-auto bg-gradient-to-r from-transparent via-zinc-800 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        />
        <p className="text-zinc-700 text-[10px] font-mono mt-3">
          ENGINEERED FOR EMOTIONAL RESONANCE — NOT SPAM
        </p>
      </div>
    </div>
  )
}