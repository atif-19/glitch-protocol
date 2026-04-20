// generateController.js
// Orchestrates all 5 agents in sequence
// POST /api/generate — takes form answers, returns { slug, url }

const profilerAgent = require('../agents/profilerAgent')
const curatorAgent = require('../agents/curatorAgent')
const writerAgent = require('../agents/writerAgent')
const assemblerAgent = require('../agents/assemblerAgent')
const keeperAgent = require('../agents/keeperAgent')

async function generate(req, res) {
  const { answers } = req.body

  if (!answers) {
    return res.status(400).json({ success: false, error: 'No answers provided' })
  }

  try {
    // ── Agent 1: The Profiler ──
    console.log('\n━━━ Agent 1: Profiler starting...')
    const profile = await profilerAgent.run(answers)
    console.log(`Agent 1 done: ${profile.recipient_name}, ${profile.occasion}, obsession: ${profile.obsession}`)

    // ── Agent 2: The Curator ──
    console.log('\n━━━ Agent 2: Curator starting...')
    const components = await curatorAgent.run(profile)
    console.log('Agent 2 done: components selected for all 8 sections')

    // Extract all variable names from the selected components
    const requiredVariables = assemblerAgent.extractVariables(components)
    console.log(`Variables needed by components: ${requiredVariables.join(', ')}`)

    // ── Agent 3: The Writer ──
    console.log('\n━━━ Agent 3: Writer starting...')
    const variables = await writerAgent.run(profile, requiredVariables)
    console.log(`Agent 3 done: filled ${Object.keys(variables).length} variables`)

    // Also add the recipient name and song to variables
    // These come from the profile, not Agent 3
    variables['RECIPIENT_NAME'] = profile.recipient_name
    if (profile.song && profile.song.name) {
      variables['SONG_NAME'] = profile.song.name
    }

    // ── Agent 4: The Assembler ──
    console.log('\n━━━ Agent 4: Assembler starting...')
    const html = await assemblerAgent.run(components, variables, profile.css)
    console.log(`Agent 4 done: HTML assembled, length: ${html.length} chars`)

    // ── Agent 5: The Keeper ──
    console.log('\n━━━ Agent 5: Keeper starting...')
    const componentIds = Object.values(components).map(c => c._id)
    const { slug, url } = await keeperAgent.run(html, profile, componentIds)
    console.log(`Agent 5 done: URL generated: ${url}`)

    console.log('\n✅ Pipeline complete!\n')

    res.json({ success: true, slug, url })

  } catch (err) {
    console.error('\n❌ Pipeline failed:', err.message)
    res.status(500).json({
      success: false,
      error: 'Generation failed. Please try again.',
      debug: process.env.NODE_ENV === 'development' ? err.message : undefined
    })
  }
}

module.exports = { generate }