// LandingPage.jsx
// First thing the user sees
// Dark, cinematic, minimal — one button, one tagline
// Framer Motion handles the entrance animation

import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 relative overflow-hidden">

      {/* Background subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-900" />

      {/* Glitch dot — decorative top left */}
      <motion.div
        className="absolute top-8 left-8 w-2 h-2 rounded-full bg-red-500"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <div className="relative z-10 text-center max-w-2xl">

        {/* Small label */}
        <motion.p
          className="text-xs tracking-[0.3em] text-zinc-500 uppercase mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          The Glitch Protocol
        </motion.p>

        {/* Main headline */}
        <motion.h1
          className="text-5xl md:text-7xl font-bold leading-tight mb-6"
          style={{ fontFamily: 'Playfair Display, serif' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Because some apologies deserve more than a{' '}
          <span className="text-red-500">blue tick.</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          className="text-zinc-400 text-lg md:text-xl mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Describe someone you care about. We build them a cinematic web experience in under 15 seconds.
        </motion.p>

        {/* CTA Button */}
        <motion.button
          onClick={() => navigate('/occasion')}
          className="bg-white text-black px-10 py-4 text-base font-semibold tracking-wide hover:bg-red-500 hover:text-white transition-all duration-300 rounded-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Start Building →
        </motion.button>

        {/* Small footer note */}
        <motion.p
          className="text-zinc-600 text-xs mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Free. No account needed. Just describe them.
        </motion.p>

      </div>
    </div>
  )
}