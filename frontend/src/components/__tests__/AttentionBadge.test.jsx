import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AttentionBadge from '../AttentionBadge';

describe('AttentionBadge', () => {
  it('renders the HIGH attention label as visible text, not just color', () => {
    render(<AttentionBadge level="HIGH" />);
    expect(screen.getByText(/HIGH ATTENTION/i)).toBeInTheDocument();
  });

  it('renders the MEDIUM attention label', () => {
    render(<AttentionBadge level="MEDIUM" />);
    expect(screen.getByText(/MEDIUM ATTENTION/i)).toBeInTheDocument();
  });

  it('falls back to LOW for an unrecognized level rather than crashing', () => {
    render(<AttentionBadge level="NOT_A_REAL_LEVEL" />);
    expect(screen.getByText(/LOW ATTENTION/i)).toBeInTheDocument();
  });
});
