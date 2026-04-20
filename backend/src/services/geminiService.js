const { GoogleGenerativeAI } = require('@google/generative-ai')
const Groq = require('groq-sdk')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// Use Groq for text generation — 14,400 requests/day free
async function callGeminiJSON(systemPrompt, userMessage, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt + '\nReturn ONLY valid JSON. No markdown. No explanation.' },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 2048,
        response_format: { type: 'json_object' } // forces JSON mode
      })

      const raw = completion.choices[0].message.content
      const stripped = raw
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim()

      const parsed = JSON.parse(stripped)
      return { success: true, data: parsed }

    } catch (err) {
      console.error(`Groq attempt ${attempt} failed:`, err.message)
      if (attempt === retries) return { success: false, error: err.message }
      await new Promise(r => setTimeout(r, attempt * 1000))
    }
  }
}

// Keep Gemini for embeddings — Groq doesn't do embeddings
async function getEmbedding(text) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-embedding-2-preview' })
    const result = await model.embedContent(text)
    return { success: true, embedding: result.embedding.values }
  } catch (err) {
    console.error('Embedding failed:', err.message)
    return { success: false, error: err.message }
  }
}

module.exports = { callGeminiJSON, getEmbedding }