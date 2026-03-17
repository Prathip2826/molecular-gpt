import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { type, inputs } = await req.json();

    const prompts: Record<string, string> = {
      reaction_prediction: `As a chemistry expert, predict the main product of:
Reactant A: ${inputs.reactantA || 'Unknown'}
Reactant B: ${inputs.reactantB || 'Unknown'}
Conditions: ${inputs.conditions || 'Standard'}
Provide: product SMILES, mechanism, yield estimate.`,

      toxicity: `As a toxicologist, evaluate toxicity of: ${inputs.molecule || 'Unknown'}
Provide: LD50 estimate, toxic effects, safety classification.`,

      similarity: `List 5 molecules similar to ${inputs.query || 'Unknown'}.
Include names, SMILES, structural similarities.`,

      drug_analysis: `Analyze drug-likeness of SMILES: ${inputs.smiles || 'CC(=O)Oc1ccccc1C(=O)O'}
Apply Lipinski Rule of Five. Provide MW, LogP, bioavailability score.`,
    };

    const prompt = prompts[type] || `Analyze this chemistry query: ${JSON.stringify(inputs)}`;

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
              content: 'You are an expert chemistry AI. Give precise, scientific answers.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 1024,
          temperature: 0.6,
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