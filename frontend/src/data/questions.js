// questions.js
// All 14 questions for the form flow
// Each question has: id, label, question, type, placeholder/options
// 'showFor' means the question only appears for that occasion
// No showFor = appears for both occasions

export function getQuestions(occasion) {
  const all = [
    {
      id: 'recipient_name',
      label: 'Question 1',
      question: "What's her name? And what is she to you?",
      type: 'text',
      placeholder: 'e.g. Zara, my girlfriend',
    },
    {
      id: 'obsession',
      label: 'Question 2',
      question: 'What is she completely obsessed with?',
      type: 'text',
      placeholder: 'e.g. Harry Potter, Taylor Swift, dark academia...',
    },
    {
      id: 'favorites',
      label: 'Question 3',
      question: 'Her favorite color, a song she loves, and her aesthetic in one word.',
      type: 'text',
      placeholder: 'e.g. deep purple, The 1 by Taylor Swift, vintage',
    },
    {
      id: 'personality',
      label: 'Question 4',
      question: 'Describe her personality in one honest sentence.',
      type: 'text',
      placeholder: 'e.g. she is quiet but notices absolutely everything',
    },
    {
      id: 'inside_moments',
      label: 'Question 5',
      question: 'Three inside moments — things only you two would understand.',
      type: 'textarea',
      placeholder: 'e.g. the library on third floor every tuesday, the mango ice cream incident, her laugh when she tries not to laugh...',
    },
    {
      id: 'first_memory',
      label: 'Question 6',
      question: 'What is your first real memory of her?',
      type: 'textarea',
      placeholder: 'The moment you knew she was different.',
    },
    {
      id: 'small_things',
      label: 'Question 7',
      question: 'Small things you quietly notice about her.',
      type: 'textarea',
      placeholder: 'e.g. she always orders the same coffee, she hums when she reads, the way she tucks her hair...',
    },
    {
      id: 'meaning',
      label: 'Question 8',
      question: 'What does she mean to you? Say it like no one is reading.',
      type: 'textarea',
      placeholder: 'This becomes the emotional core of the entire page.',
    },
    // Apology only
    {
      id: 'scenario',
      label: 'Question 9',
      question: 'What happened? What are you sorry for?',
      type: 'textarea',
      placeholder: 'Be honest. The AI will turn it into something she will remember.',
      showFor: 'apology',
    },
    // Birthday only
    {
      id: 'birthday_ask',
      label: 'Question 9',
      question: 'The cute ask or plan. What do you want to happen after she reads this?',
      type: 'textarea',
      placeholder: 'e.g. I want to take her to that rooftop place she has been talking about.',
      showFor: 'birthday',
    },
    {
      id: 'unsaid_thing',
      label: 'Question 10',
      question: 'One thing you have never said to her directly.',
      type: 'text',
      placeholder: 'This becomes the hidden message she unlocks at the end.',
    },
    {
      id: 'vibe',
      label: 'Question 11',
      question: 'What vibe should the page have?',
      type: 'cards',
      options: [
        { value: 'dreamy', label: 'Dreamy', emoji: '🌙', description: 'Soft, hazy, emotional' },
        { value: 'cinematic', label: 'Cinematic', emoji: '🎬', description: 'Bold, dramatic, intense' },
        { value: 'playful', label: 'Playful', emoji: '✨', description: 'Light, fun, warm' },
        { value: 'minimal', label: 'Minimal', emoji: '🤍', description: 'Clean, quiet, powerful' },
      ]
    },
    {
      id: 'photos',
      label: 'Question 12',
      question: 'Add up to 3 photos of her (optional but makes it personal).',
      type: 'text',
      placeholder: 'Skip for now — type "skip" or paste an image URL',
    },
    {
      id: 'song',
      label: 'Question 13',
      question: "Her favorite song — or the one that reminds you of her.",
      type: 'text',
      placeholder: 'e.g. Cornelia Street by Taylor Swift',
    },
  ]

  // Filter out questions that don't belong to the current occasion
  return all.filter(q => !q.showFor || q.showFor === occasion)
}