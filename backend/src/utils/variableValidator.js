// variableValidator.js
// After Agent 4 assembles the final HTML page,
// this function scans it to make sure no --VARIABLE-- placeholders
// were left unfilled. If any remain, we clean them up silently.
// The recipient should NEVER see raw --VARIABLE-- text on the page.

function validate(html) {
  // This regex finds anything matching --UPPERCASE_WITH_UNDERSCORES--
  const pattern = /--[A-Z_]+--/g
  const remaining = html.match(pattern) || []

  if (remaining.length > 0) {
    console.error('Assembler: unfilled variables found:', remaining)
    return { valid: false, unfilled: remaining }
  }

  return { valid: true, unfilled: [] }
}

module.exports = { validate }