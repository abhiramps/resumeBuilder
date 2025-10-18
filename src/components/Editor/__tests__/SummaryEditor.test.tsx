import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SummaryEditor } from '../SummaryEditor';
import { ResumeProvider } from '../../../contexts/ResumeContext';

// Mock the useAutoSave hook
jest.mock('../../../hooks/useAutoSave', () => ({
  useAutoSave: () => ({
    saveStatus: 'saved',
    error: null,
    restoreData: jest.fn().mockResolvedValue(null),
  }),
}));

// Test wrapper with ResumeProvider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ResumeProvider>{children}</ResumeProvider>
);

describe('SummaryEditor', () => {
  it('renders without crashing', () => {
    render(
      <TestWrapper>
        <SummaryEditor />
      </TestWrapper>
    );
    
    expect(screen.getByText('Professional Summary')).toBeInTheDocument();
  });

  it('displays character count', () => {
    render(
      <TestWrapper>
        <SummaryEditor />
      </TestWrapper>
    );
    
    // Should show character count in header
    expect(screen.getByText(/\/300/)).toBeInTheDocument();
  });

  it('can be collapsed and expanded', () => {
    render(
      <TestWrapper>
        <SummaryEditor />
      </TestWrapper>
    );
    
    const header = screen.getByText('Professional Summary').closest('div');
    expect(header).toBeInTheDocument();
    
    // Click to collapse
    fireEvent.click(header!);
    
    // The textarea should not be visible when collapsed
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('shows writing tips when tips button is clicked', async () => {
    render(
      <TestWrapper>
        <SummaryEditor />
      </TestWrapper>
    );
    
    const tipsButton = screen.getByText('Writing Tips');
    fireEvent.click(tipsButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Keep it concise/)).toBeInTheDocument();
    });
  });

  it('shows sample summaries when samples button is clicked', async () => {
    render(
      <TestWrapper>
        <SummaryEditor />
      </TestWrapper>
    );
    
    const samplesButton = screen.getByText('Sample Summaries');
    fireEvent.click(samplesButton);
    
    await waitFor(() => {
      expect(screen.getByText('Use This Sample')).toBeInTheDocument();
    });
  });

  it('shows ATS keywords when keywords button is clicked', async () => {
    render(
      <TestWrapper>
        <SummaryEditor />
      </TestWrapper>
    );
    
    const keywordsButton = screen.getByText('ATS Keywords');
    fireEvent.click(keywordsButton);
    
    await waitFor(() => {
      expect(screen.getByText('Technical')).toBeInTheDocument();
      expect(screen.getByText('software development')).toBeInTheDocument();
    });
  });

  it('updates character count when text is entered', async () => {
    render(
      <TestWrapper>
        <SummaryEditor />
      </TestWrapper>
    );
    
    const textarea = screen.getByRole('textbox');
    const testText = 'This is a test summary';
    
    fireEvent.change(textarea, { target: { value: testText } });
    
    await waitFor(() => {
      expect(screen.getByText(`${testText.length}/300`)).toBeInTheDocument();
    });
  });

  it('shows optimal length indicator for text between 150-300 characters', async () => {
    render(
      <TestWrapper>
        <SummaryEditor />
      </TestWrapper>
    );
    
    const textarea = screen.getByRole('textbox');
    const optimalText = 'A'.repeat(200); // 200 characters
    
    fireEvent.change(textarea, { target: { value: optimalText } });
    
    await waitFor(() => {
      expect(screen.getByText('✓ Optimal Length')).toBeInTheDocument();
    });
  });

  it('validates ATS-friendly format', async () => {
    render(
      <TestWrapper>
        <SummaryEditor />
      </TestWrapper>
    );
    
    const textarea = screen.getByRole('textbox');
    const atsText = 'This is ATS friendly text with no special characters.';
    
    fireEvent.change(textarea, { target: { value: atsText } });
    
    await waitFor(() => {
      expect(screen.getByText('✓ ATS-Friendly')).toBeInTheDocument();
    });
  });
});