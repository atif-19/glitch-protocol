// writerAgent.js — Agent 3: The Writer
const { callGeminiJSON } = require('../services/geminiService')
const { WRITER_SYSTEM_PROMPT, BRO_WRITER_SYSTEM_PROMPT } = require('../utils/promptTemplates')

async function run(profile, requiredVariables) {
  // Route to bro writer if bro mode
  if (profile.occasion === 'bro') {
    return runBroWriter(profile, requiredVariables)
  }

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
}`

  const result = await callGeminiJSON(WRITER_SYSTEM_PROMPT, userMessage)

  if (!result.success) {
    throw new Error(`Agent 3 (Writer) failed after retries: ${result.error}`)
  }

  return validateVariables(result.data, requiredVariables, profile.recipient_name, false)
}

async function runBroWriter(profile, requiredVariables) {
  const userMessage = `
### CONTEXT
Recipient (the bro): ${profile.recipient_name}
His obsession: ${profile.obsession}
Tone: ${profile.tone.join(', ')}
Vibe: ${profile.vibe}

### SOURCE DATA
Roast material (detail_1, detail_2, detail_3): ${profile.content.detail_1}
The real thing (meaning / unsaid): ${profile.content.meaning}
Song: ${profile.song ? profile.song.name : 'Eye of the Tiger'}

### REQUIRED JSON STRUCTURE
Return ONLY valid JSON. No markdown. No preamble.

{
  "LOADING_LINE": "string (hype system boot line referencing his obsession — e.g. 'Loading ${profile.recipient_name}.exe... checking vibe levels')",
  "TITLE": "string (bold hype title — NOT romantic, specific to his obsession)",
  "SUBTITLE": "string (one punchy line — what this page is, bro energy)",
  "ACCENT_WORD": "string (one word from his obsession world)",
  "DETAIL_1": "string (roast line 1 — funny, specific, affectionate underneath)",
  "DETAIL_2": "string (roast line 2 — different angle on the roast)",
  "DETAIL_3": "string (roast line 3 — escalate the joke)",
  "PERSONALITY": "string (one punchy honest line about who he actually is — no fluff)",
  "MESSAGE_MAIN": "string (the one real thing — from meaning field — short, landed, no romanticizing)",
  "MESSAGE_LINE_2": "string (one follow-up line — still grounded, bro tone)",
  "MESSAGE_LINE_3": "string (closer — short, quiet, the kind bros never say out loud)",
  "HIDDEN_MESSAGE": "string (the unsaid thing distilled — 5-10 words max — hits different)",
  "REVEAL_INSTRUCTION": "string (casual instruction — e.g. 'tap if you actually want to know')",
  "MOMENT_COPY": "string (birthday celebration — bro style — hype him up, reference his obsession)",
  "MOMENT_CTA": "string (the plan or invite — casual, specific — e.g. 'next match is on me')",
  "ENDING_LINE": "string (last frame — short, real, the one line that makes it worth it)",
  "SONG_NAME": "${profile.song ? profile.song.name : 'Eye of the Tiger'}"
}`

  const result = await callGeminiJSON(BRO_WRITER_SYSTEM_PROMPT, userMessage)

  if (!result.success) {
    throw new Error(`Agent 3 Bro (Writer) failed: ${result.error}`)
  }

  return validateVariables(result.data, requiredVariables, profile.recipient_name, true)
}

function validateVariables(data, requiredVariables, name, isBro) {
  const missing = []
  for (const varName of requiredVariables) {
    if (!data[varName] || data[varName].toString().trim() === '') {
      missing.push(varName)
    }
  }

  if (missing.length > 0) {
    console.warn(`Agent 3 missing vars: ${missing.join(', ')} — using fallbacks`)
    missing.forEach(v => {
      data[v] = isBro ? getBroFallback(v, name) : getFallbackCopy(v, name)
    })
  }

  return data
}

function getBroFallback(varName, name = 'bro') {
  const fallbacks = {
    LOADING_LINE: `Booting ${name}.exe... this might take a sec`,
    TITLE: `For ${name}. Obviously.`,
    SUBTITLE: 'You know what this is.',
    ACCENT_WORD: 'Legendary',
    DETAIL_1: `Acts like he doesn't care. Cares the most.`,
    DETAIL_2: `Thinks he's the main character. Low-key correct.`,
    DETAIL_3: `The one person who'd actually show up no questions asked.`,
    PERSONALITY: `Annoying in the best way possible.`,
    MESSAGE_MAIN: `You're genuinely one of the good ones.`,
    MESSAGE_LINE_2: `Don't let it get to your head.`,
    MESSAGE_LINE_3: `Happy birthday, idiot.`,
    HIDDEN_MESSAGE: `Wouldn't trade you for anyone.`,
    REVEAL_INSTRUCTION: `Tap. You earned it.`,
    MOMENT_COPY: `Another year of putting up with you. Worth it.`,
    MOMENT_CTA: `Next one's on me.`,
    ENDING_LINE: `Still your guy. Always.`,
    SONG_NAME: `Eye of the Tiger`
  }
  return fallbacks[varName] || `...`
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