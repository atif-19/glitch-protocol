// AgentLoader.jsx
// Standalone 5-agent pipeline loader component
// Shows each agent activating in sequence with robot animations
// Reusable — can be embedded in GeneratingPage or shown independently

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Scan, Search, PenTool, Puzzle, Globe,
  CheckCircle2, Loader2, Cpu, Sparkles,
  Database, FileText, Layers, Upload
} from 'lucide-react'

const AGENTS = [
  {
    id: 1,
    name: 'The Profiler',
    icon: Scan,
    color: 'cyan',
    description: 'Reading your answers...',
    robotAction: 'Scanning input data stream',
    particles: ['📝', '🔍', '📊', '🧠'],
    progressLabels: ['Extracting names', 'Analyzing emotions', 'Calibrating tone', 'Building profile'],
    duration: 3500,
  },
  {
    id: 2,
    name: 'The Curator',
    icon: Search,
    color: 'purple',
    description: 'Searching component library...',
    robotAction: 'Querying vector database',
    particles: ['🔗', '📚', '🎯', '💎'],
    progressLabels: ['Semantic search', 'Matching aesthetics', 'Filtering by vibe', 'Selecting components'],
    duration: 3500,
  },
  {
    id: 3,
    name: 'The Writer',
    icon: PenTool,
    color: 'amber',
    description: 'Writing cinematic copy...',
    robotAction: 'Generating personalized text',
    particles: ['✍️', '💭', '✨', '📖'],
    progressLabels: ['Crafting headline', 'Writing memories', 'Composing message', 'Polishing tone'],
    duration: 3500,
  },
  {
    id: 4,
    name: 'The Assembler',
    icon: Puzzle,
    color: 'emerald',
    description: 'Assembling the experience...',
    robotAction: 'Injecting variables into components',
    particles: ['🧩', '🏗️', '🎨', '⚡'],
    progressLabels: ['Loading skeleton', 'Filling variables', 'Applying theme', 'Validating output'],
    duration: 3500,
  },
  {
    id: 5,
    name: 'The Keeper',
    icon: Globe,
    color: 'rose',
    description: 'Deploying to the internet...',
    robotAction: 'Publishing unique URL',
    particles: ['🌐', '🔗', '✅', '🚀'],
    progressLabels: ['Generating slug', 'Saving to database', 'Creating link', 'Ready to share'],
    duration: 3500,
  },
]

