import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import UploadZone from '../UploadZone';

function makeFile(name, sizeBytes, type) {
  const file = new File([new ArrayBuffer(sizeBytes)], name, { type });
  return file;
}

describe('UploadZone', () => {
  it('rejects an unsupported file type and does not call onFileSelected', () => {
    const onFileSelected = vi.fn();
    render(<UploadZone onFileSelected={onFileSelected} />);
    const input = screen.getByLabelText(/choose a legal document file to upload/i);
    const badFile = makeFile('malware.exe', 100, 'application/octet-stream');
    fireEvent.change(input, { target: { files: [badFile] } });

    expect(screen.getByRole('alert')).toHaveTextContent(/unsupported file type/i);
    expect(onFileSelected).not.toHaveBeenCalled();
  });

  it('rejects a file larger than 10MB', () => {
    const onFileSelected = vi.fn();
    render(<UploadZone onFileSelected={onFileSelected} />);
    const input = screen.getByLabelText(/choose a legal document file to upload/i);
    const bigFile = makeFile('big.pdf', 11 * 1024 * 1024, 'application/pdf');
    fireEvent.change(input, { target: { files: [bigFile] } });

    expect(screen.getByRole('alert')).toHaveTextContent(/too large/i);
    expect(onFileSelected).not.toHaveBeenCalled();
  });

  it('accepts a valid PDF within size limits', () => {
    const onFileSelected = vi.fn();
    render(<UploadZone onFileSelected={onFileSelected} />);
    const input = screen.getByLabelText(/choose a legal document file to upload/i);
    const goodFile = makeFile('contract.pdf', 1024, 'application/pdf');
    fireEvent.change(input, { target: { files: [goodFile] } });

    expect(onFileSelected).toHaveBeenCalledWith(goodFile);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
