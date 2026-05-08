// OccasionPage.jsx
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
    tag: null,
  },
  {
    id: 'apology',
    emoji: '🩹',
    title: 'Apology',
    description: 'Not a text. Not a voice note. A cinematic patch update to a logic error.',
    bg: 'from-blue-950 to-black',
    accent: 'text-blue-400',
    border: 'border-blue-800 hover:border-blue-400',
    tag: null,
  },
  {
    id: 'bro',
    emoji: '🤝',
    title: 'Bro Mode',
    description: "For when you actually care but would never say it. 5 questions. Done in 2 minutes.",
    bg: 'from-green-950 to-black',
    accent: 'text-green-400',
    border: 'border-green-800 hover:border-green-400',
    tag: 'Fast',
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
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-12">

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

      {/* First row — Birthday and Apology side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mb-6">
        {occasions.slice(0, 2).map((o, i) => (
          <OccasionCard key={o.id} o={o} i={i} onSelect={handleSelect} />
        ))}
      </div>

      {/* Bro Mode — full width below */}
      <div className="w-full max-w-3xl">
        <OccasionCard o={occasions[2]} i={2} onSelect={handleSelect} fullWidth />
      </div>

    </div>
  )
}

function OccasionCard({ o, i, onSelect, fullWidth }) {
  return (
    <motion.button
      onClick={() => onSelect(o.id)}
      className={`relative bg-gradient-to-br ${o.bg} border ${o.border} rounded-lg p-10 text-left transition-all duration-300 cursor-pointer group w-full ${fullWidth ? 'flex items-center gap-8' : ''}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + i * 0.15 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Fast tag for Bro Mode */}
      {o.tag && (
        <span className="absolute top-4 right-4 text-[10px] font-mono tracking-widest text-green-400 border border-green-800 px-2 py-0.5 rounded-full uppercase">
          {o.tag}
        </span>
      )}

      <div className={`text-5xl ${fullWidth ? 'flex-shrink-0' : 'mb-5'}`}>{o.emoji}</div>

      <div>
        <h3 className={`text-2xl font-bold mb-3 ${o.accent}`}>{o.title}</h3>
        <p className="text-zinc-400 text-sm leading-relaxed">{o.description}</p>

        {/* Bro Mode — show question count hint */}
        {o.id === 'bro' && (
          <div className="flex items-center gap-4 mt-4">
            {['His name', 'His obsession', 'The roast', 'Real talk', 'Vibe'].map((q, idx) => (
              <span key={idx} className="text-[10px] font-mono text-green-700 border border-green-900 px-2 py-0.5 rounded">
                {q}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.button>
  )
}