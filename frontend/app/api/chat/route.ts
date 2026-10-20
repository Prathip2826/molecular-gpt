import { NextRequest, NextResponse } from 'next/server';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { text: 'Error: GROQ_API_KEY is missing on the server (add it in Vercel env vars).' },
        { status: 500 }
      );
    }

    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful chemistry AI assistant specialized in molecular science, drug discovery, and chemical reactions. Answer clearly and scientifically.',
          },
          { role: 'user', content: message },
        ],
        max_tokens: 1024,
        temperature: 0.7,
        reasoning_effort: 'low',
      }),
    });

    const data = await response.json();
    console.log('Groq response:', JSON.stringify(data));

    const content = data?.choices?.[0]?.message?.content;
    if (content) {
      return NextResponse.json({ text: content.trim() });
    }

    const reason = data?.error?.message || 'No response. Try again.';
    return NextResponse.json({ text: `Error: Groq says -> ${reason}` });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ text: `Error: ${err.message}` }, { status: 500 });
  }
}
