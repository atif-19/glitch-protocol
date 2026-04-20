// OccasionPage.jsx
// User picks Birthday or Apology
// This choice drives the entire page theme, tone, and which questions appear
// After picking, save to FlowContext and go to questions

import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useFlow } from '../context/FlowContext'

const occasions = [
  {
    id: 'birthday',
    emoji: '🎂',
    title: 'Birthday',
    description: 'A tribute. A celebration. A personalized universe built just for them.',
    bg: 'from-amber-950 to-black',
    accent: 'text-amber-400',
    border: 'border-amber-800 hover:border-amber-400',
  },
  {
    id: 'apology',
    emoji: '🩹',
    title: 'Apology',
    description: 'Not a text. Not a voice note. A cinematic patch update to a logic error.',
    bg: 'from-blue-950 to-black',
    accent: 'text-blue-400',
    border: 'border-blue-800 hover:border-blue-400',
  }
]

export default function OccasionPage() {
  const navigate = useNavigate()
  const { setOccasion } = useFlow()

  function handleSelect(id) {
    setOccasion(id)
    navigate('/questions')
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">

      <motion.p
        className="text-xs tracking-[0.3em] text-zinc-500 uppercase mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Step 1 of 2
      </motion.p>

      <motion.h2
        className="text-3xl md:text-5xl font-bold mb-3 text-center"
        style={{ fontFamily: 'Playfair Display, serif' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        What are we building?
      </motion.h2>

      <motion.p
        className="text-zinc-500 mb-14 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Choose the occasion. Everything changes from here.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {occasions.map((o, i) => (
          <motion.button
            key={o.id}
            onClick={() => handleSelect(o.id)}
            className={`bg-gradient-to-br ${o.bg} border ${o.border} rounded-lg p-10 text-left transition-all duration-300 cursor-pointer group`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.15 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="text-5xl mb-5">{o.emoji}</div>
            <h3 className={`text-2xl font-bold mb-3 ${o.accent}`}>{o.title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">{o.description}</p>
          </motion.button>
        ))}
      </div>

    </div>
  )
}