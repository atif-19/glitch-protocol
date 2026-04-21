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

    /* Each section takes full screen */
    .glitch-section {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      opacity: 0;
      pointer-events: none;
      transition: none;
    }

    /* Active section is visible */
    .glitch-section.active {
      opacity: 1;
      pointer-events: all;
    }

    /* Progress dots */
    #glitch-progress {
      position: fixed;
      right: clamp(1rem, 3vw, 2rem);
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      gap: 8px;
      z-index: 9999;
    }

    .glitch-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .glitch-dot.active {
      background: var(--accent, #e63946);
      transform: scale(1.4);
    }

    .glitch-dot.visited {
      background: rgba(255,255,255,0.5);
    }

    /* Click hint */
    #glitch-hint {
      position: fixed;
      bottom: clamp(1.5rem, 4vw, 2.5rem);
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      pointer-events: none;
    }

    #glitch-hint .hint-text {
      font-size: 0.65rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.3);
    }

    #glitch-hint .hint-arrow {
      color: rgba(255,255,255,0.3);
      font-size: 1rem;
      animation: bounceY 1.5s ease-in-out infinite;
    }

    @keyframes bounceY {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(6px); }
    }
  </style>
</head>
<body>

<!-- Progress dots -->
<div id="glitch-progress"></div>

<!-- Click hint -->
<div id="glitch-hint">
  <div class="hint-text">tap to continue</div>
  <div class="hint-arrow">↓</div>
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

  // Global event system
  window.glitchEvents = {
    sectionReady: () => document.dispatchEvent(new CustomEvent('glitch:sectionReady')),
    revealed: () => document.dispatchEvent(new CustomEvent('glitch:revealed')),
    ended: () => document.dispatchEvent(new CustomEvent('glitch:ended')),
    advance: () => GlitchNav.next()
  }

  // Navigation controller
  const GlitchNav = {
    current: 0,
    total: 8,
    locked: false, // locked during transitions

    init() {
      // Build progress dots
      const progressEl = document.getElementById('glitch-progress')
      for (let i = 0; i < this.total; i++) {
        const dot = document.createElement('div')
        dot.className = 'glitch-dot'
        dot.dataset.index = i
        dot.addEventListener('click', (e) => {
          e.stopPropagation()
          this.goTo(i)
        })
        progressEl.appendChild(dot)
      }

      // Show first section
      this.goTo(0)

      // Click anywhere to advance
      document.addEventListener('click', (e) => {
        // Don't advance if clicking a button, input, or interactive element
        const tag = e.target.tagName.toLowerCase()
        const isInteractive = ['button', 'input', 'a', 'textarea', 'select'].includes(tag)
        const hasRole = e.target.closest('[role="button"]') || e.target.closest('.rv-box')
        if (isInteractive || hasRole) return
        this.next()
      })

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
          e.preventDefault()
          this.next()
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault()
          this.prev()
        }
      })

      // Hide hint after first advance
      document.addEventListener('glitch:sectionReady', () => {
        // Loading done — auto advance to hero
        setTimeout(() => this.next(), 500)
      })
    },

    goTo(index) {
      if (index < 0 || index >= this.total) return
      if (this.locked) return
      this.locked = true

      const sections = document.querySelectorAll('.glitch-section')
      const dots = document.querySelectorAll('.glitch-dot')
      const hint = document.getElementById('glitch-hint')

      // Hide current section
      const currentSection = sections[this.current]
      gsap.to(currentSection, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => {
          currentSection.classList.remove('active')
          currentSection.style.opacity = ''
        }
      })

      // Show new section
      const newSection = sections[index]
      newSection.classList.add('active')
      // Fire section-specific enter event
setTimeout(() => {
  document.dispatchEvent(new CustomEvent('glitch:enter', { detail: { index } }))
}, 350)
      gsap.fromTo(newSection,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          delay: 0.3,
          ease: 'power2.inOut',
          onComplete: () => {
            this.locked = false
          }
        }
      )

      // Update dots
      dots.forEach((dot, i) => {
        dot.classList.remove('active')
        if (i < index) dot.classList.add('visited')
        if (i === index) dot.classList.add('active')
      })

      // Hide hint on last section
      if (index === this.total - 1 && hint) {
        gsap.to(hint, { opacity: 0, duration: 0.5 })
      } else if (hint) {
        gsap.to(hint, { opacity: 1, duration: 0.5 })
      }

      // Hide hint on loading section
      if (index === 0 && hint) {
        hint.style.display = 'none'
      } else if (hint) {
        hint.style.display = 'flex'
      }

      this.current = index
    },

    next() {
      if (this.current < this.total - 1) {
        this.goTo(this.current + 1)
      }
    },

    prev() {
      if (this.current > 0) {
        this.goTo(this.current - 1)
      }
    }
  }

  // Start navigation after DOM is ready
  document.addEventListener('DOMContentLoaded', () => GlitchNav.init())
  // Fallback if DOMContentLoaded already fired
  if (document.readyState !== 'loading') GlitchNav.init()
<\/script>

</body>
</html>`
}

module.exports = { getSkeleton }