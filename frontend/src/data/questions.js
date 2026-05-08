// src/data/questions.js

export function getQuestions(occasion) {
  if (occasion === 'bro') return broQuestions
  if (occasion === 'birthday') return birthdayQuestions
  if (occasion === 'apology') return apologyQuestions
  return []
}

// ─── BRO MODE — 5 questions only ─────────────────────────────────────────────

const broQuestions = [
  {
    id: 'recipient_name',
    label: "What's his name?",
    sublabel: 'First name is fine.',
    type: 'text',
    placeholder: "Rahul, Yash, Dev...",
  },
  {
    id: 'obsession',
    label: "What is he actually obsessed with?",
    sublabel: 'The thing he brings up in every conversation.',
    type: 'text',
    placeholder: "FIFA, gym, bikes, cricket, coding, F1...",
  },
  {
    id: 'roast',
    label: "One thing he does that everyone clocks but he thinks is cool?",
    sublabel: 'This goes on the page. Keep it real.',
    type: 'textarea',
    placeholder: "Acts like he doesn't care about his hair but spends 20 mins on it...",
  },
  {
    id: 'real_talk',
    label: "One thing you'd never say to his face but actually mean?",
    sublabel: "This is the one real moment on the page. Don't overthink it.",
    type: 'textarea',
    placeholder: "He's genuinely the most reliable person I know...",
  },
  {
    id: 'vibe',
    label: "What's the vibe?",
    sublabel: 'This controls the tone of the whole page.',
    type: 'cards',
    options: [
      { value: 'full_roast', label: '🔥 Full Roast', desc: '90% jokes, one gut punch at the end' },
      { value: 'mostly_roast', label: '😏 Mostly Roast', desc: 'Funny but lands somewhere real' },
      { value: 'wholesome', label: '🤝 Actually Wholesome', desc: 'Still has jokes but genuinely hits' },
    ]
  }
]

// ─── BIRTHDAY — your existing 14 questions ───────────────────────────────────

const birthdayQuestions = [
  {
    id: 'recipient_name',
    label: "What's her name?",
    sublabel: 'First name only is fine.',
    type: 'text',
    placeholder: 'Zara, Priya, Aisha...',
  },
  {
    id: 'relationship',
    label: 'Your relationship?',
    sublabel: 'How do you know each other.',
    type: 'text',
    placeholder: 'Best friend, girlfriend, sister...',
  },
  {
    id: 'obsession',
    label: 'What is she obsessed with?',
    sublabel: 'The most important answer. Be specific.',
    type: 'text',
    placeholder: 'Harry Potter, Taylor Swift, dark academia...',
  },
  {
    id: 'favorites',
    label: 'Favorite color, aesthetic, song, movie, food?',
    sublabel: 'As many as you know.',
    type: 'textarea',
    placeholder: 'Blue, vintage, Anti-Hero, Interstellar, pasta...',
  },
  {
    id: 'personality',
    label: 'Her personality in one honest sentence?',
    sublabel: 'Not a compliment — an observation.',
    type: 'textarea',
    placeholder: 'She makes everyone feel like the most important person in the room.',
  },
  {
    id: 'photos',
    label: 'Any photos? (optional)',
    sublabel: 'Up to 3. Skip if you want.',
    type: 'photo',
    optional: true,
  },
  {
    id: 'memories',
    label: 'Inside moments — things only you two know?',
    sublabel: 'Three if you can.',
    type: 'textarea',
    placeholder: 'The auto ride back from the fest, the 2am call when she was scared...',
  },
  {
    id: 'first_memory',
    label: 'First memory of her?',
    sublabel: 'The very first one.',
    type: 'textarea',
    placeholder: 'She was laughing at something and I remember thinking...',
  },
  {
    id: 'small_things',
    label: 'Small things you quietly notice about her?',
    sublabel: 'The things she does without realising.',
    type: 'textarea',
    placeholder: 'The way she tucks her hair, how she always checks if everyone ate...',
  },
  {
    id: 'meaning',
    label: 'What does she mean to you?',
    sublabel: 'The emotional core of the whole page.',
    type: 'textarea',
    placeholder: 'Be honest. No one else is reading this except her.',
  },
  {
    id: 'birthday_ask',
    label: 'The cute ask or plan?',
    sublabel: 'What do you actually want on her birthday.',
    type: 'textarea',
    placeholder: 'I just want one day where you let me do everything...',
  },
  {
    id: 'unsaid_thing',
    label: 'One thing never said directly?',
    sublabel: 'This is the hidden reveal at the end.',
    type: 'text',
    placeholder: "You're the reason I try harder.",
  },
  {
    id: 'song',
    label: "Her song?",
    sublabel: 'The one that plays at the end of her page.',
    type: 'text',
    placeholder: 'Cornfield Chase, Lover, Tum Se Hi...',
  },
  {
    id: 'vibe',
    label: "Overall vibe?",
    sublabel: 'Controls the visual energy of the whole page.',
    type: 'cards',
    options: [
      { value: 'dreamy', label: '🌙 Dreamy', desc: 'Soft, emotional, floaty' },
      { value: 'cinematic', label: '🎬 Cinematic', desc: 'Dramatic, bold, filmy' },
      { value: 'playful', label: '✨ Playful', desc: 'Fun, colourful, light' },
      { value: 'minimal', label: '🤍 Minimal', desc: 'Clean, quiet, intentional' },
    ]
  }
]

