// SharePage.jsx
// Redesigned — Futuristic, celebratory, agentic theme
// Shows the generated link with beautiful status tracking and settings

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFlow } from '../context/FlowContext'
import { useNavigate } from 'react-router-dom'
import api from '../api/axiosInstance'
import { 
  Link, Copy, CheckCheck, Send, Eye, EyeOff, 
  Shield, Lock, RefreshCw, ExternalLink, 
  Share2, Sparkles, Zap, Clock, Globe,
  MessageCircle, AlertCircle, ArrowLeft,
  Settings, ChevronRight, Loader2
} from 'lucide-react'

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
  const [showPreviewTooltip, setShowPreviewTooltip] = useState(false)
  const [linkHovered, setLinkHovered] = useState(false)

  if (!generatedUrl) {
    navigate('/')
    return null
  }

  // Poll every 8 seconds to check if recipient opened the link
  useEffect(() => {
    checkViewStatus()
    const interval = setInterval(checkViewStatus, 8000)
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
      // silently fail
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
      setTimeout(() => setSettingsSaved(false), 3000)
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

  function getTimeAgo(dateString) {
    if (!dateString) return null
    const diff = Date.now() - new Date(dateString).getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return formatViewTime(dateString)
  }

  return (
    <div className="min-h-screen bg-[#050510] text-white flex flex-col items-center justify-center px-4 sm:px-6 py-8 relative overflow-hidden">
      
      {/* Animated grid background */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Pulsing glow orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px]"
        style={{
          background: viewed 
            ? 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="w-full max-w-lg relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >

        {/* Success Header */}
        <div className="text-center mb-8">
          {/* Animated success icon */}
          <motion.div
            className="relative inline-flex items-center justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            {/* Outer ring */}
            <motion.div
              className="absolute inset-0 w-20 h-20 rounded-full border border-emerald-500/30"
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
            {/* Inner icon */}
            <motion.div
              className="relative w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center"
              animate={{ 
                boxShadow: [
                  '0 0 20px rgba(16,185,129,0.1)',
                  '0 0 40px rgba(16,185,129,0.2)',
                  '0 0 20px rgba(16,185,129,0.1)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <Sparkles className="w-8 h-8 text-emerald-400" />
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.h2
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-emerald-400">Experience Ready</span>
          </motion.h2>
          
          <motion.p
            className="text-zinc-500 text-sm font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            5 agents completed the build — here's your unique link
          </motion.p>
        </div>

        {/* URL Card */}
        <motion.div
          className="relative bg-zinc-950/80 backdrop-blur-sm border border-zinc-800 rounded-xl p-5 mb-4 group"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onMouseEnter={() => setLinkHovered(true)}
          onMouseLeave={() => setLinkHovered(false)}
        >
          {/* URL glow effect on hover */}
          <motion.div
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
          
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center">
              <Link className="w-5 h-5 text-emerald-400" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-xs text-zinc-500 font-mono mb-1 tracking-wider uppercase">Your Unique URL</p>
              <p className="text-sm text-zinc-300 font-mono truncate">
                {generatedUrl.replace('https://', '')}
              </p>
            </div>

            {/* Copy button */}
            <motion.button
              onClick={handleCopy}
              className={`flex-shrink-0 px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all duration-200 flex items-center gap-2 ${
                copied 
                  ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400' 
                  : 'bg-zinc-800 border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-750'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {copied ? (
                <>
                  <CheckCheck className="w-3.5 h-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* WhatsApp Share */}
          <motion.button
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-semibold text-sm transition-all duration-200 group"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <MessageCircle className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            WhatsApp
          </motion.button>

          {/* Preview */}
          <motion.a
            href={`/r/${generatedSlug}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 border border-zinc-700 hover:border-zinc-400 text-zinc-300 hover:text-white py-3 rounded-xl font-semibold text-sm transition-all duration-200 group"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            onMouseEnter={() => setShowPreviewTooltip(true)}
            onMouseLeave={() => setShowPreviewTooltip(false)}
          >
            <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Preview
            <ExternalLink className="w-3 h-3 opacity-50" />
          </motion.a>
        </div>

        {/* View Status Card */}
        <motion.div
          className={`relative rounded-xl p-5 mb-6 border transition-all duration-500 ${
            viewed 
              ? 'bg-emerald-500/5 border-emerald-500/20' 
              : 'bg-zinc-950/50 border-zinc-800'
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-start gap-4">
            {/* Status Indicator */}
            <div className="flex-shrink-0 mt-1">
              {viewed ? (
                <motion.div
                  className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center"
                  animate={{ 
                    boxShadow: [
                      '0 0 0px rgba(16,185,129,0)',
                      '0 0 20px rgba(16,185,129,0.2)',
                      '0 0 0px rgba(16,185,129,0)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Eye className="w-5 h-5 text-emerald-400" />
                </motion.div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center">
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Clock className="w-5 h-5 text-zinc-500" />
                  </motion.div>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              {viewed ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-emerald-400 font-semibold text-sm flex items-center gap-2">
                    She opened it
                    <motion.span
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      🎉
                    </motion.span>
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <p className="text-zinc-400 text-xs font-mono">
                      {viewCount} {viewCount === 1 ? 'view' : 'views'}
                    </p>
                    {firstViewedAt && (
                      <>
                        <span className="text-zinc-700">·</span>
                        <p className="text-zinc-500 text-xs font-mono">
                          First: {getTimeAgo(firstViewedAt)}
                        </p>
                      </>
                    )}
                  </div>
                  {viewCount > 1 && (
                    <p className="text-zinc-600 text-xs mt-1 font-mono">
                      She came back {viewCount} times
                    </p>
                  )}
                </motion.div>
              ) : (
                <div>
                  <p className="text-zinc-400 font-semibold text-sm">Waiting for her</p>
                  <p className="text-zinc-600 text-xs mt-1.5 font-mono">
                    Auto-checks every 8 seconds
                  </p>
                  <motion.div 
                    className="flex gap-1 mt-2"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                  </motion.div>
                </div>
              )}
            </div>

            {/* Refresh button */}
            <motion.button
              onClick={checkViewStatus}
              className="flex-shrink-0 p-2 rounded-lg hover:bg-zinc-800 transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              <RefreshCw className="w-4 h-4 text-zinc-600 hover:text-zinc-400 transition-colors" />
            </motion.button>
          </div>
        </motion.div>

        {/* Settings Card */}
        <motion.div
          className="border border-zinc-800 rounded-xl p-5 mb-6 bg-zinc-950/30"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Settings className="w-4 h-4 text-zinc-500" />
            <p className="text-xs font-mono tracking-[0.2em] text-zinc-500 uppercase">Security Options</p>
          </div>

          {/* Password Toggle */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-zinc-500" />
                </div>
                <div>
                  <p className="text-sm text-white font-medium">Password Protection</p>
                  <p className="text-xs text-zinc-600 font-mono">She'll need a password to view</p>
                </div>
              </div>
              
              {/* Custom Toggle Switch */}
              <motion.button
                onClick={() => setPasswordEnabled(p => !p)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ${
                  passwordEnabled ? 'bg-emerald-500' : 'bg-zinc-700'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md"
                  animate={{ left: passwordEnabled ? '26px' : '2px' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </motion.button>
            </div>

            {/* Password Input */}
            <AnimatePresence>
              {passwordEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <input
                      type="text"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Set a secret password..."
                      className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm px-4 py-3 rounded-xl outline-none focus:border-emerald-500/50 transition-all duration-200 font-mono placeholder:text-zinc-600"
                    />
                    <Shield className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Save Button */}
            <motion.button
              onClick={saveSettings}
              disabled={savingSettings || (passwordEnabled && !password.trim())}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                settingsSaved
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                  : 'bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:border-zinc-500'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
              whileTap={{ scale: 0.98 }}
            >
              {savingSettings ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : settingsSaved ? (
                <>
                  <CheckCheck className="w-4 h-4" />
                  Settings Saved
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Save Security Settings
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Bottom Actions */}
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          {/* Build Another */}
          <button
            onClick={() => { resetFlow(); navigate('/') }}
            className="text-zinc-600 hover:text-zinc-400 text-xs font-mono transition-colors flex items-center gap-1 group"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Build another experience
          </button>
        </motion.div>

        {/* Tip tooltip */}
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <p className="text-zinc-700 text-[10px] font-mono">
            <span className="text-zinc-600">💡</span> Pro tip: Send it when she least expects it
          </p>
        </motion.div>

      </motion.div>
    </div>
  )
}