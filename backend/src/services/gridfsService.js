// gridfsService.js
// Saves and retrieves large HTML files using MongoDB GridFS
// GridFS is built into MongoDB — no extra service needed
// It splits large files into chunks and stores them in fs.files and fs.chunks

const mongoose = require('mongoose')
const { GridFSBucket } = require('mongodb')
const { Readable } = require('stream')

// Save an HTML string to GridFS
// Returns the ObjectId of the stored file
async function saveHTML(htmlString, filename) {
  const db = mongoose.connection.db
  const bucket = new GridFSBucket(db, { bucketName: 'pages' })

  return new Promise((resolve, reject) => {
    const readable = Readable.from([htmlString])
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: 'text/html'
    })

    readable.pipe(uploadStream)

    uploadStream.on('finish', () => {
      resolve(uploadStream.id) // returns the ObjectId
    })

    uploadStream.on('error', reject)
  })
}

// Read an HTML string from GridFS by file ObjectId
async function readHTML(fileId) {
  const db = mongoose.connection.db
  const bucket = new GridFSBucket(db, { bucketName: 'pages' })

  return new Promise((resolve, reject) => {
    const chunks = []
    const downloadStream = bucket.openDownloadStream(
      new mongoose.Types.ObjectId(fileId)
    )

    downloadStream.on('data', chunk => chunks.push(chunk))
    downloadStream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
    downloadStream.on('error', reject)
  })
}

// Delete an HTML file from GridFS by file ObjectId
// Used for self-destruct feature in Phase 5
async function deleteHTML(fileId) {
  const db = mongoose.connection.db
  const bucket = new GridFSBucket(db, { bucketName: 'pages' })
  await bucket.delete(new mongoose.Types.ObjectId(fileId))
}

module.exports = { saveHTML, readHTML, deleteHTML }