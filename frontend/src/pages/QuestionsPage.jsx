// QuestionsPage.jsx
// Renders all 14 questions one at a time
// Saves each answer to FlowContext
// Also saves to localStorage so refresh doesn't lose progress
// At the end — sends everything to backend

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useFlow } from '../context/FlowContext'
import { getQuestions } from '../data/questions'
import QuestionStep from '../components/QuestionStep'

export default function QuestionsPage() {
  const navigate = useNavigate()
  const { occasion, answers, updateAnswer, setAnswers } = useFlow()

  // If someone lands here without picking an occasion, send them back
  useEffect(() => {
    if (!occasion) navigate('/occasion')
  }, [occasion])

  // Load saved answers from localStorage on first load
  useEffect(() => {
    const saved = localStorage.getItem('glitch_answers')
    if (saved) {
      try {
        setAnswers(JSON.parse(saved))
      } catch (e) {
        // ignore bad localStorage data
      }
    }
  }, [])

  const questions = getQuestions(occasion)
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentQuestion = questions[currentIndex]
  const currentValue = answers[currentQuestion?.id] || ''

  // Save to localStorage every time answers change
  useEffect(() => {
    localStorage.setItem('glitch_answers', JSON.stringify(answers))
  }, [answers])

  function handleChange(value) {
    updateAnswer(currentQuestion.id, value)
  }

  function handleNext() {
    if (!currentValue || !currentValue.toString().trim()) return

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      // Last question — go to generating page
      navigate('/generating')
    }
  }

  function handleBack() {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1)
    else navigate('/occasion')
  }

  if (!occasion || !currentQuestion) return null

  const progress = ((currentIndex + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-black text-white flex flex-col px-6 py-10">

      {/* Top bar — back button + progress */}
      <div className="max-w-2xl mx-auto w-full mb-12">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleBack}
            className="text-zinc-500 hover:text-white text-sm transition-colors"
          >
            ← Back
          </button>
          <span className="text-zinc-600 text-xs">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-0.5 bg-zinc-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 flex items-center justify-center px-2">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <QuestionStep
              key={currentQuestion.id}
              question={currentQuestion}
              value={currentValue}
              onChange={handleChange}
              onNext={handleNext}
              isLast={currentIndex === questions.length - 1}
            />
          </AnimatePresence>
        </div>
      </div>

    </div>
  )
}