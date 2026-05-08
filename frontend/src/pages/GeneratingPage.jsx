// GeneratingPage.jsx (simplified — uses AgentLoader component)
// Shows while the 5-agent pipeline is running
// Uses the reusable AgentLoader component

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useFlow } from '../context/FlowContext'
import api from '../api/axiosInstance'
import AgentLoader from '../components/AgentLoader'

export default function GeneratingPage() {
  const navigate = useNavigate()
  const { occasion, answers, setGeneratedUrl, setGeneratedSlug } = useFlow()
  const [error, setError] = useState(null)

  // Redirect if no occasion
  useEffect(() => {
    if (!occasion) navigate('/occasion')
  }, [occasion])

  // The generate function to pass to AgentLoader
  async function generateFunction() {
    const allAnswers = { ...answers, occasion }
    const res = await api.post('/api/generate', { answers: allAnswers })
    
    if (!res.data.success) {
      throw new Error(res.data.debug || 'Generation failed')
    }
    
    return res.data
  }

  // Handle successful completion
  function handleComplete(result) {
    setGeneratedUrl(result.url)
    setGeneratedSlug(result.slug)
    setTimeout(() => navigate('/share'), 600)
  }

  // Handle errors
  function handleError(err) {
    const msg = err.response?.data?.debug || err.message
    if (msg?.includes('quota') || msg?.includes('rate')) {
      setError('AI quota exceeded. Wait 60 seconds and try again.')
    } else if (msg?.includes('timeout')) {
      setError('Request timed out. The AI took too long. Please retry.')
    } else {
      setError('Generation failed. You can retry — your answers are saved.')
    }
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#050510] text-white flex flex-col items-center justify-center gap-6 px-6">
        <motion.div
          className="text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-5xl mb-6">⚠</div>
          <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            Protocol Interrupted
          </h2>
          <p className="text-zinc-400 text-sm mb-8 leading-relaxed">{error}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setError(null)
                window.location.reload()
              }}
              className="bg-white text-black px-8 py-3 font-semibold hover:bg-zinc-200 transition-colors font-mono tracking-wide"
            >
              Retry Generation
            </button>
            <button
              onClick={() => navigate('/questions')}
              className="border border-zinc-700 text-zinc-400 px-8 py-3 hover:border-white hover:text-white transition-colors text-sm"
            >
              ← Edit Answers
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // Show the agent loader
  return (
    <AgentLoader
      generateFunction={generateFunction}
      onComplete={handleComplete}
      onError={handleError}
      occasion={occasion}
      minDisplayTime={15000}
    />
  )
}