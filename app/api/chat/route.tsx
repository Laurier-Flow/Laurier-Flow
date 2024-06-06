import type { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { codeBlock, oneLine } from 'common-tags'
import GPT3Tokenizer from 'gpt3-tokenizer'
import {
  Configuration,
  OpenAIApi,
  CreateModerationResponse,
  CreateEmbeddingResponse,
  ChatCompletionRequestMessage,
} from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'

const openAiKey = process.env.OPENAI_KEY
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const config = new Configuration({
  apiKey: openAiKey,
})
const openai = new OpenAIApi(config)
export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    if (!openAiKey) {
      throw new Error('No openai key')
    }

    if (!supabaseUrl) {
      throw new Error('Missing environment variable SUPABASE_URL')
    }

    if (!supabaseAnonKey) {
      throw new Error('Missing environment variable SUPABASE_ANON_KEY')
    }

    const requestData = await req.json()

    if (!requestData) {
      throw new Error('Missing request data')
    }

    const { prompt: query } = requestData

    if (!query) {
      throw new Error('Missing query in request data')
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

    // Moderate the content to comply with OpenAI T&C
    const sanitizedQuery = query.trim()
    const moderationResponse: CreateModerationResponse = await openai
      .createModeration({ input: sanitizedQuery })
      .then((res) => res.json())

    const [results] = moderationResponse.results

    if (results.flagged) {
      throw new Error('Flagged content')
    }

    // Create embedding from query
    const embeddingResponse = await openai.createEmbedding({
      model: 'text-embedding-ada-002',
      input: sanitizedQuery.replaceAll('\n', ' '),
    })

    if (embeddingResponse.status !== 200) {
      throw new Error('Failed to create embedding for question, ' + embeddingResponse)
    }

    const {
      data: [{ embedding }],
    }: CreateEmbeddingResponse = await embeddingResponse.json()

    const { error: matchError, data: courses } = await supabaseClient.rpc(
      'match_courses',
      {
        embedding: embedding,
        match_threshold: 0.78,
        match_count: 10
      }
    )

    if (matchError) {
      throw new Error('Failed to match courses')
    }

    const tokenizer = new GPT3Tokenizer({ type: 'gpt3' })
    let tokenCount = 0
    let contextText = ''

    for (let i = 0; i < courses.length; i++) {
      const course = courses[i]
      const content = course.course_code + ' :' + course.course_title +  ' - ' + course.course_description
      const encoded = tokenizer.encode(content)
      tokenCount += encoded.text.length

      if (tokenCount >= 1500) {
        break
      }

      contextText += `${content.trim()}\n---\n`
    }

    const prompt = codeBlock`
      ${oneLine`
        You are a very enthusiastic Laurier student success representative who loves
        to help students! Given the following sections from the courses
        database, answer the question using only that information,
        outputted in text format. When returning courses,
        specify the course code along with course title and description, as well make an <a> tag surrounding the name example:
        '<a href={/course/BU 111}><b>BU 111: Intro to Business</b></a> - This course covers the basics of business management'.
        Ensure the href URL is '/course/COURSE CODE LETTERS | SPACE | COURSE CODE NUMBERS' similar to '/course/BU 111'
        After each talking point/subject paragraph, insert a newline '\n'
        If prerequisite or restriction information is available display it with 'Prerequisites: xxx, Restrictions: xxx'
        If asked who made Laurier Flow or who made this website, respond with 'Faizaan Qureshi, Muhammad Mujtaba, Abdullah Shahid, Soham Nagi, Shahrukh Qureshi, check out <a href='https://laurierflow.ca/about'><b>About</b></a> for more information'
      `}

      Context sections:
      ${contextText}

      Question: """
      ${sanitizedQuery}
      """

      Answer as text:
    `

    const chatMessage: ChatCompletionRequestMessage = {
      role: 'user',
      content: prompt,
    }

    const response = await openai.createChatCompletion({
      model: 'gpt-4o',
      messages: [chatMessage],
      max_tokens: 512,
      temperature: 0,
      stream: true,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error('Failed to generate completion', error)
    }

    // Transform the response into a readable stream
    const stream = OpenAIStream(response)

    // Return a StreamingTextResponse, which can be consumed by the client
    return new StreamingTextResponse(stream)
  } catch (err: unknown) {
    if (err instanceof Error) {
      return new Response(
        JSON.stringify({
          error: err.message,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    } else if (err instanceof Error) {
      // Print out application errors with their additional data
      console.error(`${err.message}`)
    } else {
      // Print out unexpected errors as is to help with debugging
      console.error(err)
    }

    // TODO: include more response info in debug environments
    return new Response(
      JSON.stringify({
        error: 'There was an error processing your request',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
