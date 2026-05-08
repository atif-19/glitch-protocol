// FlowContext.jsx
// Global state for the entire form flow
// occasion — 'birthday' or 'apology'
// answers — all 14 form answers
// generatedUrl — the final link returned after generation

// FlowContext.jsx
import { createContext, useContext, useState } from 'react'

const FlowContext = createContext(null)

export function FlowProvider({ children }) {
  const [occasion, setOccasion] = useState(null)
  const [answers, setAnswers] = useState({})
  const [generatedUrl, setGeneratedUrl] = useState(null)
  const [generatedSlug, setGeneratedSlug] = useState(null)

  function updateAnswer(key, value) {
    setAnswers(prev => ({ ...prev, [key]: value }))
  }

  function resetFlow() {
    setOccasion(null)
    setAnswers({})
    setGeneratedUrl(null)
    setGeneratedSlug(null)
    localStorage.removeItem('glitch_answers')
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

export function useFlow() {
  const context = useContext(FlowContext)
  if (!context) throw new Error('useFlow must be used inside FlowProvider')
  return context
}