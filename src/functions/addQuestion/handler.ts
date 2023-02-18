import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway'
import { formatJSONResponse } from '@libs/api-gateway'
import { middyfy } from '@libs/lambda'
import { DynamoDB } from 'aws-sdk'
import { v4 } from 'uuid'

import schema from './schema'

const addQuestion: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const { answers, question, reason } = event.body

  const answersToSave = []
  let correctAnswerId = ''

  for (const { answer, isCorrect } of answers) {
    const id = v4()
    if (isCorrect) {
      correctAnswerId = id
    }
    answersToSave.push({
      answer,
      id,
    })
  }

  const questionToSave = {
    id: v4(),
    question,
    reason,
    answers: answersToSave,
    correctAnswerId,
  }

  if (!correctAnswerId) {
    return formatJSONResponse({
      message: 'The question must have a correct answer',
      statusCode: 400,
    })
  }

  const dynamodB = new DynamoDB.DocumentClient()
  await dynamodB
    .put({
      TableName: 'ContestQuestions',
      Item: questionToSave,
    })
    .promise()

  return formatJSONResponse({
    message: 'The question was added',
    statusCode: 200,
    question: JSON.stringify(questionToSave),
  })
}

export const main = middyfy(addQuestion)
