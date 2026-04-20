import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axiosInstance'

export default function ExperiencePage() {
  const { slug } = useParams()
  const [html, setHtml] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [passwordRequired, setPasswordRequired] = useState(false)
  const [password, setPassword] = useState('')
  const [wrongPassword, setWrongPassword] = useState(false)

  useEffect(() => {
    fetchPage()
  }, [slug])

  async function fetchPage(pw) {
    setLoading(true)
    try {
      const url = pw ? `/api/page/${slug}?password=${encodeURIComponent(pw)}` : `/api/page/${slug}`
      const res = await api.get(url)

      if (res.data.password_required) {
        setPasswordRequired(true)
        setLoading(false)
        return
      }

    if (res.data.success && res.data.html) {
      setPasswordRequired(false)  // ← this line was missing
      setWrongPassword(false)
      setHtml(res.data.html)
      setLoading(false)
      return
    }
    
    } catch (err) {
      if (err.response?.status === 401) {
        setWrongPassword(true)
        setLoading(false)
        return
      }
      setError('This experience could not be found.')
      setLoading(false)
    }
  }

  function handlePasswordSubmit() {
    if (!password.trim()) return
    setWrongPassword(false)
    fetchPage(password)
  }

  if (loading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-zinc-500 text-sm tracking-widest uppercase animate-pulse">Loading...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="text-zinc-500">{error}</p>
    </div>
  )

  if (passwordRequired || wrongPassword) return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 gap-6">
      <p
        className="text-2xl font-bold"
        style={{ fontFamily: 'Playfair Display, serif' }}
      >
        This experience is protected.
      </p>
      <p className="text-zinc-500 text-sm">Enter the password to continue.</p>
      {wrongPassword && <p className="text-red-400 text-sm">Wrong password. Try again.</p>}
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handlePasswordSubmit()}
        placeholder="Password..."
        className="bg-zinc-950 border border-zinc-700 text-white px-4 py-3 rounded outline-none focus:border-zinc-400 w-full max-w-xs text-center"
        autoFocus
      />
      <button
        onClick={handlePasswordSubmit}
        className="bg-white text-black px-8 py-3 font-semibold hover:bg-zinc-200 transition-colors"
      >
        Enter →
      </button>
    </div>
  )

  return (
    <iframe
      srcDoc={html}
      style={{ width: '100vw', height: '100vh', border: 'none' }}
      title="Your experience"
    />
  )
}