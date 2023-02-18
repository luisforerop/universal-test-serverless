export default {
  type: 'object',
  properties: {
    question: { type: 'string' },
    reason: { type: 'string' },
    answers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          answer: { type: 'string' },
          isCorrect: { type: 'boolean' },
        },
      },
    },
  },
  required: ['answers'],
} as const
