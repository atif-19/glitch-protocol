// GeneratingPage.jsx
// Shows while the 5-agent pipeline is running
// Displays each agent activating one by one
// Actually calls the backend /api/generate endpoint
// On success — saves the URL and navigates to share page

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useFlow } from '../context/FlowContext'
import api from '../api/axiosInstance'

const AGENTS = [
  { id: 1, name: 'The Profiler', description: 'Reading your answers...', duration: 3000 },
  { id: 2, name: 'The Curator', description: 'Searching component library...', duration: 2000 },
  { id: 3, name: 'The Writer', description: 'Writing cinematic copy...', duration: 4000 },
  { id: 4, name: 'The Assembler', description: 'Building the page...', duration: 2000 },
  { id: 5, name: 'The Keeper', description: 'Generating your unique link...', duration: 1500 },
]

export default function GeneratingPage() {
  const navigate = useNavigate()
  const { occasion, answers, setGeneratedUrl, setGeneratedSlug } = useFlow()
  const [activeAgent, setActiveAgent] = useState(0) // index into AGENTS array
  const [doneAgents, setDoneAgents] = useState([])
  const [error, setError] = useState(null)
  const [apiDone, setApiDone] = useState(false)

  // Redirect if no occasion
  useEffect(() => {
    if (!occasion) navigate('/occasion')
  }, [])

  // Call the backend as soon as this page loads
  useEffect(() => {
    if (!occasion) return

    const allAnswers = { ...answers, occasion }

    api.post('/api/generate', { answers: allAnswers })
      .then(res => {
        if (res.data.success) {
          setGeneratedUrl(res.data.url)
          setGeneratedSlug(res.data.slug)
          setApiDone(true)
        } else {
          setError('Something went wrong. Please try again.')
        }
      })
      .catch(err => {
        console.error('Generation failed:', err)
        setError('Generation failed. Please try again.')
      })
  }, [])

  // Animate agents progressing — independent of API
  // This gives the user something to watch while the backend works
  useEffect(() => {
    if (activeAgent >= AGENTS.length) return

    const timer = setTimeout(() => {
      setDoneAgents(prev => [...prev, activeAgent])
      setActiveAgent(prev => prev + 1)
    }, AGENTS[activeAgent].duration)

    return () => clearTimeout(timer)
  }, [activeAgent])

  // Once BOTH animation is done AND API is done — go to share page
  useEffect(() => {
    if (apiDone && activeAgent >= AGENTS.length) {
      setTimeout(() => navigate('/share'), 800)
    }
  }, [apiDone, activeAgent])

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">
        <p className="text-red-400 text-lg">{error}</p>
        <button
          onClick={() => navigate('/questions')}
          className="border border-zinc-700 text-white px-8 py-3 hover:border-white transition-colors"
        >
          ← Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">

      <motion.p
        className="text-xs tracking-[0.3em] text-zinc-500 uppercase mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Building her universe
      </motion.p>

      <div className="w-full max-w-md space-y-4">
        {AGENTS.map((agent, i) => {
          const isDone = doneAgents.includes(i)
          const isActive = activeAgent === i
          const isPending = activeAgent < i

          return (
            <motion.div
              key={agent.id}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-500 ${
                isDone
                  ? 'border-zinc-700 bg-zinc-950 opacity-60'
                  : isActive
                  ? 'border-white bg-zinc-950'
                  : 'border-zinc-900 opacity-30'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isPending ? 0.3 : 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {/* Status indicator */}
              <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                {isDone && <span className="text-green-400 text-sm">✓</span>}
                {isActive && (
                  <motion.div
                    className="w-2 h-2 rounded-full bg-white"
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                )}
                {isPending && <div className="w-2 h-2 rounded-full bg-zinc-700" />}
              </div>

              <div>
                <p className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-zinc-500'}`}>
                  Agent {agent.id} — {agent.name}
                </p>
                {isActive && (
                  <motion.p
                    className="text-zinc-400 text-xs mt-0.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {agent.description}
                  </motion.p>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

    </div>
  )
}