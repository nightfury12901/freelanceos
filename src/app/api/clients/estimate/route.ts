import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

export async function POST(req: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY is missing from your .env.local file' },
        { status: 401 }
      )
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })

    const { projectTitle, projectDescription } = await req.json()

    if (!projectTitle || !projectDescription) {
      return NextResponse.json(
        { error: 'Project Title and Description are required' },
        { status: 400 }
      )
    }

    const prompt = `
You are an expert freelance pricing strategist for the Indian tech and creative market.
Analyze the following project and estimate a fair pricing range in Indian Rupees (INR) for an experienced freelancer.

Project Title: ${projectTitle}
Project Description: ${projectDescription}

Return ONLY a valid JSON object matching this exact structure. Do not wrap it in markdown block quotes. Provide 3 high-value tips.
{
  "low": number (e.g. 50000),
  "high": number (e.g. 120000),
  "currency": "INR",
  "rationale": "A 1-2 sentence explanation of why this price is fair based on Indian market rates.",
  "tips": [
    "Tip 1 on how to pitch this",
    "Tip 2 on value-based upsell",
    "Tip 3 on scoping bounds"
  ]
}
`

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })

    const responseContent = completion.choices[0]?.message?.content
    if (!responseContent) {
      throw new Error('No response body returned from Groq')
    }

    const estimateData = JSON.parse(responseContent)

    return NextResponse.json(estimateData)
  } catch (error: unknown) {
    console.error('Groq Estimation Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate estimate' },
      { status: 500 }
    )
  }
}
