import { callGeminiJSON } from './geminiClient.js';
import { AppError } from '../../middleware/errorHandler.js';

const SYSTEM_INSTRUCTION = `You are LexiLens AI's document comparison module. You compare two legal documents and identify meaningful differences a signer should know about.

STRICT RULES:
- Base every comparison point only on the actual text of Document A and Document B provided.
- Never invent a clause, value, or change that isn't supported by the text.
- Classify each difference as "Added" (present only in B), "Removed" (present only in A), or "Modified" (present in both but changed).
- Do not give legal advice or say one document is "better". Describe factual differences neutrally.
- Respond ONLY with a single valid JSON object. No markdown, no commentary.`;

function buildPrompt(textA, textB, nameA, nameB) {
  return `Document A ("${nameA}"):
"""
${textA}
"""

Document B ("${nameB}"):
"""
${textB}
"""

Return a JSON object with this exact shape:
{
  "changes": [
    {
      "category": "string - e.g. Payment, Termination, Automatic Renewal, Liability, Confidentiality",
      "changeType": "Added | Removed | Modified",
      "documentA": "string - relevant value/clause excerpt from Document A, or 'Not specified in the provided document.'",
      "documentB": "string - relevant value/clause excerpt from Document B, or 'Not specified in the provided document.'",
      "description": "string - one sentence neutral description of the change and its practical implication"
    }
  ]
}

Identify up to 10 of the most meaningful differences. If the documents are nearly identical, return fewer items or an empty array with an explanatory note is not needed — just return what you find.`;
}

export async function compareDocuments(textA, textB, nameA, nameB) {
  const raw = await callGeminiJSON({
    systemInstruction: SYSTEM_INSTRUCTION,
    prompt: buildPrompt(textA, textB, nameA, nameB),
    temperature: 0.15,
  });

  if (!raw || !Array.isArray(raw.changes)) {
    throw new AppError('Invalid AI comparison response', 502, 'AI_INVALID_RESPONSE');
  }

  const validTypes = new Set(['Added', 'Removed', 'Modified']);

  return {
    changes: raw.changes
      .filter((c) => c && c.category)
      .map((c, idx) => ({
        id: `change-${idx + 1}`,
        category: String(c.category),
        changeType: validTypes.has(c.changeType) ? c.changeType : 'Modified',
        documentA: c.documentA || 'Not specified in the provided document.',
        documentB: c.documentB || 'Not specified in the provided document.',
        description: c.description || '',
      })),
  };
}
