import { useCallback, useRef, useState } from 'react';
import { UploadCloud, FileText, ShieldCheck } from 'lucide-react';

const ACCEPTED_EXT = ['.pdf', '.txt', '.docx'];
const MAX_SIZE_MB = 10;

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function UploadZone({ onFileSelected, disabled }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const validateAndEmit = useCallback(
    (file) => {
      setError('');
      if (!file) return;
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      if (!ACCEPTED_EXT.includes(ext)) {
        setError(`Unsupported file type "${ext}". Please upload a PDF, DOCX, or TXT file.`);
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`File is too large (${formatSize(file.size)}). Maximum size is ${MAX_SIZE_MB}MB.`);
        return;
      }
      onFileSelected(file);
    },
    [onFileSelected]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    validateAndEmit(file);
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload your legal document. Drag and drop a file here, or press Enter to browse."
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-14 text-center transition-colors ${
          disabled ? 'cursor-not-allowed opacity-60 border-ink-200' : ''
        } ${isDragging ? 'border-brass-500 bg-brass-400/5' : 'border-ink-300 bg-paper-50 hover:border-brass-500/60'}`}
      >
        <UploadCloud className="mb-3 h-9 w-9 text-brass-600" aria-hidden="true" />
        <p className="font-serif text-lg text-ink-900">Upload your legal document</p>
        <p className="mt-1 text-sm text-ink-600">Drag and drop a file here, or click to browse</p>
        <p className="mt-3 text-xs text-ink-400">
          Supported formats: PDF, DOCX, TXT · Maximum size {MAX_SIZE_MB}MB
        </p>
        <input
          ref={inputRef}
          type="file"
          aria-label="Choose a legal document file to upload"
          accept=".pdf,.docx,.txt"
          className="sr-only"
          disabled={disabled}
          onChange={(e) => validateAndEmit(e.target.files?.[0])}
        />
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-attention-high">
          {error}
        </p>
      )}

      <div className="mt-4 flex items-start gap-2 text-xs text-ink-500">
        <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-brass-600" aria-hidden="true" />
        <p>
          Your document is processed for analysis and should be treated as sensitive information. Avoid uploading
          documents containing information you are not authorized to share.
        </p>
      </div>
    </div>
  );
}

export function FilePreview({ file }) {
  if (!file) return null;
  return (
    <div className="flex items-center gap-3 rounded-lg border border-ink-200 bg-paper-50 px-4 py-3">
      <FileText className="h-5 w-5 flex-shrink-0 text-brass-600" aria-hidden="true" />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-ink-900">{file.name}</p>
        <p className="text-xs text-ink-500">{formatSize(file.size)}</p>
      </div>
    </div>
  );
}
