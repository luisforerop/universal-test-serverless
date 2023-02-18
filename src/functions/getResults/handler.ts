import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway'
import { formatJSONResponse } from '@libs/api-gateway'
import { middyfy } from '@libs/lambda'
import { DynamoDB } from 'aws-sdk'

import schema from './schema'

const getResults: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const answers = event.body
  const dynamodB = new DynamoDB.DocumentClient()

  const { Items: questions } = await dynamodB
    .scan({ TableName: 'ContestQuestions' })
    .promise()

  const results = answers.map(({ questionId, selectedAnswerId }) => {
    const question = questions.find((question) => question.id === questionId)
    return {
      questionId,
      selectedAnswerId,
      correctAnswerId: question.correctAnswerId,
    }
  })

  return formatJSONResponse({
    statusCode: 200,
    results,
  })
}

export const main = middyfy(getResults)
