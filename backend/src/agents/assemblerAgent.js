// assemblerAgent.js — Agent 4: The Assembler
// Takes 8 component HTML strings + all variables
// Builds the complete final HTML page
// Zero AI calls — pure Node.js string operations

const { getSkeleton } = require('../utils/htmlSkeleton')
const { validate } = require('../utils/variableValidator')

async function run(components, variables, cssData) {
  // Start with the master skeleton
  let page = getSkeleton()

  // Step 1 — Insert each component into its slot
  // components is { loading: doc, hero: doc, ... }
  const sectionSlots = {
    loading: '--LOADING_COMPONENT--',
    hero: '--HERO_COMPONENT--',
    who_she_is: '--WHO_SHE_IS_COMPONENT--',
    memories: '--MEMORIES_COMPONENT--',
    core_message: '--CORE_MESSAGE_COMPONENT--',
    the_moment: '--THE_MOMENT_COMPONENT--',
    reveal: '--REVEAL_COMPONENT--',
    ending: '--ENDING_COMPONENT--'
  }

  for (const [sectionType, slot] of Object.entries(sectionSlots)) {
    const component = components[sectionType]
    if (!component) {
      console.warn(`Assembler: missing component for ${sectionType}`)
      page = page.replace(slot, '')
      continue
    }
    page = page.replace(slot, component.code)
  }

  // Step 2 — Inject CSS variables from Agent 1 output
  page = page.replace('--CSS_PRIMARY--', cssData.primary_color || '#1a1a2e')
  page = page.replace('--CSS_ACCENT--', cssData.accent_color || '#e63946')
  page = page.replace('--CSS_BG--', '#0a0a0a')
  page = page.replace('--CSS_TEXT--', '#ffffff')
  page = page.replace('--CSS_FONT_HEADING--', 'Playfair Display')
  page = page.replace('--CSS_FONT_BODY--', 'Inter')
  
  // Step 3 — Replace all text variables from Agent 3 output
  // variables is { TITLE: 'cinematic title', SUBTITLE: '...', ... }
  for (const [key, value] of Object.entries(variables)) {
    const safeValue = value ? value.toString().replace(/"/g, '&quot;') : ''
    // replaceAll replaces every occurrence across all 8 components
    page = page.split(`--${key}--`).join(safeValue)
  }

  // Step 4 — Validate — check no --VARS-- remain unfilled
  const { valid, unfilled } = validate(page)

  if (!valid) {
    // Clean up any remaining placeholders silently
    // Never show raw --VARIABLE-- text to recipient
    page = page.replace(/--[A-Z_]+--/g, '')
    console.warn('Assembler cleaned up unfilled vars:', unfilled)
  }

  return page
}

// Extract all --VARIABLE-- names from a component's code
// Used in controller to tell Agent 3 what variables to fill
function extractVariables(components) {
  const pattern = /--([A-Z_]+)--/g
  const vars = new Set()

  for (const component of Object.values(components)) {
    let match
    while ((match = pattern.exec(component.code)) !== null) {
      vars.add(match[1])
    }
    pattern.lastIndex = 0 // reset regex for next component
  }

  // Remove CSS variables — those are handled separately
  const cssVars = ['CSS_PRIMARY', 'CSS_ACCENT', 'CSS_BG', 'CSS_TEXT', 'CSS_FONT_HEADING', 'CSS_FONT_BODY']
  cssVars.forEach(v => vars.delete(v))

  return Array.from(vars)
}

module.exports = { run, extractVariables }