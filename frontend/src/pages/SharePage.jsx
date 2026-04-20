import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useFlow } from '../context/FlowContext'
import { useNavigate } from 'react-router-dom'
import api from '../api/axiosInstance'

export default function SharePage() {
  const { generatedUrl, generatedSlug, resetFlow } = useFlow()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [viewed, setViewed] = useState(false)
  const [viewCount, setViewCount] = useState(0)
  const [firstViewedAt, setFirstViewedAt] = useState(null)
  const [password, setPassword] = useState('')
  const [passwordEnabled, setPasswordEnabled] = useState(false)
  const [settingsSaved, setSettingsSaved] = useState(false)
  const [savingSettings, setSavingSettings] = useState(false)

  if (!generatedUrl) {
    navigate('/')
    return null
  }

  // Poll every 10 seconds to check if recipient opened the link
  useEffect(() => {
    checkViewStatus()
    const interval = setInterval(checkViewStatus, 10000)
    return () => clearInterval(interval)
  }, [generatedSlug])

  async function checkViewStatus() {
    if (!generatedSlug) return
    try {
      const res = await api.get(`/api/page/${generatedSlug}/meta`)
      if (res.data.success) {
        setViewed(res.data.viewed)
        setViewCount(res.data.view_count)
        setFirstViewedAt(res.data.first_viewed_at)
      }
    } catch (err) {
      // silently fail — not critical
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(generatedUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  function handleWhatsApp() {
    const message = encodeURIComponent(`I made something for you. Open this: ${generatedUrl}`)
    window.open(`https://wa.me/?text=${message}`, '_blank')
  }

  async function saveSettings() {
    setSavingSettings(true)
    try {
      await api.post(`/api/page/${generatedSlug}/settings`, {
        password: passwordEnabled ? password : null
      })
      setSettingsSaved(true)
      setTimeout(() => setSettingsSaved(false), 2500)
    } catch (err) {
      console.error('Failed to save settings')
    }
    setSavingSettings(false)
  }

  function formatViewTime(dateString) {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleString('en-IN', {
      day: 'numeric', month: 'short',
      hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        className="w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >

        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            className="text-5xl mb-5"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            🔗
          </motion.div>
          <h2
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Her experience is ready.
          </h2>
          <p className="text-zinc-500">
            Send this link. She opens it. It was made entirely for her.
          </p>
        </div>

        {/* URL box */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 mb-3 flex items-center justify-between gap-3">
          <span className="text-zinc-400 text-sm truncate">{generatedUrl}</span>
          <button
            onClick={handleCopy}
            className="text-white text-xs border border-zinc-700 px-3 py-1.5 hover:border-white transition-colors flex-shrink-0"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>

        {/* WhatsApp button */}
        <button
          onClick={handleWhatsApp}
          className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg text-sm font-semibold transition-colors mb-8 flex items-center justify-center gap-2"
        >
          <span>📱</span> Share on WhatsApp
        </button>

        {/* View status */}
        <div className={`rounded-lg p-4 mb-6 border ${viewed ? 'border-green-800 bg-green-950' : 'border-zinc-800 bg-zinc-950'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${viewed ? 'bg-green-400' : 'bg-zinc-600'}`} />
            <div>
              {viewed ? (
                <div>
                  <p className="text-green-400 text-sm font-semibold">She opened it ✓</p>
                  <p className="text-zinc-500 text-xs mt-0.5">
                    {viewCount} {viewCount === 1 ? 'view' : 'views'}
                    {firstViewedAt && ` · First opened ${formatViewTime(firstViewedAt)}`}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-zinc-400 text-sm">Not opened yet</p>
                  <p className="text-zinc-600 text-xs mt-0.5">This page checks automatically every 10 seconds</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="border border-zinc-800 rounded-lg p-5 mb-8 space-y-5">
          <p className="text-xs tracking-widest text-zinc-500 uppercase">Optional Settings</p>

          {/* Password toggle */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-white">Password protect</p>
                <p className="text-xs text-zinc-600">Recipient must enter a password to view</p>
              </div>
              <button
                onClick={() => setPasswordEnabled(p => !p)}
                className={`w-10 h-5 rounded-full transition-colors duration-200 ${passwordEnabled ? 'bg-white' : 'bg-zinc-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-black transition-transform duration-200 mx-0.5 ${passwordEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
            {passwordEnabled && (
              <input
                type="text"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter a password..."
                className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm px-3 py-2 rounded outline-none focus:border-zinc-500"
              />
            )}
          </div>

          {/* Save settings button */}
          <button
            onClick={saveSettings}
            disabled={savingSettings || (passwordEnabled && !password.trim())}
            className="w-full border border-zinc-700 text-white text-sm py-2.5 rounded hover:border-zinc-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {savingSettings ? 'Saving...' : settingsSaved ? '✓ Settings saved' : 'Save settings'}
          </button>
        </div>

        {/* Preview + start over */}
        <div className="flex flex-col items-center gap-4">
          <a 
            href={`/r/${generatedSlug}`}
            target="_blank"
            rel="noreferrer"
            className="text-zinc-500 text-sm hover:text-white transition-colors underline underline-offset-4"
          >
            Preview what she will see →
          </a>
          <button
            onClick={() => { resetFlow(); navigate('/') }}
            className="text-zinc-700 text-xs hover:text-zinc-500 transition-colors"
          >
            Build another experience
          </button>
        </div>

      </motion.div>
    </div>
  )
}