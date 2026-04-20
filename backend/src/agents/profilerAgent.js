// profilerAgent.js — Agent 1: The Profiler
// Takes 14 raw form answers and turns them into clean structured JSON
// One Gemini API call. Validates all required fields.

const { callGeminiJSON } = require('../services/geminiService')
const { PROFILER_SYSTEM_PROMPT } = require('../utils/promptTemplates')

const REQUIRED_FIELDS = [
  'recipient_name', 'occasion', 'obsession', 'obsession_tags',
  'aesthetic', 'tone', 'vibe', 'css', 'content', 'song'
]

const REQUIRED_CSS_FIELDS = ['primary_color', 'accent_color', 'font_heading', 'font_body']

async function run(formAnswers) {
  const userMessage = `Extract structured data from these form answers: ${JSON.stringify(formAnswers)}`

  const result = await callGeminiJSON(PROFILER_SYSTEM_PROMPT, userMessage)

  if (!result.success) {
    throw new Error(`Agent 1 (Profiler) failed after retries: ${result.error}`)
  }

  const data = result.data

  // Validate top-level required fields
  for (const field of REQUIRED_FIELDS) {
    if (!data[field]) {
      throw new Error(`Agent 1 missing required field: ${field}`)
    }
  }

  // Validate and fill CSS fields with safe fallbacks
  for (const field of REQUIRED_CSS_FIELDS) {
    if (!data.css[field]) {
      console.warn(`Agent 1 missing css.${field} — using fallback`)
      data.css[field] = getFallbackCSS(field)
    }
  }

  // Make sure arrays are actually arrays
  if (!Array.isArray(data.tone)) data.tone = [data.tone].filter(Boolean)
  if (!Array.isArray(data.obsession_tags)) data.obsession_tags = [data.obsession]

  // Make sure content fields exist — fill with empty string if missing
  const contentFields = [
    'personality', 'detail_1', 'detail_2', 'detail_3',
    'memory_1', 'memory_2', 'memory_3', 'first_memory',
    'meaning', 'scenario', 'unsaid_thing'
  ]
  for (const field of contentFields) {
    if (!data.content[field]) data.content[field] = ''
  }

  return data
}

function getFallbackCSS(field) {
  const fallbacks = {
    primary_color: '#1a1a2e',
    accent_color: '#e63946',
    font_heading: 'Playfair Display',
    font_body: 'Inter'
  }
  return fallbacks[field]
}

module.exports = { run }