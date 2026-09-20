import { GoogleGenAI } from '@google/genai';
import { AppError } from '../../middleware/errorHandler.js';

const MODEL_NAME = 'gemini-3.6-flash';
const TIMEOUT_MS = 30000;

let client = null;

function getClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new AppError(
      'Missing GEMINI_API_KEY',
      500,
      'AI_CONFIG_ERROR'
    );
  }

  if (!client) {
    client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  return client;
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(
        () =>
          reject(
            new AppError(
              'AI request timed out',
              504,
              'AI_TIMEOUT'
            )
          ),
        ms
      )
    ),
  ]);
}

/**
 * Calls Gemini and expects a JSON object.
 */
export async function callGeminiJSON({
  systemInstruction,
  prompt,
  temperature = 0.2,
}) {
  const ai = getClient();

  try {
    const response = await withTimeout(
      ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction,
          temperature,
          responseMimeType: 'application/json',
        },
      }),
      TIMEOUT_MS
    );

    const responseText = response?.text;

    if (!responseText) {
      throw new AppError(
        'Empty AI response',
        502,
        'AI_INVALID_RESPONSE'
      );
    }

    const cleaned = responseText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch (err) {
      console.error('[JSON PARSE ERROR]', err);
      console.error('[AI RESPONSE]', responseText);

      throw new AppError(
        'AI returned invalid JSON',
        502,
        'AI_INVALID_RESPONSE'
      );
    }
  } catch (err) {
    console.error('=================================');
    console.error('[GEMINI API ERROR]');
    console.error('Message:', err?.message);
    console.error('Name:', err?.name);
    console.error('Status:', err?.status);
    console.error('Details:', err);
    console.error('=================================');

    if (err instanceof AppError) {
      throw err;
    }

    throw new AppError(
      'AI request failed',
      502,
      'AI_ERROR'
    );
  }
}

/**
 * Calls Gemini for plain text output.
 */
export async function callGeminiText({
  systemInstruction,
  prompt,
  temperature = 0.2,
}) {
  const ai = getClient();

  try {
    const response = await withTimeout(
      ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction,
          temperature,
        },
      }),
      TIMEOUT_MS
    );

    const text = response?.text;

    if (!text) {
      throw new AppError(
        'Empty AI response',
        502,
        'AI_INVALID_RESPONSE'
      );
    }

    return text.trim();
  } catch (err) {
    console.error('=================================');
    console.error('[GEMINI TEXT API ERROR]');
    console.error('Message:', err?.message);
    console.error('Name:', err?.name);
    console.error('Status:', err?.status);
    console.error('Details:', err);
    console.error('=================================');

    if (err instanceof AppError) {
      throw err;
    }

    throw new AppError(
      'AI request failed',
      502,
      'AI_ERROR'
    );
  }
}