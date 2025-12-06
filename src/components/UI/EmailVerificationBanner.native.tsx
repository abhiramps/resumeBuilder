/**
 * Email Verification Banner - React Native Version
 * Persistent banner shown after signup until email is verified
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming Expo is used

interface EmailVerificationBannerProps {
    /** User's email address */
    email: string;
    /** Callback when user clicks "Change Email" */
    onChangeEmail?: () => void;
    /** Callback when verification is completed */
    onVerificationComplete?: () => void;
    /** Callback when user dismisses the banner */
    onDismiss?: () => void;
    /** Whether to show dismiss option (only after verification or user action) */
    allowDismiss?: boolean;
    /** Custom style for the container */
    style?: any;
}

interface ResendState {
    isLoading: boolean;
    lastSentAt: number | null;
    error: string | null;
    success: string | null;
    nextAttemptAt: number | null;
}

export const EmailVerificationBanner: React.FC<EmailVerificationBannerProps> = ({
    email,
    onChangeEmail,
    onVerificationComplete,
    onDismiss,
    allowDismiss = false,
    style = {},
}) => {
    const [resendState, setResendState] = useState<ResendState>({
        isLoading: false,
        lastSentAt: null,
        error: null,
        success: null,
        nextAttemptAt: null,
    });
    const [isPolling, setIsPolling] = useState(false);
    const [showChangeEmail, setShowChangeEmail] = useState(false);
    const [newEmail, setNewEmail] = useState('');

    // Check verification status
    const checkVerificationStatus = useCallback(async () => {
        try {
            const response = await fetch(`/api/verification/status?email=${encodeURIComponent(email)}`);
            if (response.ok) {
                const data = await response.json();
                if (data.verified) {
                    onVerificationComplete?.();
                    return true;
                }
            }
        } catch (error) {
            console.error('Failed to check verification status:', error);
        }
        return false;
    }, [email, onVerificationComplete]);

    // Poll for verification status every 30 seconds
    useEffect(() => {
        const pollInterval = setInterval(async () => {
            if (!isPolling) return;
            const isVerified = await checkVerificationStatus();
            if (isVerified) {
                setIsPolling(false);
            }
        }, 30000); // 30 seconds

        return () => clearInterval(pollInterval);
    }, [checkVerificationStatus, isPolling]);

    // Start polling when component mounts
    useEffect(() => {
        setIsPolling(true);
        return () => setIsPolling(false);
    }, []);

    // Handle resend verification email
    const handleResendEmail = async () => {
        setResendState(prev => ({ ...prev, isLoading: true, error: null, success: null }));

        try {
            const response = await fetch('/api/verification/resend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setResendState(prev => ({
                    ...prev,
                    isLoading: false,
                    lastSentAt: Date.now(),
                    success: 'Verification email sent successfully!',
                    nextAttemptAt: data.nextAttemptAt || null,
                    error: null,
                }));
            } else {
                setResendState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: data.error?.message || 'Failed to send verification email',
                    success: null,
                    nextAttemptAt: data.error?.waitTime ? Date.now() + (data.error.waitTime * 1000) : null,
                }));
            }
        } catch (error) {
            setResendState(prev => ({
                ...prev,
                isLoading: false,
                error: 'Network error. Please try again.',
                success: null,
            }));
        }
    };

    // Handle manual verification check
    const handleManualCheck = async () => {
        setIsPolling(true);
        const isVerified = await checkVerificationStatus();
        if (!isVerified) {
            Alert.alert(
                'Not Verified Yet',
                'Your email is not verified yet. Please check your inbox and spam folder, or try resending the verification email.'
            );
        }
    };

    // Handle change email
    const handleChangeEmail = async () => {
        if (!newEmail.trim()) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        // In a real app, you'd call an API to update the email
        // For now, just call the callback
        onChangeEmail?.();
        setShowChangeEmail(false);
        setNewEmail('');
    };

    // Calculate time until next resend is allowed
    const getTimeUntilNextResend = () => {
        if (!resendState.nextAttemptAt) return 0;
        return Math.max(0, Math.ceil((resendState.nextAttemptAt - Date.now()) / 1000));
    };

    const timeUntilNextResend = getTimeUntilNextResend();
    const canResend = timeUntilNextResend === 0 && !resendState.isLoading;

    return (
        <View style={[{
            backgroundColor: '#DBEAFE', // blue-100
            borderLeftWidth: 4,
            borderLeftColor: '#3B82F6', // blue-500
            padding: 16,
            marginVertical: 8,
        }, style]}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <Ionicons
                    name="information-circle"
                    size={20}
                    color="#3B82F6"
                    style={{ marginRight: 12, marginTop: 2 }}
                />
                <View style={{ flex: 1 }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: '#1E40AF', // blue-800
                        marginBottom: 8,
                    }}>
                        Please verify your email
                    </Text>

                    <Text style={{
                        fontSize: 14,
                        color: '#1E40AF', // blue-700
                        marginBottom: 4,
                        lineHeight: 20,
                    }}>
                        We sent a verification link to{' '}
                        <Text style={{ fontWeight: '500' }}>{email}</Text>
                    </Text>

                    <Text style={{
                        fontSize: 14,
                        color: '#1E40AF', // blue-700
                        marginBottom: 12,
                        lineHeight: 20,
                    }}>
                        Click the link in the email to verify your account and start building your resume.
                    </Text>

                    {/* Status Messages */}
                    {resendState.success && (
                        <View style={{
                            backgroundColor: '#D1FAE5', // green-100
                            padding: 8,
                            borderRadius: 4,
                            marginBottom: 8,
                        }}>
                            <Text style={{
                                fontSize: 14,
                                color: '#065F46', // green-800
                            }}>
                                {resendState.success}
                            </Text>
                        </View>
                    )}

                    {resendState.error && (
                        <View style={{
                            backgroundColor: '#FEE2E2', // red-100
                            padding: 8,
                            borderRadius: 4,
                            marginBottom: 8,
                        }}>
                            <Text style={{
                                fontSize: 14,
                                color: '#991B1B', // red-800
                            }}>
                                {resendState.error}
                            </Text>
                        </View>
                    )}

                    {/* Action Buttons */}
                    <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        gap: 8,
                        marginBottom: timeUntilNextResend > 0 ? 8 : 0,
                    }}>
                        <TouchableOpacity
                            onPress={handleManualCheck}
                            disabled={isPolling}
                            style={{
                                backgroundColor: '#E5E7EB', // gray-200
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: 6,
                            }}
                        >
                            <Text style={{
                                fontSize: 14,
                                color: '#374151', // gray-700
                                fontWeight: '500',
                            }}>
                                {isPolling ? 'Checking...' : 'I\'ve verified'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleResendEmail}
                            disabled={!canResend}
                            style={{
                                backgroundColor: canResend ? '#E5E7EB' : '#F3F4F6', // gray-200 : gray-100
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: 6,
                            }}
                        >
                            {resendState.isLoading ? (
                                <ActivityIndicator size="small" color="#374151" />
                            ) : (
                                <Text style={{
                                    fontSize: 14,
                                    color: canResend ? '#374151' : '#9CA3AF', // gray-700 : gray-400
                                    fontWeight: '500',
                                }}>
                                    {canResend ? 'Resend email' : 'Resend email'}
                                </Text>
                            )}
                        </TouchableOpacity>

                        {onChangeEmail && (
                            <TouchableOpacity
                                onPress={() => setShowChangeEmail(!showChangeEmail)}
                                style={{
                                    paddingHorizontal: 12,
                                    paddingVertical: 6,
                                }}
                            >
                                <Text style={{
                                    fontSize: 14,
                                    color: '#3B82F6', // blue-500
                                    fontWeight: '500',
                                }}>
                                    Change email
                                </Text>
                            </TouchableOpacity>
                        )}

                        {allowDismiss && onDismiss && (
                            <TouchableOpacity
                                onPress={onDismiss}
                                style={{
                                    paddingHorizontal: 12,
                                    paddingVertical: 6,
                                }}
                            >
                                <Text style={{
                                    fontSize: 14,
                                    color: '#6B7280', // gray-500
                                    fontWeight: '500',
                                }}>
                                    Dismiss
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Rate limit message */}
                    {timeUntilNextResend > 0 && (
                        <Text style={{
                            fontSize: 12,
                            color: '#6B7280', // gray-500
                            marginBottom: 8,
                        }}>
                            Next resend available in {timeUntilNextResend} seconds
                        </Text>
                    )}

                    {/* Change Email Form */}
                    {showChangeEmail && (
                        <View style={{
                            backgroundColor: 'white',
                            padding: 12,
                            borderRadius: 6,
                            borderWidth: 1,
                            borderColor: '#DBEAFE', // blue-200
                            marginTop: 8,
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 8,
                            }}>
                                <TextInput
                                    style={{
                                        flex: 1,
                                        borderWidth: 1,
                                        borderColor: '#D1D5DB', // gray-300
                                        borderRadius: 4,
                                        paddingHorizontal: 8,
                                        paddingVertical: 6,
                                        fontSize: 14,
                                    }}
                                    placeholder="newemail@example.com"
                                    value={newEmail}
                                    onChangeText={setNewEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity
                                    onPress={handleChangeEmail}
                                    disabled={!newEmail.trim()}
                                    style={{
                                        backgroundColor: newEmail.trim() ? '#3B82F6' : '#9CA3AF', // blue-500 : gray-400
                                        paddingHorizontal: 12,
                                        paddingVertical: 6,
                                        borderRadius: 4,
                                    }}
                                >
                                    <Text style={{
                                        fontSize: 14,
                                        color: 'white',
                                        fontWeight: '500',
                                    }}>
                                        Update
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setShowChangeEmail(false)}
                                    style={{
                                        paddingHorizontal: 12,
                                        paddingVertical: 6,
                                    }}
                                >
                                    <Text style={{
                                        fontSize: 14,
                                        color: '#6B7280', // gray-500
                                        fontWeight: '500',
                                    }}>
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};


