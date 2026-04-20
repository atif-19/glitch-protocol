// pageController.js
// Serves the generated HTML page when recipient visits /r/:slug
// Also tracks view count and first_viewed_at

const Page = require('../models/Page')
const { readHTML } = require('../services/gridfsService')

async function getPage(req, res) {
  const { slug } = req.params
  const { password } = req.query

  try {
    const page = await Page.findOne({ slug })

    if (!page) {
      return res.status(404).json({ success: false, error: 'Experience not found.' })
    }

    // Password check
    if (page.password_hash) {
      if (!password) {
        return res.json({ success: false, password_required: true })
      }
      const bcrypt = require('bcryptjs')
      const match = await bcrypt.compare(password, page.password_hash)
      if (!match) {
        return res.status(401).json({ success: false, error: 'Wrong password.' })
      }
    }

    // Read HTML from GridFS BEFORE deleting anything
    const html = await readHTML(page.html_gridfs_id)

    // Check if this is the FIRST view right now
    const isFirstView = !page.viewed

    // Update view tracking
    await Page.findOneAndUpdate({ slug }, {
      $inc: { view_count: 1 },
      $set: {
        viewed: true,
        ...(isFirstView && { first_viewed_at: new Date() })
      }
    })

    res.json({ success: true, html })

  } catch (err) {
    console.error('pageController error:', err.message)
    res.status(500).json({ success: false, error: 'Failed to load experience.' })
  }
}

// Sender checks if recipient has opened the link
async function getPageMeta(req, res) {
  const { slug } = req.params

  try {
    const page = await Page.findOne({ slug }).select('viewed view_count first_viewed_at occasion recipient_name')

    if (!page) {
      return res.status(404).json({ success: false, error: 'Not found' })
    }

    res.json({ success: true, ...page.toObject() })

  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to get page info.' })
  }
}

async function updateSettings(req, res) {
  const { slug } = req.params
  const { password, selfDestruct } = req.body


  try {
    const updateData = {
      self_destruct: selfDestruct || false
    }

    if (password) {
      const bcrypt = require('bcryptjs')
      const hash = await bcrypt.hash(password, 10)
      console.log('Hash generated:', hash)
      updateData.password_hash = hash
    } else {
      updateData.password_hash = null
    }



    const result = await Page.findOneAndUpdate({ slug }, updateData, { new: true })

    res.json({ success: true })

  } catch (err) {
    console.error('updateSettings error:', err.message)
    res.status(500).json({ success: false, error: 'Failed to save settings' })
  }
}
module.exports = { getPage, getPageMeta, updateSettings }
