// profilerAgent.js — Agent 1: The Profiler
const { callGeminiJSON } = require('../services/geminiService')
const { PROFILER_SYSTEM_PROMPT, BRO_PROFILER_SYSTEM_PROMPT } = require('../utils/promptTemplates')

const REQUIRED_FIELDS = [
  'recipient_name', 'occasion', 'obsession', 'obsession_tags',
  'aesthetic', 'tone', 'vibe', 'css', 'content', 'song'
]

const REQUIRED_CSS_FIELDS = ['primary_color', 'accent_color', 'font_heading', 'font_body']

async function run(formAnswers) {
  // Route to bro profiler if bro mode
  if (formAnswers.occasion === 'bro') {
    return runBroProfiler(formAnswers)
  }

  const userMessage = `
Form answers:
${JSON.stringify(formAnswers)}

CRITICAL for CSS derivation:
- Her obsession is: ${formAnswers.obsession || formAnswers.question_3}
- Her favorite color is: ${formAnswers.favorite_color || formAnswers.question_4 || 'not specified'}
- The aesthetic she gravitates toward: ${formAnswers.aesthetic || 'derive from obsession'}

Derive the CSS palette SPECIFICALLY from these two inputs combined.`

  const result = await callGeminiJSON(PROFILER_SYSTEM_PROMPT, userMessage)

  if (!result.success) {
    throw new Error(`Agent 1 (Profiler) failed after retries: ${result.error}`)
  }

  const data = result.data
  return validateAndFill(data)
}

async function runBroProfiler(formAnswers) {
  // Map bro answers into the same profile shape
  // We do this with AI so the obsession tags, aesthetic, CSS are derived properly
  const userMessage = `
Bro Mode form answers:
- Recipient name: ${formAnswers.recipient_name}
- Obsession: ${formAnswers.obsession}
- Roast line (what he does that he thinks is cool): ${formAnswers.roast}
- Real talk (what would never be said to his face): ${formAnswers.real_talk}
- Vibe selected: ${formAnswers.vibe}

Map this into the standard profile JSON. 
The occasion is 'bro'.
Tone must include 'roast' and 'humor'. 
If vibe is 'full_roast' add 'savage'. If 'wholesome' add 'brotherhood'.
CSS palette should match the obsession — make it bold, high contrast, not romantic.
For content fields:
- personality = derive something punchy about a guy with this obsession
- detail_1, detail_2, detail_3 = expand on the roast line creatively  
- memory_1 = generic bro moment placeholder
- meaning = the real_talk field — this is the emotional anchor
- unsaid_thing = also from real_talk — distill it to one short sentence
- scenario and first_memory = empty string (not used in bro mode)
- song = pick a hype/anthem song that fits the obsession (e.g. FIFA → Freed from Desire, gym → Eye of the Tiger)`

  const result = await callGeminiJSON(BRO_PROFILER_SYSTEM_PROMPT, userMessage)

  if (!result.success) {
    throw new Error(`Agent 1 Bro (Profiler) failed: ${result.error}`)
  }

  return validateAndFill(result.data)
}

function validateAndFill(data) {
  for (const field of REQUIRED_FIELDS) {
    if (!data[field]) {
      throw new Error(`Agent 1 missing required field: ${field}`)
    }
  }

  for (const field of REQUIRED_CSS_FIELDS) {
    if (!data.css[field]) {
      console.warn(`Agent 1 missing css.${field} — using fallback`)
      data.css[field] = getFallbackCSS(field)
    }
  }

  if (!Array.isArray(data.tone)) data.tone = [data.tone].filter(Boolean)
  if (!Array.isArray(data.obsession_tags)) data.obsession_tags = [data.obsession]

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