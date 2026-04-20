const express = require('express')
const router = express.Router()
const { getPage, getPageMeta, updateSettings, getPageOG } = require('../controllers/pageController')

router.get('/page/:slug', getPage)
router.get('/page/:slug/meta', getPageMeta)
router.post('/page/:slug/settings', updateSettings)
router.get('/og/:slug', getPageOG)

module.exports = router