// ─── APOLOGY — your existing questions ───────────────────────────────────────

const apologyQuestions = [
  {
    id: 'recipient_name',
    label: "What's her name?",
    sublabel: 'First name only.',
    type: 'text',
    placeholder: 'Zara, Priya, Aisha...',
  },
  {
    id: 'relationship',
    label: 'Your relationship?',
    type: 'text',
    placeholder: 'Girlfriend, best friend, sister...',
  },
  {
    id: 'obsession',
    label: 'What is she obsessed with?',
    sublabel: 'Drives the entire visual theme.',
    type: 'text',
    placeholder: 'Taylor Swift, Studio Ghibli, dark academia...',
  },
  {
    id: 'favorites',
    label: 'Favorite color, aesthetic, song?',
    type: 'textarea',
    placeholder: 'Purple, cottagecore, All Too Well...',
  },
  {
    id: 'personality',
    label: 'Her personality in one honest sentence?',
    type: 'textarea',
    placeholder: 'She feels everything deeply and never shows it.',
  },
  {
    id: 'memories',
    label: 'Three inside moments only you two know?',
    type: 'textarea',
    placeholder: 'The argument on the terrace, the makeup call at midnight...',
  },
  {
    id: 'first_memory',
    label: 'Your first memory of her?',
    type: 'textarea',
    placeholder: 'Before everything got complicated...',
  },
  {
    id: 'small_things',
    label: 'Small things you quietly notice about her?',
    type: 'textarea',
    placeholder: 'How she goes quiet when she\'s hurt instead of saying it...',
  },
  {
    id: 'meaning',
    label: 'What does she mean to you?',
    type: 'textarea',
    placeholder: 'Honest. Real. No performance.',
  },
  {
    id: 'scenario',
    label: "What happened and what are you sorry for?",
    sublabel: 'This is The Moment section — be specific.',
    type: 'textarea',
    placeholder: 'I said something I didn\'t mean when I was frustrated and...',
  },
  {
    id: 'unsaid_thing',
    label: 'One thing never said directly?',
    sublabel: 'The hidden reveal.',
    type: 'text',
    placeholder: "I'm scared of losing you.",
  },
  {
    id: 'song',
    label: "Her song?",
    type: 'text',
    placeholder: 'The one that reminds you of her.',
  },
  {
    id: 'vibe',
    label: "Overall vibe?",
    type: 'cards',
    options: [
      { value: 'dreamy', label: '🌙 Dreamy', desc: 'Soft, emotional, floaty' },
      { value: 'cinematic', label: '🎬 Cinematic', desc: 'Dramatic, bold, filmy' },
      { value: 'minimal', label: '🤍 Minimal', desc: 'Clean, quiet, intentional' },
    ]
  }
]