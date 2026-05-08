function getSkeleton() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Something made for you</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"><\/script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"><\/script>

  <style>
    :root {
      --primary: --CSS_PRIMARY--;
      --accent: --CSS_ACCENT--;
      --bg: --CSS_BG--;
      --text: --CSS_TEXT--;
      --font-heading: '--CSS_FONT_HEADING--';
      --font-body: '--CSS_FONT_BODY--';
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-body), 'Inter', sans-serif;
      overflow: hidden;
      width: 100vw;
      height: 100vh;
    }

    /* ── Sections ───────────────────────────────────── */
    .glitch-section {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      opacity: 0;
      pointer-events: none;
      transition: none;
    }

    .glitch-section.active {
      opacity: 1;
      pointer-events: all;
    }

    /* ── Progress rail ──────────────────────────────── */
    #glitch-progress {
      position: fixed;
      right: clamp(1.2rem, 3vw, 2rem);
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0;
      z-index: 9999;
    }

    /* Connecting line between dots */
    #glitch-progress-rail {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 1px;
      background: linear-gradient(
        to bottom,
        transparent,
        rgba(255,255,255,0.08) 15%,
        rgba(255,255,255,0.08) 85%,
        transparent
      );
      pointer-events: none;
      z-index: 0;
    }

    /* Fill line that animates as user progresses */
    #glitch-progress-fill {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 1px;
      background: linear-gradient(
        to bottom,
        transparent,
        var(--accent),
        var(--accent)
      );
      height: 0%;
      pointer-events: none;
      z-index: 1;
      transition: height 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .glitch-dot-wrap {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 28px;
      cursor: pointer;
    }

    .glitch-dot {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: rgba(255,255,255,0.15);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }

    /* Outer ring for active dot */
    .glitch-dot::before {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 1px solid transparent;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .glitch-dot.active {
      background: var(--accent, #e63946);
      width: 6px;
      height: 6px;
      box-shadow: 0 0 10px color-mix(in srgb, var(--accent, #e63946) 60%, transparent);
    }

    .glitch-dot.active::before {
      border-color: color-mix(in srgb, var(--accent, #e63946) 35%, transparent);
    }

    .glitch-dot.visited {
      background: rgba(255,255,255,0.35);
    }

    /* Tooltip on hover */
    .glitch-dot-wrap:hover .glitch-dot-label {
      opacity: 1;
      transform: translateX(0);
    }

    .glitch-dot-label {
      position: absolute;
      right: calc(100% + 10px);
      top: 50%;
      transform: translateY(-50%) translateX(6px);
      font-size: 0.5rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.4);
      white-space: nowrap;
      opacity: 0;
      transition: all 0.25s ease;
      pointer-events: none;
      font-family: 'Inter', sans-serif;
    }

    /* ── Section counter ────────────────────────────── */
    #glitch-counter {
      position: fixed;
      right: clamp(1.2rem, 3vw, 2rem);
      bottom: clamp(1.5rem, 4vw, 2.5rem);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 3px;
      pointer-events: none;
    }

    #glitch-counter .counter-current {
      font-size: 0.6rem;
      letter-spacing: 0.2em;
      color: var(--accent, #e63946);
      font-family: 'Inter', sans-serif;
      font-weight: 300;
      line-height: 1;
    }

    #glitch-counter .counter-total {
      font-size: 0.5rem;
      letter-spacing: 0.15em;
      color: rgba(255,255,255,0.2);
      font-family: 'Inter', sans-serif;
      font-weight: 300;
      line-height: 1;
    }

    /* ── Hint ───────────────────────────────────────── */
    #glitch-hint {
      position: fixed;
      bottom: clamp(1.5rem, 4vw, 2.5rem);
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      pointer-events: none;
    }

    #glitch-hint .hint-text {
      font-size: 0.5rem;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.2);
      font-family: 'Inter', sans-serif;
      font-weight: 300;
    }

    #glitch-hint .hint-line {
      width: 1px;
      height: 24px;
      background: linear-gradient(to bottom, rgba(255,255,255,0.2), transparent);
      animation: pulseDown 2s ease-in-out infinite;
    }

    @keyframes pulseDown {
      0%, 100% { opacity: 0.4; transform: scaleY(1); }
      50% { opacity: 1; transform: scaleY(1.15); }
    }

    /* ── Page transition flash ──────────────────────── */
    #glitch-flash {
      position: fixed;
      inset: 0;
      background: var(--accent, #e63946);
      opacity: 0;
      pointer-events: none;
      z-index: 8888;
    }

    /* ── Cinematic letterbox bars ───────────────────── */
    #glitch-bar-top,
    #glitch-bar-bottom {
      position: fixed;
      left: 0;
      right: 0;
      height: 0px;
      background: #000;
      z-index: 8000;
      pointer-events: none;
      transition: height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    #glitch-bar-top { top: 0; }
    #glitch-bar-bottom { bottom: 0; }

    body.cinematic #glitch-bar-top,
    body.cinematic #glitch-bar-bottom {
      height: clamp(16px, 3vh, 28px);
    }
  </style>
