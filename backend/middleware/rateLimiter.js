import rateLimit from 'express-rate-limit';

// General limiter for all API routes
export const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests/minute/IP across the API
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait a moment and try again.', code: 'RATE_LIMITED' },
});

// Stricter limiter for expensive AI-calling routes
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 12, // AI calls are expensive; cap more tightly
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many AI requests. Please wait a moment and try again.', code: 'RATE_LIMITED' },
});
