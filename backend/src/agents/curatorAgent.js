// curatorAgent.js — Agent 2: The Curator
// Runs RAG — queries vector DB once per section type
// Returns 8 component documents (one per section)
// Zero AI calls — pure MongoDB vector search

const { getEmbedding } = require('../services/geminiService')
const { findBestComponent } = require('../services/vectorService')

const SECTION_TYPES = [
  'loading',
  'hero',
  'who_she_is',
  'memories',
  'core_message',
  'the_moment',
  'reveal',
  'ending'
]

async function run(profile) {
  // Build the semantic search query from profile data
  // This text describes what kind of component we want
  const queryText = [
    profile.obsession,
    profile.aesthetic,
    ...profile.tone,
    profile.vibe,
    profile.occasion
  ].join(' ')

  console.log('Agent 2: Query text for embedding:', queryText)

  // Generate one embedding for the query
  const embeddingResult = await getEmbedding(queryText)

  if (!embeddingResult.success) {
    throw new Error(`Agent 2 (Curator) embedding failed: ${embeddingResult.error}`)
  }

  const embedding = embeddingResult.embedding

  // Query vector DB once per section type — in parallel for speed
  const searchPromises = SECTION_TYPES.map(sectionType =>
    findBestComponent(embedding, sectionType, profile.occasion)
      .then(component => ({ sectionType, component }))
  )

  const results = await Promise.all(searchPromises)

  // Build the components map
  const components = {}
  for (const { sectionType, component } of results) {
    if (!component) {
      throw new Error(`Agent 2: No component found for section type: ${sectionType}`)
    }
    components[sectionType] = component
    console.log(`Agent 2: ${sectionType} → ${component._id} (score: ${component.score?.toFixed(3)})`)
  }

  return components // { loading: doc, hero: doc, ... }
}

module.exports = { run }