// server.js
// First thing — check all required environment variables are present
// If anything is missing the server refuses to start immediately
// This saves us from debugging mysterious failures during generation

require('dotenv').config()

const REQUIRED_ENV = ['MONGO_URI', 'GEMINI_API_KEY', 'ADMIN_SECRET']

for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`STARTUP ERROR: Missing required env variable: ${key}`)
    process.exit(1)
  }
}

console.log('All env variables present. Starting server...')

const app = require('./src/app.js')
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Glitch Protocol backend running on port ${PORT}`)
})