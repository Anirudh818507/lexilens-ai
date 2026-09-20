const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

async function handleResponse(res) {
  let data;
  try {
    data = await res.json();
  } catch {
    throw new ApiError('The server returned an unexpected response.', 'PARSE_ERROR');
  }
  if (!res.ok) {
    throw new ApiError(data.error || 'Something went wrong.', data.code || 'UNKNOWN');
  }
  return data;
}

export async function analyzeUpload(file, onProgress) {
  const formData = new FormData();
  formData.append('document', file);

  onProgress?.('uploading');
  let res;
  try {
    res = await fetch(`${API_URL}/api/analyze/upload`, { method: 'POST', body: formData });
  } catch {
    throw new ApiError('Could not reach the server. Check your connection and try again.', 'NETWORK_ERROR');
  }
  onProgress?.('done');
  return handleResponse(res);
}

export async function analyzeSample(onProgress) {
  onProgress?.('uploading');
  let res;
  try {
    res = await fetch(`${API_URL}/api/analyze/sample`, { method: 'POST' });
  } catch {
    throw new ApiError('Could not reach the server. Check your connection and try again.', 'NETWORK_ERROR');
  }
  onProgress?.('done');
  return handleResponse(res);
}

export async function askQuestion(analysisId, question) {
  let res;
  try {
    res = await fetch(`${API_URL}/api/qa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ analysisId, question }),
    });
  } catch {
    throw new ApiError('Could not reach the server. Check your connection and try again.', 'NETWORK_ERROR');
  }
  return handleResponse(res);
}

export async function getChecklist(analysisId) {
  let res;
  try {
    res = await fetch(`${API_URL}/api/checklist/${analysisId}`);
  } catch {
    throw new ApiError('Could not reach the server. Check your connection and try again.', 'NETWORK_ERROR');
  }
  return handleResponse(res);
}

export async function compareDocuments(fileA, fileB) {
  const formData = new FormData();
  formData.append('documentA', fileA);
  formData.append('documentB', fileB);

  let res;
  try {
    res = await fetch(`${API_URL}/api/compare`, { method: 'POST', body: formData });
  } catch {
    throw new ApiError('Could not reach the server. Check your connection and try again.', 'NETWORK_ERROR');
  }
  return handleResponse(res);
}

export { ApiError };