</head>
<body class="cinematic">

<!-- Cinematic letterbox -->
<div id="glitch-bar-top"></div>
<div id="glitch-bar-bottom"></div>

<!-- Flash overlay for transitions -->
<div id="glitch-flash"></div>

<!-- Progress rail -->
<div id="glitch-progress">
  <div id="glitch-progress-rail"></div>
  <div id="glitch-progress-fill"></div>
</div>

<!-- Section counter -->
<div id="glitch-counter">
  <div class="counter-current" id="counter-current">01</div>
  <div class="counter-total" id="counter-total">/ 08</div>
</div>

<!-- Hint -->
<div id="glitch-hint">
  <div class="hint-text">continue</div>
  <div class="hint-line"></div>
</div>

<!-- Sections -->
<div class="glitch-section" id="section-0">
--LOADING_COMPONENT--
</div>

<div class="glitch-section" id="section-1">
--HERO_COMPONENT--
</div>

<div class="glitch-section" id="section-2">
--WHO_SHE_IS_COMPONENT--
</div>

<div class="glitch-section" id="section-3">
--MEMORIES_COMPONENT--
</div>

<div class="glitch-section" id="section-4">
--CORE_MESSAGE_COMPONENT--
</div>

<div class="glitch-section" id="section-5">
--THE_MOMENT_COMPONENT--
</div>

<div class="glitch-section" id="section-6">
--REVEAL_COMPONENT--
</div>

<div class="glitch-section" id="section-7">
--ENDING_COMPONENT--
</div>

