// writerAgent.js — Agent 3: The Writer
// Fills all 25-30 template variables with cinematic personalized copy
// One Gemini API call. Validates every variable is filled.

const { callGeminiJSON } = require('../services/geminiService')
const { WRITER_SYSTEM_PROMPT } = require('../utils/promptTemplates')

async function run(profile, requiredVariables) {
  // requiredVariables is an array like ['TITLE', 'SUBTITLE', 'MESSAGE_MAIN', ...]
  // We extract these from the selected components in the controller

const userMessage = `
### CONTEXT
Recipient: ${profile.recipient_name}
Occasion: ${profile.occasion}
Obsession: ${profile.obsession}
Tone: ${profile.tone.join(', ')}
Vibe: ${profile.vibe}

### DATA SOURCE
${JSON.stringify(profile.content, null, 2)}

Song: ${profile.song ? profile.song.name : 'unknown'}

### REQUIRED JSON STRUCTURE
Return ONLY a valid JSON object with these exact keys. No extra text, no markdown.

{
  "DETAIL_1": "string (from content.detail_1 — rewrite cinematically)",
  "DETAIL_2": "string (from content.detail_2 — rewrite cinematically)",
  "DETAIL_3": "string (from content.detail_3 — rewrite cinematically)",
  "MEMORY_1": "string (cinematic rewrite of memory_1)",
  "MEMORY_2": "string (cinematic rewrite of memory_2)",
  "MEMORY_3": "string (cinematic rewrite of memory_3)",
  "MEMORY_CAPTION_1": "string (2-5 words, poetic)",
  "MEMORY_CAPTION_2": "string (2-5 words, poetic)",
  "PHOTO_1": "NONE",
  "LOADING_LINE": "string (system boot style, reference her obsession)",
  "TITLE": "string (cinematic title, specific to her obsession)",
  "SUBTITLE": "string (one line — what this page is)",
  "ACCENT_WORD": "string (one word — a keyword from her obsession world)",
  "PERSONALITY": "string (rewrite of content.personality — make it feel like you see her)",
  "MESSAGE_MAIN": "string (emotional climax — the most important line)",
  "MESSAGE_LINE_2": "string (short follow-up to MESSAGE_MAIN)",
  "MESSAGE_LINE_3": "string (shorter, quieter closing thought)",
  "HIDDEN_MESSAGE": "string (the one thing never said — from content.unsaid_thing)",
  "REVEAL_INSTRUCTION": "string (poetic instruction to click/tap, 5-8 words)",
  "ENDING_LINE": "string (closing line — like the last frame of a film)",
  "SONG_NAME": "string (from song data: ${profile.song ? profile.song.name : 'a song for her'})",
  "MOMENT_COPY": "string (${profile.occasion === 'apology' ? 'honest description of what happened and the apology' : 'the birthday celebration and what you want'})",
  "MOMENT_CTA": "string (${profile.occasion === 'apology' ? 'quiet ask for forgiveness — one sentence' : 'the invitation or plan — one sentence'})"
}
`

  const result = await callGeminiJSON(WRITER_SYSTEM_PROMPT, userMessage)

  if (!result.success) {
    throw new Error(`Agent 3 (Writer) failed after retries: ${result.error}`)
  }

  const data = result.data

  // Check every required variable is present and non-empty
  const missing = []
  for (const varName of requiredVariables) {
    if (!data[varName] || data[varName].toString().trim() === '') {
      missing.push(varName)
    }
  }

  if (missing.length > 0) {
    console.warn(`Agent 3 missing vars: ${missing.join(', ')} — using fallbacks`)
    missing.forEach(v => {
      data[v] = getFallbackCopy(v, profile.recipient_name)
    })
  }

  return data
}

function getFallbackCopy(varName, name = 'you') {
  const fallbacks = {
    TITLE: `For ${name}`,
    SUBTITLE: 'Something made just for you.',
    LOADING_LINE: `Initialising ${name}'s universe...`,
    ACCENT_WORD: 'Dedicated',
    MESSAGE_MAIN: `Some things are hard to say out loud.`,
    MESSAGE_LINE_2: `This is one of those things.`,
    MESSAGE_LINE_3: `But it needed to be said.`,
    HIDDEN_MESSAGE: `You already know what this is about.`,
    REVEAL_INSTRUCTION: 'Click to reveal',
    ENDING_LINE: `Thank you for being you.`,
    MOMENT_COPY: `There is something that needed to be said.`,
    MOMENT_CTA: 'You know what to do.',
    MEMORY_CAPTION_1: 'A moment worth keeping.',
    MEMORY_CAPTION_2: 'Another one.',
    PERSONALITY: `She is someone who makes ordinary moments feel significant.`,
    DETAIL_1: `The small things she does without realising.`,
    DETAIL_2: `The way she shows up.`,
    DETAIL_3: `What makes her, her.`,
    MEMORY_1: `A moment only you two understand.`,
    MEMORY_2: `Another one worth remembering.`,
    MEMORY_3: `And one more.`,
    SONG_NAME: 'A song that felt like her'
  }
  return fallbacks[varName] || `...`
}

module.exports = { run }