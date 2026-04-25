const Component = require('../models/Component')

async function findBestComponent(embedding, sectionType, occasion) {
  try {
    const vectorResults = await Component.aggregate([
      {
        $vectorSearch: {
          index: 'vector_index',
          path: 'embedding',
          queryVector: embedding,
          numCandidates: 50,
          limit: 5,
          filter: { type: { $eq: sectionType } }
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
          usage_count: { $ifNull: ['$usage_count', 0] },
          score: { $meta: 'vectorSearchScore' }
        }
      }
    ])

    if (vectorResults && vectorResults.length > 0) {
      const typeMatches = vectorResults.filter(r => r.type === sectionType)

      if (typeMatches.length > 0) {
        const occasionMatches = typeMatches.filter(r => 
  r.occasion.includes(occasion) || r.occasion.includes('both')
)
        const pool = occasionMatches.length > 0 ? occasionMatches : typeMatches

        const selected = weightedRandomSelect(pool)

        await Component.updateOne(
          { _id: selected._id },
          { $inc: { usage_count: 1 } }
        )

        console.log(`Agent 2: ${sectionType} → ${selected._id} (score: ${selected.score?.toFixed(3)}, used: ${selected.usage_count} times)`)
        return selected
      }
    }

    // Fallback if vector search returns nothing
    console.log(`Vector search empty for ${sectionType} — using direct DB fetch`)
    const directResults = await Component.find({ type: sectionType })
    if (!directResults || directResults.length === 0) return null
    const occasionMatch = directResults.find(r => r.occasion.includes(occasion))
    return occasionMatch || directResults[0]

  } catch (err) {
    console.error(`Vector search failed for ${sectionType}:`, err.message)
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

function weightedRandomSelect(components) {
  if (components.length === 1) return components[0]

  const PROXIMITY_THRESHOLD = 0.05

  const topScore = components[0].score
  const bottomScore = components[components.length - 1].score
  const scoreRange = topScore - bottomScore

  const weights = components.map(c => {
    const usagePenalty = 1 / (c.usage_count + 1)

    if (scoreRange < PROXIMITY_THRESHOLD) {
      // Scores are too close to matter — decide purely by who has been used less
      return usagePenalty
    }

    // Scores are spread out — relevance matters but usage count still modulates it
    const normalizedScore = (c.score - bottomScore) / scoreRange
    return (0.4 + normalizedScore * 0.6) * usagePenalty
  })

  const totalWeight = weights.reduce((sum, w) => sum + w, 0)
  let rand = Math.random() * totalWeight

  for (let i = 0; i < components.length; i++) {
    rand -= weights[i]
    if (rand <= 0) return components[i]
  }

  return components[0]
}

module.exports = { findBestComponent }