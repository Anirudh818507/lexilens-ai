import { GoogleGenAI } from '@google/genai';
import { AppError } from '../../middleware/errorHandler.js';

const MODEL_NAME = 'gemini-3.5-flash-lite';
const TIMEOUT_MS = 60000;

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 2000;

let client = null;

function getClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new AppError('Missing GEMINI_API_KEY', 500, 'AI_CONFIG_ERROR');
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
        () => reject(new AppError('AI request timed out', 504, 'AI_TIMEOUT')),
        ms
      )
    ),
  ]);
}

function isRetryableError(err) {
  const status = err?.status || err?.error?.code;

  return (
    status === 503 ||
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 504
  );
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateContentWithRetry(request) {
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(
        `[Gemini] Request attempt ${attempt}/${MAX_RETRIES}`
      );

      return await withTimeout(
        getClient().models.generateContent(request),
        TIMEOUT_MS
      );
    } catch (err) {
      lastError = err;

      console.error(
        `[Gemini] Attempt ${attempt} failed:`,
        err?.message
      );

      if (!isRetryableError(err) || attempt === MAX_RETRIES) {
        throw err;
      }

      const delay =
        INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt - 1);

      console.log(
        `[Gemini] Retrying in ${delay}ms...`
      );

      await sleep(delay);
    }
  }

  throw lastError;
}

export async function callGeminiJSON({
  systemInstruction,
  prompt,
  temperature = 0.2,
}) {
  try {
    const response = await generateContentWithRetry({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction,
        temperature,
        responseMimeType: 'application/json',
      },
    });

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

export async function callGeminiText({
  systemInstruction,
  prompt,
  temperature = 0.2,
}) {
  try {
    const response = await generateContentWithRetry({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction,
        temperature,
      },
    });

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