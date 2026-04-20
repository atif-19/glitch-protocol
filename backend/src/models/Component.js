// Component.js
// This is the schema for every UI component in our library
// Each component is a self-contained HTML/CSS/JS snippet
// with metadata and a 768-dimension embedding for vector search

const mongoose = require('mongoose')

const componentSchema = new mongoose.Schema({
  _id: {
    type: String, // human-readable like 'hero_harrypotter_001'
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['loading', 'hero', 'who_she_is', 'memories', 'core_message', 'the_moment', 'reveal', 'ending']
  },
  aesthetic: { type: String, required: true },
  obsession: { type: String, required: true },
  tone: [String], // array like ['mysterious', 'warm', 'literary']
  occasion: [String], // ['birthday'] or ['apology'] or ['birthday', 'apology']
  variables: [String], // list of --VAR-- names this component uses
  code: { type: String, required: true }, // the full HTML string
  embedding: [Number], // 768 numbers — the Gemini embedding vector
  created_at: { type: Date, default: Date.now },
  quality_score: { type: Number, default: 5, min: 1, max: 10 }
})

// This index is what makes vector search work
// We create this manually in MongoDB Atlas UI — not here in code
// (Atlas Vector Search indexes are managed from the Atlas dashboard)

module.exports = mongoose.model('Component', componentSchema)