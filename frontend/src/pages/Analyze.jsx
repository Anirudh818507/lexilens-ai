import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileSearch, Sparkles } from 'lucide-react';
import UploadZone, { FilePreview } from '../components/UploadZone';
import ProcessingSteps from '../components/ProcessingSteps';
import { analyzeUpload, analyzeSample } from '../services/api';
import { useAnalysis } from '../hooks/useAnalysis';
import { useToast } from '../components/Toast';

export default function Analyze() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | uploading | extracting | analyzing | preparing | done
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { setAnalysis } = useAnalysis();
  const { showToast } = useToast();

  const runAnalysis = async (mode) => {
    setErrorMsg('');
    setStatus('uploading');

    // Brief, bounded cosmetic steps before the real network call — never indefinite,
    // and the "analyzing" step only resolves once the actual API response returns.
    await new Promise((r) => setTimeout(r, 350));
    setStatus('extracting');
    await new Promise((r) => setTimeout(r, 350));
    setStatus('analyzing');

    try {
      const result = mode === 'sample' ? await analyzeSample() : await analyzeUpload(file);
      setStatus('preparing');
      await new Promise((r) => setTimeout(r, 300));
      setStatus('done');
      setAnalysis(result);
      navigate('/dashboard');
    } catch (err) {
      setStatus('idle');
      setErrorMsg(err.message || 'Something went wrong while analyzing your document.');
      showToast(err.message || 'Analysis failed. Please try again.', 'error');
    }
  };

  const isBusy = status !== 'idle';

  return (
    <div className="container-page py-12 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-brass-600">Analyze a document</p>
        <h1 className="mt-2 font-serif text-3xl text-ink-900 sm:text-4xl">
          Upload a document to see what deserves your attention
        </h1>
        <p className="mt-3 text-ink-600">
          We'll extract the text, identify clauses worth reviewing, and prepare a plain-language report — in under a
          minute.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-xl">
        {!isBusy ? (
          <>
            <UploadZone onFileSelected={setFile} disabled={isBusy} />

            {file && (
              <div className="mt-4">
                <FilePreview file={file} />
              </div>
            )}

            {errorMsg && (
              <p role="alert" className="mt-4 text-sm font-medium text-attention-high">
                {errorMsg}
              </p>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => runAnalysis('upload')}
                disabled={!file}
                className="flex flex-1 items-center justify-center gap-2 rounded-md bg-ink-900 px-5 py-3 text-sm font-medium text-paper-50 transition-colors hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FileSearch className="h-4 w-4" aria-hidden="true" />
                Analyze my document
              </button>
              <button
                onClick={() => runAnalysis('sample')}
                className="flex flex-1 items-center justify-center gap-2 rounded-md border border-brass-500/50 bg-paper-50 px-5 py-3 text-sm font-medium text-ink-800 transition-colors hover:bg-brass-400/10"
              >
                <Sparkles className="h-4 w-4 text-brass-600" aria-hidden="true" />
                Try sample contract
              </button>
            </div>
          </>
        ) : (
          <ProcessingSteps currentStep={status} />
        )}
      </div>
    </div>
  );
}
