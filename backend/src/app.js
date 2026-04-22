// app.js
// Sets up Express, connects to MongoDB, and wires up all routes

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const generateRoutes = require('./routes/generateRoutes')
const pageRoutes = require('./routes/pageRoutes')
const adminRoutes = require('./routes/adminRoutes')

const app = express()

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
      'http://localhost:5173',
      process.env.FRONTEND_URL
    ].filter(Boolean)
    
    if (!origin || allowed.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))
app.use(express.json({ limit: '10mb' })) // 10mb to handle base64 photo uploads

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message)
    process.exit(1) // Kill server if DB fails — nothing works without it
  })

// Health check route — just to confirm server is alive
app.get('/health', (req, res) => {
  res.json({ status: 'ok', project: 'The Glitch Protocol' })
})

// All routes
app.use('/api', generateRoutes)
app.use('/api', pageRoutes)
app.use('/api', adminRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

module.exports = app