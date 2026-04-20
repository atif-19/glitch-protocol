// FlowContext.jsx
// Global state for the entire form flow
// occasion — 'birthday' or 'apology'
// answers — all 14 form answers
// generatedUrl — the final link returned after generation

import { createContext, useContext, useState } from 'react'

const FlowContext = createContext(null)

export function FlowProvider({ children }) {
  const [occasion, setOccasion] = useState(null)
  const [answers, setAnswers] = useState({})
  const [generatedUrl, setGeneratedUrl] = useState(null)
  const [generatedSlug, setGeneratedSlug] = useState(null)

  // Update a single answer by question key
  function updateAnswer(key, value) {
    setAnswers(prev => ({ ...prev, [key]: value }))
  }

  // Reset everything — used if user wants to start over
  function resetFlow() {
    setOccasion(null)
    setAnswers({})
    setGeneratedUrl(null)
    setGeneratedSlug(null)
  }

  return (
    <FlowContext.Provider value={{
      occasion, setOccasion,
      answers, updateAnswer, setAnswers,
      generatedUrl, setGeneratedUrl,
      generatedSlug, setGeneratedSlug,
      resetFlow
    }}>
      {children}
    </FlowContext.Provider>
  )
}

// Custom hook — any component calls useFlow() to get access to everything
export function useFlow() {
  const context = useContext(FlowContext)
  if (!context) throw new Error('useFlow must be used inside FlowProvider')
  return context
}