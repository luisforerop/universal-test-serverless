export default {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      questionId: { type: 'string' },
      selectedAnswerId: { type: 'string' },
    },
  },
  required: ['questionId', 'selectedAnswerId'],
} as const
