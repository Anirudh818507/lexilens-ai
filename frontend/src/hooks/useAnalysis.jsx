import { createContext, useContext, useState, useCallback } from 'react';

const AnalysisContext = createContext(null);

export function AnalysisProvider({ children }) {
  const [analysis, setAnalysis] = useState(null); // full analysis payload incl. analysisId
  const [checklistData, setChecklistData] = useState(null); // cached checklist + lawyer questions

  const setNewAnalysis = useCallback((data) => {
    setAnalysis(data);
    setChecklistData(null); // reset derived cache for a new document
  }, []);

  const clearAnalysis = useCallback(() => {
    setAnalysis(null);
    setChecklistData(null);
  }, []);

  return (
    <AnalysisContext.Provider value={{ analysis, setAnalysis: setNewAnalysis, clearAnalysis, checklistData, setChecklistData }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error('useAnalysis must be used within AnalysisProvider');
  return ctx;
}
