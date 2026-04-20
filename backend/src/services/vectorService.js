// vectorService.js
// Temporarily fetching by type directly until vector index syncs on Atlas M0
// Will switch back to vector search once index is confirmed working

const Component = require('../models/Component')

async function findBestComponent(embedding, sectionType, occasion) {
  try {
    // Try vector search first
    console.log('Embedding Shape:', Array.isArray(embedding), embedding.length);
    console.log("embdding legth is Atif :",embedding.length)
    const vectorResults = await Component.aggregate([
      {
        $vectorSearch: {
          index: 'vector_index',
          path: 'embedding',
          queryVector: embedding,
          numCandidates: 50,
          limit: 10,
          filter: { type: { $eq: sectionType } } // Add this!
        }
      },
      {
        $project: {
          _id: 1,
          type: 1,
          obsession: 1,
          aesthetic: 1,
          tone: 1,
          occasion: 1,
          variables: 1,
          code: 1,
          score: { $meta: 'vectorSearchScore' }
        }
      }
    ])

    // If vector search returns results, use them
    if (vectorResults && vectorResults.length > 0) {
      const typeMatches = vectorResults.filter(r => r.type === sectionType)
      if (typeMatches.length > 0) {
        const occasionMatch = typeMatches.find(r => r.occasion.includes(occasion))
        return occasionMatch || typeMatches[0]
      }
    }

    // Fallback — fetch directly by type from MongoDB
    // This runs when vector index hasn't synced yet
    console.log(`Vector search empty for ${sectionType} — using direct DB fetch`)
    const directResults = await Component.find({ type: sectionType })

    if (!directResults || directResults.length === 0) {
      console.warn(`No components found for type: ${sectionType}`)
      return null
    }

    // Prefer occasion match
    const occasionMatch = directResults.find(r => r.occasion.includes(occasion))
    return occasionMatch || directResults[0]

  } catch (err) {
    console.error(`Vector search failed for ${sectionType} — trying direct fetch:`, err.message)

    // If vector search throws entirely, fall back to direct fetch
    try {
      const directResults = await Component.find({ type: sectionType })
      if (!directResults || directResults.length === 0) return null
      const occasionMatch = directResults.find(r => r.occasion.includes(occasion))
      return occasionMatch || directResults[0]
    } catch (fallbackErr) {
      console.error(`Direct fetch also failed for ${sectionType}:`, fallbackErr.message)
      return null
    }
  }
}

module.exports = { findBestComponent }