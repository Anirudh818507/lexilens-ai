import { callGeminiJSON } from './geminiClient.js';
import { AppError } from '../../middleware/errorHandler.js';

const SYSTEM_INSTRUCTION = `You are LexiLens AI, an assistant that helps ordinary people understand legal documents BEFORE they sign them.

You are NOT a lawyer. You do NOT give legal advice or legal conclusions. You do NOT say a document is "safe", "legal", "risky" in a legal sense, or tell the user whether they should sign.

STRICT RULES:
- Use ONLY information that is actually present in the provided document text. Never invent clauses, dates, obligations, parties, penalties, or laws.
- If something is not specified in the document, say so explicitly using the phrase "Not specified in the provided document."
- Every attention area you report MUST include the original clause text copied verbatim (or as close to verbatim as extraction allows) from the document, so it is traceable to the source.
- Use "attention level" (HIGH, MEDIUM, LOW) to indicate how much a clause deserves the reader's attention — never call this a "risk score" or a "legal verdict".
- Respond ONLY with a single valid JSON object matching the schema described in the prompt. No markdown, no commentary, no code fences.`;

function buildPrompt(documentText, filename) {
  return `Analyze the following legal document and return a JSON object with this exact shape:

{
  "documentType": "string - e.g. Freelance Service Agreement, NDA, Rental Agreement, Employment Contract, etc. Infer from content.",
  "summary": "string - 2-4 sentence neutral, plain-language summary of what this document is and does",
  "parties": ["string - names/roles of parties involved, e.g. 'Client', 'Freelancer', as stated in the document"],
  "importantDates": [
    { "label": "string - what this date is about", "value": "string - the date or duration as stated, or 'Not specified in the provided document.'" }
  ],
  "attentionAreas": [
    {
      "category": "string - short category name, e.g. Termination, Automatic Renewal, Liability, Confidentiality, Intellectual Property, Payment, Indemnification, Dispute Resolution, Non-Compete",
      "level": "HIGH | MEDIUM | LOW",
      "section": "string - section number or name as it appears in the document, or 'Not specified in the provided document.'",
      "page": "number or null if unknown",
      "originalClause": "string - the actual clause text copied from the document, as close to verbatim as possible. Never invent this.",
      "simpleExplanation": "string - plain language explanation of what this clause means, written for a non-lawyer",
      "whyItMatters": "string - why this may matter to the person signing, phrased informationally (never as legal advice or a verdict)",
      "whatToCheck": "string - a concrete, practical thing the reader could check or confirm",
      "lawyerQuestion": "string - a question the reader could consider asking a qualified legal professional about this clause"
    }
  ],
  "obligations": {
    "user": ["string - concrete obligations the signing party appears to take on, based only on the document"],
    "otherParty": ["string - concrete obligations the other party appears to take on, based only on the document"]
  }
}

Guidance:
- Identify between 4 and 10 attentionAreas depending on document complexity. Prioritize clauses commonly overlooked: termination, automatic renewal, penalties, liability limits, confidentiality, non-compete, IP ownership, dispute resolution, indemnification, payment terms.
- Assign HIGH level to clauses with significant financial, legal, or obligation consequences (e.g. liability, indemnification, termination penalties, non-compete). Assign MEDIUM to moderately important clauses (e.g. automatic renewal, confidentiality scope). Assign LOW to standard/informational clauses.
- Do not fabricate a clause that is not present. If a commonly important clause (e.g. automatic renewal) is genuinely absent, you may omit it rather than invent one.
- Keep "originalClause" reasonably short (1-3 sentences) — the most relevant excerpt, not the whole section.

Document filename: ${filename}

DOCUMENT TEXT:
"""
${documentText}
"""

Return ONLY the JSON object.`;
}

const VALID_LEVELS = new Set(['HIGH', 'MEDIUM', 'LOW']);

export function validateAnalysis(data) {
  if (!data || typeof data !== 'object') {
    throw new AppError('Invalid AI analysis shape', 502, 'AI_INVALID_RESPONSE');
  }
  if (!Array.isArray(data.attentionAreas)) {
    throw new AppError('AI analysis missing attentionAreas', 502, 'AI_INVALID_RESPONSE');
  }

  data.attentionAreas = data.attentionAreas
    .filter((a) => a && typeof a === 'object' && a.originalClause && a.category)
    .map((a, idx) => ({
      id: `finding-${idx + 1}`,
      category: String(a.category),
      level: VALID_LEVELS.has(a.level) ? a.level : 'LOW',
      section: a.section || 'Not specified in the provided document.',
      page: typeof a.page === 'number' ? a.page : null,
      originalClause: String(a.originalClause),
      simpleExplanation: a.simpleExplanation || 'Not specified in the provided document.',
      whyItMatters: a.whyItMatters || 'Not specified in the provided document.',
      whatToCheck: a.whatToCheck || 'Not specified in the provided document.',
      lawyerQuestion: a.lawyerQuestion || 'Not specified in the provided document.',
    }));

  if (!data.obligations || typeof data.obligations !== 'object') {
    data.obligations = { user: [], otherParty: [] };
  }
  data.obligations.user = Array.isArray(data.obligations.user) ? data.obligations.user : [];
  data.obligations.otherParty = Array.isArray(data.obligations.otherParty) ? data.obligations.otherParty : [];

  data.parties = Array.isArray(data.parties) ? data.parties : [];
  data.importantDates = Array.isArray(data.importantDates) ? data.importantDates : [];
  data.documentType = data.documentType || 'Not specified in the provided document.';
  data.summary = data.summary || 'Not specified in the provided document.';

  return data;
}

/**
 * analyzeDocument() — the primary orchestration call.
 * Produces summary, parties, dates, attention areas, and obligations in a single
 * structured AI call to avoid redundant AI usage (performance requirement).
 */
export async function analyzeDocument(documentText, filename) {
  const raw = await callGeminiJSON({
    systemInstruction: SYSTEM_INSTRUCTION,
    prompt: buildPrompt(documentText, filename),
    temperature: 0.15,
  });

  const validated = validateAnalysis(raw);

  const counts = validated.attentionAreas.reduce(
    (acc, a) => {
      acc[a.level] = (acc[a.level] || 0) + 1;
      return acc;
    },
    { HIGH: 0, MEDIUM: 0, LOW: 0 }
  );

  const overallAttention = counts.HIGH > 0 ? 'HIGH ATTENTION' : counts.MEDIUM > 0 ? 'MEDIUM ATTENTION' : 'LOW ATTENTION';

  return {
    ...validated,
    filename,
    stats: {
      totalFindings: validated.attentionAreas.length,
      high: counts.HIGH,
      medium: counts.MEDIUM,
      low: counts.LOW,
      overallAttention,
    },
  };
}