export default function AgentLoader({ 
  onComplete, 
  onError, 
  generateFunction,
  occasion = 'birthday',
  minDisplayTime = 15000 
}) {
  const [phase, setPhase] = useState(0)
  const [completedPhases, setCompletedPhases] = useState([])
  const [isGenerating, setIsGenerating] = useState(true)
  const [serverSlow, setServerSlow] = useState(false)
  const [allDone, setAllDone] = useState(false)
  const [apiDone, setApiDone] = useState(false)       // ✅ state instead of ref for triggering effects
  const startTimeRef = useRef(Date.now())
  const intervalRef = useRef(null)
  const apiResultRef = useRef(null)
  const completionFiredRef = useRef(false)            // ✅ prevents onComplete firing twice

  // Start the generation API call
  useEffect(() => {
    if (generateFunction) {
      generateFunction()
        .then(result => {
          apiResultRef.current = result
          setApiDone(true)                            // ✅ triggers useEffect below
        })
        .catch(err => {
          if (onError) onError(err)
        })
    }
  }, [])

  // Run the animation phases
  useEffect(() => {
    const runPhases = () => {
      setPhase(prev => {
        const next = prev + 1
        if (next < AGENTS.length) {
          return next
        }
        clearInterval(intervalRef.current)
        return prev
      })
    }

    const phaseDuration = AGENTS[0].duration
    intervalRef.current = setInterval(runPhases, phaseDuration)

    return () => clearInterval(intervalRef.current)
  }, [])

  // Track completed phases
  useEffect(() => {
    if (phase > 0) {
      setCompletedPhases(prev => [...prev, phase - 1])
    }
  }, [phase])

  // Check for slow server
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!apiDone && isGenerating) {
        setServerSlow(true)
      }
    }, 12000)

    return () => clearTimeout(timer)
  }, [isGenerating])

  // ✅ THE FIX: both triggers (phase change AND api done) now correctly re-run this
  // phase is read directly from state, not a stale closure
  // apiDone is state so it actually triggers this effect
  useEffect(() => {
    if (completionFiredRef.current) return
    if (!apiDone) return
    if (phase < AGENTS.length - 1) return

    completionFiredRef.current = true

    const elapsed = Date.now() - startTimeRef.current
    const timeLeft = Math.max(0, minDisplayTime - elapsed)

    setTimeout(() => {
      setAllDone(true)
      setIsGenerating(false)
      if (onComplete) {
        setTimeout(() => onComplete(apiResultRef.current), 800)
      }
    }, timeLeft)

  }, [phase, apiDone])  // ✅ both are real state values now

  const currentAgent = AGENTS[phase] || AGENTS[AGENTS.length - 1]
  const IconComponent = currentAgent.icon
  const isBirthday = occasion === 'birthday'

  return (
    <div className="min-h-screen bg-[#050510] text-white flex flex-col items-center justify-center px-4 sm:px-6 relative overflow-hidden">
      
      {/* Animated background grid */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -120],
              opacity: [0, 0.4, 0],
              scale: [0, 1.2, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Ambient glow */}
      <div className={`absolute top-1/3 -left-20 w-96 h-96 rounded-full blur-[120px] opacity-15 transition-colors duration-1000 bg-${currentAgent.color}-500 pointer-events-none`} />
      <div className={`absolute bottom-1/3 -right-20 w-96 h-96 rounded-full blur-[120px] opacity-15 transition-colors duration-1000 bg-${currentAgent.color}-500 pointer-events-none`} />

      <div className="relative z-10 w-full max-w-3xl">
        
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="inline-flex items-center justify-center mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          >
            <div className="relative">
              <Cpu className="w-10 h-10 text-cyan-400" />
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Sparkles className="w-5 h-5 text-cyan-300" />
              </motion.div>
            </div>
          </motion.div>

          <motion.h2
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {isBirthday ? 'Building Celebration' : 'Patching Protocol'}
          </motion.h2>
          
          <motion.p
            className="text-zinc-500 text-sm font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            5 AI agents assembling your experience
          </motion.p>
        </motion.div>

        {/* Agent Animation Cards */}
        <div className="space-y-3 mb-8">
          {AGENTS.map((agent, i) => {
            const AgentIcon = agent.icon
            const isCompleted = completedPhases.includes(i)
            const isCurrent = phase === i
            const isPending = phase < i

            return (
              <motion.div
                key={agent.id}
                className={`relative rounded-xl border transition-all duration-500 overflow-hidden ${
                  isCompleted
                    ? 'border-emerald-500/20 bg-emerald-500/5 opacity-80'
                    : isCurrent
                    ? `border-${agent.color}-500/40 bg-${agent.color}-500/5 shadow-[0_0_25px_rgba(${
                        agent.color === 'cyan' ? '6,182,212' :
                        agent.color === 'purple' ? '168,85,247' :
                        agent.color === 'amber' ? '245,158,11' :
                        agent.color === 'emerald' ? '16,185,129' : '244,63,94'
                      },0.1)]`
                    : 'border-zinc-800/50 bg-transparent opacity-40'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isPending ? 0.4 : 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {/* Progress bar for current agent */}
                {isCurrent && (
                  <motion.div
                    className={`absolute top-0 left-0 h-0.5 bg-${agent.color}-500/50`}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: agent.duration / 1000, ease: 'linear' }}
                  />
                )}

                <div className="p-4 sm:p-5">
                  <div className="flex items-center gap-4">
                    {/* Agent Icon */}
                    <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center relative overflow-hidden ${
                      isCompleted
                        ? 'bg-emerald-500/10 border border-emerald-500/30'
                        : isCurrent
                        ? `bg-${agent.color}-500/10 border border-${agent.color}-500/30`
                        : 'bg-zinc-900 border border-zinc-800'
                    }`}>
                      {isCurrent && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"
                          animate={{ y: ['-100%', '100%'] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        />
                      )}
                      
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      ) : isCurrent ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        >
                          <AgentIcon className={`w-6 h-6 text-${agent.color}-400`} />
                        </motion.div>
                      ) : (
                        <AgentIcon className="w-6 h-6 text-zinc-600" />
                      )}

                      {isCurrent && agent.particles.map((particle, j) => (
                        <motion.span
                          key={j}
                          className="absolute text-sm pointer-events-none z-10"
                          initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                          animate={{
                            x: Math.cos(j * Math.PI/2) * 40,
                            y: Math.sin(j * Math.PI/2) * 40,
                            opacity: [0, 1, 0],
                            scale: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 2 + j * 0.3,
                            repeat: Infinity,
                            delay: j * 0.5,
                            ease: 'easeInOut',
                          }}
                        >
                          {particle}
                        </motion.span>
                      ))}
                    </div>

                    {/* Agent Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          isCompleted
                            ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5'
                            : isCurrent
                            ? `text-${agent.color}-400 border-${agent.color}-500/30 bg-${agent.color}-500/5`
                            : 'text-zinc-600 border-zinc-800'
                        }`}>
                          AGENT {agent.id}
                        </span>
                        <span className={`text-sm font-bold ${
                          isCurrent ? 'text-white' : 'text-zinc-500'
                        }`}>
                          {agent.name}
                        </span>
                      </div>
                      
                      {isCurrent && (
                        <motion.p
                          className={`text-xs font-mono text-${agent.color}-400/80`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {agent.description}
                        </motion.p>
                      )}
                      
                      {isCompleted && (
                        <p className="text-xs font-mono text-emerald-400/60">
                          Complete
                        </p>
                      )}
                    </div>

                    {/* Status indicator */}
                    <div className="flex-shrink-0">
                      {isCompleted && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200 }}
                        >
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        </motion.div>
                      )}
                      {isCurrent && (
                        <Loader2 className={`w-5 h-5 text-${agent.color}-400 animate-spin`} />
                      )}
                      {isPending && (
                        <div className="w-5 h-5 rounded-full border-2 border-zinc-800" />
                      )}
                    </div>
                  </div>

                  {/* Sub-progress for current agent */}
                  {isCurrent && (
                    <div className="mt-4 pt-4 border-t border-zinc-800/50">
                      <div className="grid grid-cols-2 gap-2">
                        {agent.progressLabels.map((label, j) => (
                          <motion.div
                            key={j}
                            className="flex items-center gap-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: j * 0.2 }}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              j < 2 ? `bg-${agent.color}-400` : 'bg-zinc-700'
                            }`} />
                            <span className={`text-[10px] font-mono ${
                              j < 2 ? 'text-zinc-400' : 'text-zinc-700'
                            }`}>
                              {label}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Server slow message */}
        <AnimatePresence>
          {serverSlow && !apiDone && (
            <motion.div
              className="text-center p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                <span className="text-amber-400 text-sm font-mono">
                  Free tier server waking up...
                </span>
              </div>
              <p className="text-zinc-500 text-xs font-mono">
                Render cold starts take ~30s. Experience loading shortly.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom status */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-zinc-600 text-xs font-mono">
            {allDone 
              ? '✓ Generation complete' 
              : `${phase + 1} of ${AGENTS.length} agents active`}
          </p>
        </motion.div>

      </div>
    </div>
  )
}