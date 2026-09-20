// These generators derive their output from an already-completed analyzeDocument()
// result rather than issuing new AI calls. This satisfies the performance requirement
// ("do not call the AI API every time the user opens a section" / "avoid duplicate AI calls")
// while still being genuinely generated from the document-specific findings.

/**
 * generateChecklist() — turns attention areas + obligations into a
 * "Before You Sign" action checklist.
 */
export function generateChecklist(analysis) {
  const items = [];

  (analysis.attentionAreas || []).forEach((area) => {
    items.push({
      id: `check-${area.id}`,
      label: area.whatToCheck && area.whatToCheck !== 'Not specified in the provided document.'
        ? area.whatToCheck
        : `Review the ${area.category} clause`,
      category: area.category,
      level: area.level,
    });
  });

  // Always include a couple of general baseline items
  items.push({
    id: 'check-parties',
    label: 'Confirm the names and roles of all parties are correct',
    category: 'General',
    level: 'LOW',
  });
  items.push({
    id: 'check-dates',
    label: 'Confirm all dates, durations, and deadlines match your understanding',
    category: 'General',
    level: 'MEDIUM',
  });

  // De-duplicate by label
  const seen = new Set();
  const deduped = items.filter((i) => {
    const key = i.label.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return deduped;
}

/**
 * generateLawyerQuestions() — compiles the per-clause lawyer questions
 * already produced during analysis into a clean, de-duplicated list.
 */
export function generateLawyerQuestions(analysis) {
  const questions = (analysis.attentionAreas || [])
    .filter((a) => a.lawyerQuestion && a.lawyerQuestion !== 'Not specified in the provided document.')
    .map((a, idx) => ({
      id: `q-${idx + 1}`,
      category: a.category,
      level: a.level,
      question: a.lawyerQuestion,
    }));

  const seen = new Set();
  return questions.filter((q) => {
    const key = q.question.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
