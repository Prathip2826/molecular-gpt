import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful chemistry AI assistant specialized in molecular science, drug discovery, and chemical reactions. Answer clearly and scientifically.',
            },
            {
              role: 'user',
              content: message,
            },
          ],
          max_tokens: 1024,
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();
    console.log('Groq response:', JSON.stringify(data));

    if (data?.choices?.[0]?.message?.content) {
      return NextResponse.json({ 
        text: data.choices[0].message.content.trim() 
      });
    }

    return NextResponse.json({ text: 'No response. Try again.' });

  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ text: `Error: ${err.message}` }, { status: 500 });
  }
}