// keeperAgent.js — Agent 5: The Keeper
// Saves the final HTML to GridFS
// Creates the page metadata document
// Returns the unique slug and URL

const { saveHTML } = require('../services/gridfsService')
const Page = require('../models/Page')

async function run(html, profile, componentIds) {
  // Step 1 — Generate unique slug: 'for-[name]-[random6chars]'
  // nanoid is ESM only in v4+ so we use a simple random string instead
  const randomId = Math.random().toString(36).substring(2, 8)
  const nameSlug = profile.recipient_name.toLowerCase().replace(/[^a-z0-9]/g, '')
  const slug = `for-${nameSlug}-${randomId}`

  // Step 2 — Save HTML to GridFS
  const gridfsId = await saveHTML(html, `${slug}.html`)

  // Step 3 — Save page metadata to pages collection
  const page = new Page({
    slug,
    html_gridfs_id: gridfsId,
    occasion: profile.occasion,
    obsession: profile.obsession,
    recipient_name: profile.recipient_name,
    components_used: componentIds,
    viewed: false,
    view_count: 0
  })

  await page.save()

  // Step 4 — Build and return the URL
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
    const url = `${backendUrl}/api/og/${slug}`

  return { slug, url }
}

module.exports = { run }