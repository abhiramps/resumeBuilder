/**
 * EmailVerificationBanner Component Tests
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { EmailVerificationBanner } from '../EmailVerificationBanner';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('EmailVerificationBanner', () => {
    const defaultProps = {
        email: 'test@example.com',
        onVerificationComplete: jest.fn(),
        onChangeEmail: jest.fn(),
        onDismiss: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('renders with correct email and message', () => {
        render(<EmailVerificationBanner {...defaultProps} />);

        expect(screen.getByText('Please verify your email')).toBeInTheDocument();
        expect(screen.getByText(/test@example\.com/)).toBeInTheDocument();
        expect(screen.getByText("I've verified")).toBeInTheDocument();
        expect(screen.getByText('Resend email')).toBeInTheDocument();
        expect(screen.getByText('Change email')).toBeInTheDocument();
    });

    it('shows dismiss button when allowDismiss is true', () => {
        render(<EmailVerificationBanner {...defaultProps} allowDismiss={true} />);

        expect(screen.getByText('Dismiss')).toBeInTheDocument();
    });

    it('does not show dismiss button when allowDismiss is false', () => {
        render(<EmailVerificationBanner {...defaultProps} allowDismiss={false} />);

        expect(screen.queryByText('Dismiss')).not.toBeInTheDocument();
    });

    it('polls for verification status on mount', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ verified: false }),
        });

        render(<EmailVerificationBanner {...defaultProps} />);

        // Fast-forward timers to trigger polling
        act(() => {
            jest.advanceTimersByTime(30000);
        });

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                '/api/verification/status?email=test%40example.com'
            );
        });
    });

    it('calls onVerificationComplete when verification is detected', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ verified: true }),
        });

        render(<EmailVerificationBanner {...defaultProps} />);

        // Trigger manual check
        fireEvent.click(screen.getByText("I've verified"));

        await waitFor(() => {
            expect(defaultProps.onVerificationComplete).toHaveBeenCalled();
        });
    });

    it('handles resend email successfully', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({
                message: 'Verification email sent successfully.',
                nextAttemptAt: Date.now() + 30000,
            }),
        });

        render(<EmailVerificationBanner {...defaultProps} />);

        fireEvent.click(screen.getByText('Resend email'));

        await waitFor(() => {
            expect(screen.getByText('Verification email sent successfully!')).toBeInTheDocument();
        });

        expect(mockFetch).toHaveBeenCalledWith('/api/verification/resend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: 'test@example.com' }),
        });
    });

    it('handles resend email error with rate limiting', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve({
                error: {
                    message: 'Please wait 30 seconds before requesting another verification email.',
                    waitTime: 30,
                },
            }),
        });

        render(<EmailVerificationBanner {...defaultProps} />);

        fireEvent.click(screen.getByText('Resend email'));

        await waitFor(() => {
            expect(screen.getByText('Please wait 30 seconds before requesting another verification email.')).toBeInTheDocument();
            expect(screen.getByText('Resend email')).toBeDisabled();
        });
    });

    it('shows rate limit countdown', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({
                message: 'Verification email sent successfully.',
                nextAttemptAt: Date.now() + 30000,
            }),
        });

        render(<EmailVerificationBanner {...defaultProps} />);

        fireEvent.click(screen.getByText('Resend email'));

        await waitFor(() => {
            expect(screen.getByText(/Next resend available in \d+ seconds/)).toBeInTheDocument();
        });
    });

    it('shows change email form when change email is clicked', () => {
        render(<EmailVerificationBanner {...defaultProps} />);

        fireEvent.click(screen.getByText('Change email'));

        expect(screen.getByPlaceholderText('newemail@example.com')).toBeInTheDocument();
        expect(screen.getByText('Update')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('calls onChangeEmail when update button is clicked with valid email', () => {
        render(<EmailVerificationBanner {...defaultProps} />);

        fireEvent.click(screen.getByText('Change email'));

        const input = screen.getByPlaceholderText('newemail@example.com');
        fireEvent.change(input, { target: { value: 'newemail@example.com' } });

        fireEvent.click(screen.getByText('Update'));

        expect(defaultProps.onChangeEmail).toHaveBeenCalled();
    });

    it('calls onDismiss when dismiss button is clicked', () => {
        render(<EmailVerificationBanner {...defaultProps} allowDismiss={true} />);

        fireEvent.click(screen.getByText('Dismiss'));

        expect(defaultProps.onDismiss).toHaveBeenCalled();
    });

    it('shows error when manual check finds unverified email', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ verified: false }),
        });

        render(<EmailVerificationBanner {...defaultProps} />);

        fireEvent.click(screen.getByText("I've verified"));

        await waitFor(() => {
            expect(screen.getByText('Email not verified yet. Please check your inbox and spam folder.')).toBeInTheDocument();
        });
    });
});


