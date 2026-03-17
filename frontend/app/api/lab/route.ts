import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { toolId, input } = await req.json();

    const prompts: Record<string, string> = {
      generator: `As a drug discovery AI, generate a potential molecule for: "${input}"
Provide: 1) Structure description, 2) SMILES notation, 3) Key features, 4) Drug-like properties, 5) Mechanism of action.`,

      optimizer: `As a medicinal chemist, suggest structural optimizations for: ${input}
Provide: 1) Current analysis, 2) 3 modifications with SMILES, 3) Expected improvements.`,

      drug_finder: `Identify existing drugs for: "${input}"
Provide: 3-5 drugs with names, SMILES, mechanism, clinical status.`,

      toxicity: `Analyze safety profile of: ${input}
Provide: Structural alerts, organ toxicity, hERG liability, safety rating 1-10.`,
    };

    const prompt = prompts[toolId] || `Analyze: ${input}`;

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
              content: 'You are an expert drug discovery and chemistry AI assistant.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 1024,
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();

    if (data?.choices?.[0]?.message?.content) {
      return NextResponse.json({ 
        result: data.choices[0].message.content.trim() 
      });
    }

    return NextResponse.json({ result: 'No response. Try again.' });

  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ result: `Error: ${err.message}` }, { status: 500 });
  }
}