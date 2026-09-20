# TESTING.md — LexiLens AI

This document describes both the automated test suites and the manual test cases used to verify LexiLens AI.

## Automated tests

### Backend (`backend/tests`, Node's built-in test runner)

Run with:

```bash
cd backend
npm test
```

| File | Covers |
|---|---|
| `documentExtractor.test.js` | Text extraction from `.txt`, rejection of unsupported extensions, rejection of empty/too-short documents, truncation of oversized documents |
| `validateAnalysis.test.js` | AI JSON response validation, attention-level normalization, hallucination guard (findings without an original clause are dropped), default shapes when fields are missing |
| `generateChecklist.test.js` | Checklist de-duplication, fallback labels, lawyer-question de-duplication and filtering of "not specified" answers |
| `analysisStore.test.js` | In-memory analysis cache save/get/delete behavior |
| `answerDocumentQuestion.test.js` | Q&A input validation (empty question, whitespace-only, overly long) before any AI call is made |

All 18 tests pass as of the last verified run, with `npm audit --production` reporting **0 vulnerabilities**.

### Frontend (`frontend/src/**/__tests__`, Vitest + Testing Library)

Run with:

```bash
cd frontend
npm test
```

| File | Covers |
|---|---|
| `AttentionBadge.test.jsx` | Attention level renders as visible text (not color alone), graceful fallback for an unrecognized level |
| `UploadZone.test.jsx` | Rejects unsupported file types, rejects files over 10MB, accepts a valid PDF |

## Manual test cases

These were run against the running application (backend + frontend, with a real `GEMINI_API_KEY` configured) to verify end-to-end behavior that's impractical to fully automate (real AI responses, visual layout, keyboard navigation).

### 1. Landing page
- [ ] Hero, problem, how-it-works, features, trust/privacy, and disclaimer sections all render
- [ ] "Analyze my document" and "Try sample contract" buttons navigate to `/analyze`
- [ ] Page is usable at 375px, 768px, and 1440px widths

### 2. Sample contract flow (primary demo path)
- [ ] Click "Try sample contract" on `/analyze`
- [ ] Processing steps show Upload → Extract → Analyze → Prepare, driven by the real request (not a fixed timer only)
- [ ] Redirects to `/dashboard` with populated Overview, Attention Areas, Obligations tabs

### 3. Real file upload
- [ ] Upload a real PDF contract — analysis completes and matches the document's actual content
- [ ] Upload a `.txt` file — succeeds
- [ ] Upload a `.docx` file — succeeds
- [ ] Drag-and-drop a file onto the upload zone — works the same as click-to-browse

### 4. Invalid file handling
- [ ] Upload a `.exe` or `.zip` — shows "Unsupported file type" without crashing
- [ ] Upload an 11MB+ file — shows "File is too large"
- [ ] Upload a 1-line, near-empty `.txt` — shows "No readable text was found"

### 5. Before You Sign dashboard
- [ ] Attention Overview shows correct High/Medium/Low counts (never labeled a "risk score")
- [ ] Clicking a finding card opens the evidence modal
- [ ] Original / Simple language toggle changes displayed text without altering meaning
- [ ] Why It Matters, What To Check, and Lawyer Question all populated per finding
- [ ] Every `originalClause` is traceable to text that actually appears in the source document

### 6. Obligations
- [ ] "Your obligations" and "Other party's obligations" are both populated and distinct

### 7. Document Q&A
- [ ] Ask "How much notice is required to terminate?" — answer cites the termination section
- [ ] Ask an unrelated question not covered by the document (e.g. "What is the penalty for late delivery of a car?") — returns "I couldn't find this information in the provided document." rather than a fabricated answer
- [ ] Submitting an empty question shows a validation message and does not call the AI

### 8. Checklist
- [ ] Checklist items generated automatically from the analysis
- [ ] Marking items complete/incomplete works and persists during the session
- [ ] "Copy" places checklist text on the clipboard
- [ ] "Download" saves a `.txt` file

### 9. Lawyer questions
- [ ] Questions generated from attention areas, de-duplicated
- [ ] "Copy questions" places numbered list on the clipboard

### 10. Document comparison (`/compare`)
- [ ] Upload `sample-data/freelance-agreement-v1.txt` as Document A and `sample-data/freelance-agreement-v2.txt` as Document B
- [ ] Comparison correctly identifies: payment increase, longer termination notice, added early-termination fee, extended confidentiality period, higher liability cap, and automatic renewal being added
- [ ] Each change is labeled Added / Removed / Modified

### 11. Errors & resilience
- [ ] Stop the backend and try to analyze — frontend shows "Could not reach the server," not a blank screen or console-only error
- [ ] Remove `GEMINI_API_KEY` from `.env` and restart backend — analyze/sample returns a clean "AI service is not configured" message, no stack trace
- [ ] Fire 13+ AI requests within a minute — 13th+ returns a rate-limit message

### 12. Accessibility
- [ ] Tab through the entire upload flow using only the keyboard
- [ ] Modal (finding evidence) traps focus and closes on Escape
- [ ] All attention levels show an icon + text label, not color alone
- [ ] Focus rings are visible on all interactive elements

### 13. Responsive design
- [ ] Dashboard sidebar collapses to a horizontal scrollable tab bar on mobile widths
- [ ] Comparison page stacks Document A / Document B vertically on mobile
