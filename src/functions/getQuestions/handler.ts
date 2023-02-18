import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway'
import { formatJSONResponse } from '@libs/api-gateway'
import { middyfy } from '@libs/lambda'
import { DynamoDB } from 'aws-sdk'

import schema from './schema'

const getQuestions: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async () => {
  const dynamodB = new DynamoDB.DocumentClient()

  const { Items } = await dynamodB
    .scan({ TableName: 'ContestQuestions' })
    .promise()

  const questions = Items.map(({ correctAnswerId, ...rest }) => rest)

  return formatJSONResponse({
    statusCode: 200,
    questions: questions,
  })
}

export const main = middyfy(getQuestions)
