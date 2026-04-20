// Page.js
// Every generated experience is stored as a Page document
// The actual HTML lives in MongoDB GridFS (big file storage)
// This document holds the metadata and tracking info

const mongoose = require('mongoose')

const pageSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true // 'for-zara-xk29qm' — must be unique
  },
  html_gridfs_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true // points to the GridFS file
  },
  occasion: {
    type: String,
    enum: ['birthday', 'apology'],
    required: true
  },
  obsession: String,
  recipient_name: String,
  components_used: [String], // array of component IDs used to build this page
  created_at: { type: Date, default: Date.now },
  
  // Tracking — sender can see if recipient opened the link
  viewed: { type: Boolean, default: false },
  view_count: { type: Number, default: 0 },
  first_viewed_at: { type: Date, default: null },
  
  // Optional features
  self_destruct: { type: Boolean, default: false }, // delete after first view
  password_hash: { type: String, default: null } // bcrypt hash if password protected
})

module.exports = mongoose.model('Page', pageSchema)