import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import analyzeRoutes from './routes/analyze.js';
import qaRoutes from './routes/qa.js';
import compareRoutes from './routes/compare.js';
import checklistRoutes from './routes/checklist.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimiter.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads dir exists (used only as transient scratch space)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// --- Security & core middleware ---
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // allow non-browser tools (no origin) and configured origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
  })
);

app.use(express.json({ limit: '2mb' }));
app.use(generalLimiter);

// Warn (server-side only) if API key missing, but do not crash so frontend can still show a friendly error
if (!process.env.GEMINI_API_KEY) {
  // eslint-disable-next-line no-console
  console.warn('[LexiLens] WARNING: GEMINI_API_KEY is not set. AI routes will return a configuration error.');
}

// --- Routes ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'lexilens-ai-backend', time: new Date().toISOString() });
});

app.use('/api/analyze', analyzeRoutes);
app.use('/api/qa', qaRoutes);
app.use('/api/compare', compareRoutes);
app.use('/api/checklist', checklistRoutes);

// --- Error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[LexiLens] Backend listening on port ${PORT}`);
});

export default app;