<script>
  gsap.registerPlugin(ScrollTrigger);

  const SECTION_LABELS = [
    'opening', 'her name', 'who she is',
    'memories', 'the message', 'the moment',
    'the reveal', 'ending'
  ]

  // Flag: component called advance() — skip doc click listener for same event
  let _componentJustAdvanced = false

  window.glitchEvents = {
    sectionReady: () => document.dispatchEvent(new CustomEvent('glitch:sectionReady')),
    revealed: () => document.dispatchEvent(new CustomEvent('glitch:revealed')),
    ended: () => document.dispatchEvent(new CustomEvent('glitch:ended')),
    advance: () => {
      _componentJustAdvanced = true
      setTimeout(() => { _componentJustAdvanced = false }, 50)
      GlitchNav.next()
    }
  }

  const GlitchNav = {
    current: 0,
    total: 8,
    locked: false,

    init() {
      const progressEl = document.getElementById('glitch-progress')
      const rail = document.getElementById('glitch-progress-rail')

      // Build dots
      for (let i = 0; i < this.total; i++) {
        const wrap = document.createElement('div')
        wrap.className = 'glitch-dot-wrap'
        wrap.setAttribute('aria-label', SECTION_LABELS[i])

        const dot = document.createElement('div')
        dot.className = 'glitch-dot'
        dot.dataset.index = i

        const label = document.createElement('div')
        label.className = 'glitch-dot-label'
        label.textContent = SECTION_LABELS[i]

        wrap.appendChild(dot)
        wrap.appendChild(label)
        wrap.addEventListener('click', (e) => {
          e.stopPropagation()
          this.goTo(i)
        })
        progressEl.appendChild(wrap)
      }

      // Set rail height after dots are in DOM
      requestAnimationFrame(() => {
        const firstDot = progressEl.querySelector('.glitch-dot-wrap')
        const lastDot = progressEl.querySelectorAll('.glitch-dot-wrap')
        if (firstDot && lastDot.length) {
          const h = lastDot[lastDot.length - 1].offsetTop + lastDot[lastDot.length - 1].offsetHeight - firstDot.offsetTop
          rail.style.height = h + 'px'
          rail.style.top = firstDot.offsetTop + 'px'
          document.getElementById('glitch-progress-fill').style.top = firstDot.offsetTop + 'px'
          document.getElementById('glitch-progress-fill').style.maxHeight = h + 'px'
        }
      })

      this.goTo(0)

      // Global fallback click
      document.addEventListener('click', (e) => {
        if (_componentJustAdvanced) return
        const tag = e.target.tagName.toLowerCase()
        if (['button', 'input', 'a', 'textarea', 'select'].includes(tag)) return
        this.next()
      })

      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
          e.preventDefault(); this.next()
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault(); this.prev()
        }
      })

      document.addEventListener('glitch:sectionReady', () => {
        setTimeout(() => this.next(), 500)
      })
    },

    updateProgressFill(index) {
      const fill = document.getElementById('glitch-progress-fill')
      const wraps = document.querySelectorAll('.glitch-dot-wrap')
      if (!wraps.length) return
      const pct = this.total <= 1 ? 0 : (index / (this.total - 1)) * 100
      fill.style.height = pct + '%'
    },

    updateCounter(index) {
      const cur = document.getElementById('counter-current')
      const tot = document.getElementById('counter-total')
      if (cur) cur.textContent = String(index + 1).padStart(2, '0')
      if (tot) tot.textContent = '/ ' + String(this.total).padStart(2, '0')
    },

    flashTransition() {
      const flash = document.getElementById('glitch-flash')
      gsap.to(flash, {
        opacity: 0.04,
        duration: 0.08,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to(flash, { opacity: 0, duration: 0.3, ease: 'power1.out' })
        }
      })
    },

    goTo(index) {
      if (index < 0 || index >= this.total) return
      if (this.locked) return
      this.locked = true

      const sections = document.querySelectorAll('.glitch-section')
      const dots = document.querySelectorAll('.glitch-dot')
      const hint = document.getElementById('glitch-hint')
      const counter = document.getElementById('glitch-counter')

      // Subtle flash on transition
      this.flashTransition()

      // Hide current
      const currentSection = sections[this.current]
      gsap.to(currentSection, {
        opacity: 0,
        duration: 0.45,
        ease: 'power2.inOut',
        onComplete: () => {
          currentSection.classList.remove('active')
          currentSection.style.opacity = ''
        }
      })

      // Show new
      const newSection = sections[index]
      newSection.classList.add('active')

      setTimeout(() => {
        document.dispatchEvent(new CustomEvent('glitch:enter', { detail: { index } }))
      }, 350)

      gsap.fromTo(newSection,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.65,
          delay: 0.25,
          ease: 'power2.inOut',
          onComplete: () => { this.locked = false }
        }
      )

      // Update dots
      dots.forEach((dot, i) => {
        dot.classList.remove('active', 'visited')
        if (i < index) dot.classList.add('visited')
        if (i === index) dot.classList.add('active')
      })

      // Progress fill
      this.updateProgressFill(index)

      // Counter
      this.updateCounter(index)

      // Hint — hide on loading and last section
      const showHint = index > 0 && index < this.total - 1
      if (hint) {
        if (showHint) {
          hint.style.display = 'flex'
          gsap.to(hint, { opacity: 1, duration: 0.5, delay: 0.8 })
        } else {
          gsap.to(hint, {
            opacity: 0,
            duration: 0.4,
            onComplete: () => { hint.style.display = 'none' }
          })
        }
      }

      // Counter — hide on loading section
      if (counter) {
        gsap.to(counter, {
          opacity: index === 0 ? 0 : 1,
          duration: 0.4,
          delay: index === 0 ? 0 : 0.6
        })
      }

      this.current = index
    },

    next() { if (this.current < this.total - 1) this.goTo(this.current + 1) },
    prev() { if (this.current > 0) this.goTo(this.current - 1) }
  }

  document.addEventListener('DOMContentLoaded', () => GlitchNav.init())
  if (document.readyState !== 'loading') GlitchNav.init()
<\/script>

  
</body>
</html>`
}

module.exports = { getSkeleton }