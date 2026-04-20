const express = require('express')
const router = express.Router()
const Component = require('../models/Component')
const { getEmbedding } = require('../services/geminiService')

// Check what components exist in DB
router.get('/admin/components', async (req, res) => {
  const components = await Component.find({}, { code: 0, embedding: 0 })
  res.json({ count: components.length, components })
})

// Test vector search directly
router.get('/admin/test-search', async (req, res) => {
  try {
    const count = await Component.countDocuments()

    // Fix — cannot mix inclusion and exclusion in same projection
    const allComponents = await Component.find({}).select('_id type')
    console.log('All components:', allComponents)

    // Generate embedding
    const embeddingResult = await getEmbedding('Harry Potter dark academia cinematic')
    console.log('Embedding dimensions:', embeddingResult.embedding?.length)

    if (!embeddingResult.success) {
      return res.json({ error: 'Embedding failed', detail: embeddingResult.error })
    }

    // Try vector search
    const results = await Component.aggregate([
      {
        $vectorSearch: {
          index: 'vector_index',
          path: 'embedding',
          queryVector: embeddingResult.embedding,
          numCandidates: 50,
          limit: 10
        }
      },
      {
        $project: {
          _id: 1,
          type: 1,
          score: { $meta: 'vectorSearchScore' }
        }
      }
    ])

    res.json({
      totalInDB: count,
      allComponents,
      embeddingDimensions: embeddingResult.embedding?.length,
      vectorSearchResults: results
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router