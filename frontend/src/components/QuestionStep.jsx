// QuestionStep.jsx
// Renders a single question with the right input type
// Types supported: text, textarea, select (visual cards), multifield

import { motion } from 'framer-motion'

export default function QuestionStep({ question, value, onChange, onNext, isLast }) {

  // Handle Enter key to go to next question (for text inputs)
  function handleKeyDown(e) {
    if (e.key === 'Enter' && question.type === 'text') {
      e.preventDefault()
      if (value && value.trim()) onNext()
    }
  }

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Question label */}
      <p className="text-xs tracking-[0.3em] text-zinc-500 uppercase mb-3">
        {question.label}
      </p>

      {/* Question text */}
      <h2
        className="text-2xl md:text-4xl font-bold text-white mb-8 leading-snug"
        style={{ fontFamily: 'Playfair Display, serif' }}
      >
        {question.question}
      </h2>

      {/* INPUT — plain text */}
      {question.type === 'text' && (
        <input
          type="text"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={question.placeholder || 'Type your answer...'}
          className="w-full bg-transparent border-b border-zinc-700 focus:border-white text-white text-xl py-3 outline-none placeholder-zinc-600 transition-colors duration-200"
          autoFocus
        />
      )}

      {/* INPUT — textarea for longer answers */}
      {question.type === 'textarea' && (
        <textarea
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder={question.placeholder || 'Take your time...'}
          rows={4}
          className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-500 text-white text-base p-4 outline-none placeholder-zinc-600 resize-none rounded-lg transition-colors duration-200"
          autoFocus
        />
      )}

      {/* INPUT — visual cards (for vibe selection etc) */}
      {question.type === 'cards' && (
        <div className="grid grid-cols-2 gap-4">
          {question.options.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setTimeout(onNext, 300) }}
              className={`border rounded-lg p-6 text-left transition-all duration-200 ${
                value === opt.value
                  ? 'border-white bg-white text-black'
                  : 'border-zinc-700 text-white hover:border-zinc-400'
              }`}
            >
              {opt.emoji && <div className="text-3xl mb-2">{opt.emoji}</div>}
              <div className="font-semibold">{opt.label}</div>
              {opt.description && (
                <div className={`text-xs mt-1 ${value === opt.value ? 'text-zinc-600' : 'text-zinc-500'}`}>
                  {opt.description}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Next button — shown for text and textarea types */}
      {(question.type === 'text' || question.type === 'textarea') && (
        <motion.button
          onClick={onNext}
          disabled={!value || !value.toString().trim()}
          className="mt-8 bg-white text-black px-8 py-3 font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-red-500 hover:text-white transition-all duration-300"
          whileTap={{ scale: 0.97 }}
        >
          {isLast ? 'Generate Experience →' : 'Next →'}
        </motion.button>
      )}

    </motion.div>
  )
}