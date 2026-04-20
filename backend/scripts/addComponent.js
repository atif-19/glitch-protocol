// addComponent.js
// Usage: node scripts/addComponent.js ./components/hero/hero_test_001.html
// Reads the component file, parses metadata from comment block,
// generates a Gemini embedding, and saves to MongoDB

require('dotenv').config()

const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const { GoogleGenerativeAI } = require('@google/generative-ai')

const Component = require('../src/models/Component')

// --- Parse comment block at top of component ---
function parseCommentBlock(html) {
    const match = html.match(/<!--\s*([\s\S]*?)-->/)
  if (!match) throw new Error('No comment block found at top of file')

  const block = match[1]
  const lines = block.split('\n').map(l => l.trim()).filter(Boolean)

  const meta = {}
  for (const line of lines) {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) continue
    const key = line.slice(0, colonIdx).trim().toLowerCase()
    const value = line.slice(colonIdx + 1).trim()
    meta[key] = value
  }

  return {
    _id: meta['component'],
    type: meta['type'],
    aesthetic: meta['aesthetic'],
    obsession: meta['obsession'],
    tone: meta['tone'] ? meta['tone'].split(',').map(t => t.trim()) : [],
    occasion: meta['occasion'] ? meta['occasion'].split(',').map(o => o.trim()) : ['birthday', 'apology'],
    variables: meta['variables'] ? meta['variables'].split(' ').filter(v => v.startsWith('--')) : [],
  }
}

// --- Generate embedding using Gemini ---
async function generateEmbedding(meta) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  const model = genAI.getGenerativeModel({ model: 'gemini-embedding-2-preview' })

  // Build a descriptive text from the metadata — this is what gets embedded
  const text = `${meta.obsession} ${meta.aesthetic} ${meta.tone.join(' ')} ${meta.occasion.join(' ')} ${meta.type}`

  const result = await model.embedContent(text)
  return result.embedding.values
}

// --- Main ---
async function main() {
  const filePath = process.argv[2]

  if (!filePath) {
    console.error('Usage: node scripts/addComponent.js ./path/to/component.html')
    process.exit(1)
  }

  const absolutePath = path.resolve(filePath)
  if (!fs.existsSync(absolutePath)) {
    console.error('File not found:', absolutePath)
    process.exit(1)
  }

  console.log('Reading file:', absolutePath)
  const html = fs.readFileSync(absolutePath, 'utf-8')

  // Parse metadata
  let meta
  try {
    meta = parseCommentBlock(html)
    console.log('Parsed metadata:', meta)
  } catch (err) {
    console.error('Failed to parse comment block:', err.message)
    process.exit(1)
  }

  // Validate required fields
  const required = ['_id', 'type', 'aesthetic', 'obsession']
  for (const field of required) {
    if (!meta[field]) {
      console.error(`Missing required metadata field: ${field}`)
      process.exit(1)
    }
  }

  // Connect to MongoDB
  await mongoose.connect(process.env.MONGO_URI)
  console.log('MongoDB connected')

  // Check if component already exists
  const existing = await Component.findById(meta._id)
  if (existing) {
    console.log(`Component ${meta._id} already exists. Updating...`)
    await Component.findByIdAndDelete(meta._id)
  }

  // Generate embedding
  console.log('Generating embedding...')
  let embedding
  try {
    embedding = await generateEmbedding(meta)
    console.log(`Embedding generated. Dimensions: ${embedding.length}`)
  } catch (err) {
    console.error('Embedding failed:', err.message)
    process.exit(1)
  }

  // Save to MongoDB
  const doc = new Component({
    _id: meta._id,
    type: meta.type,
    aesthetic: meta.aesthetic,
    obsession: meta.obsession,
    tone: meta.tone,
    occasion: meta.occasion,
    variables: meta.variables,
    code: html,
    embedding: embedding,
    quality_score: 5
  })

  await doc.save()
  console.log(`✅ ${meta._id} saved successfully.`)

  // Count total components
  const total = await Component.countDocuments()
  console.log(`Total components in DB: ${total}`)

  await mongoose.disconnect()
  process.exit(0)
}

main().catch(err => {
  console.error('Unexpected error:', err)
  process.exit(1)
})