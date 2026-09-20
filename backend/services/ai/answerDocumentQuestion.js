import { callGeminiJSON } from './geminiClient.js';
import { AppError } from '../../middleware/errorHandler.js';

const SYSTEM_INSTRUCTION = `You are LexiLens AI's document Q&A module. You answer questions about a legal document using ONLY the text of that document.

STRICT RULES:
- You must NOT use outside knowledge, general legal knowledge, or assumptions to answer.
- If the document does not contain information needed to answer, respond with exactly: "I couldn't find this information in the provided document." for the answer field, and set found to false.
- Never give legal advice or tell the user what to do. Describe only what the document says.
- Always cite the section/clause the answer comes from when found is true.
- Respond ONLY with a single valid JSON object. No markdown, no commentary.`;

function buildPrompt(documentText, question) {
  return `Document text:
"""
${documentText}
"""

User question: "${question}"

Return a JSON object with this exact shape:
{
  "found": true or false,
  "answer": "string - direct answer based only on the document, or the exact fallback phrase if not found",
  "sourceSection": "string - section name/number the answer is drawn from, or null if not found",
  "sourceQuote": "string - short verbatim excerpt (max ~2 sentences) supporting the answer, or null if not found"
}`;
}

export async function answerDocumentQuestion(documentText, question) {
  if (!question || !question.trim()) {
    throw new AppError('Question cannot be empty', 400, 'VALIDATION_ERROR');
  }
  if (question.length > 500) {
    throw new AppError('Question is too long', 400, 'VALIDATION_ERROR');
  }

  const raw = await callGeminiJSON({
    systemInstruction: SYSTEM_INSTRUCTION,
    prompt: buildPrompt(documentText, question),
    temperature: 0.1,
  });

  if (typeof raw !== 'object' || raw === null) {
    throw new AppError('Invalid AI Q&A response', 502, 'AI_INVALID_RESPONSE');
  }

  return {
    found: Boolean(raw.found),
    answer: raw.found ? String(raw.answer || '') : "I couldn't find this information in the provided document.",
    sourceSection: raw.found ? raw.sourceSection || null : null,
    sourceQuote: raw.found ? raw.sourceQuote || null : null,
  };
}
