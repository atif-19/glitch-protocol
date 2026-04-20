function getSkeleton() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Something made for you</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
  
  <!-- GSAP loaded in head so all component scripts can use it immediately -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"><\/script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"><\/script>
  <script>
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    // Global event system — available to all components
    window.glitchEvents = {
      sectionReady: () => document.dispatchEvent(new CustomEvent('glitch:sectionReady')),
      revealed: () => document.dispatchEvent(new CustomEvent('glitch:revealed')),
      ended: () => document.dispatchEvent(new CustomEvent('glitch:ended'))
    }
  <\/script>

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
      overflow-x: hidden;
    }
  </style>
</head>
<body>

--LOADING_COMPONENT--

--HERO_COMPONENT--

--WHO_SHE_IS_COMPONENT--

--MEMORIES_COMPONENT--

--CORE_MESSAGE_COMPONENT--

--THE_MOMENT_COMPONENT--

--REVEAL_COMPONENT--

--ENDING_COMPONENT--

</body>
</html>`
}

module.exports = { getSkeleton }