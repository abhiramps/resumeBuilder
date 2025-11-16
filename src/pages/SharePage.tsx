/**
 * Share Page
 * Resume sharing interface with public URL and analytics
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSharing } from '../hooks/useSharing';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { ArrowLeft, Copy, Check, Globe, Lock, Eye, Calendar } from 'lucide-react';

export const SharePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {
        shareLink,
        isShared,
        analytics,
        isLoading,
        error,
        createShareLink,
        revokeShareLink,
        getAnalytics,
    } = useSharing(id!);

    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (id && isShared) {
            getAnalytics();
        }
    }, [id, isShared]);

    const handleCreateShare = async () => {
        try {
            await createShareLink();
        } catch (err) {
            console.error('Failed to create share link:', err);
        }
    };

    const handleRevokeShare = async () => {
        if (!confirm('Are you sure you want to revoke public access? The current link will stop working.')) {
            return;
        }

        try {
            await revokeShareLink();
        } catch (err) {
            console.error('Failed to revoke share link:', err);
        }
    };

    const handleCopyLink = async () => {
        if (shareLink && 'publicUrl' in shareLink) {
            try {
                await navigator.clipboard.writeText((shareLink as any).publicUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy link:', err);
            }
        }
    };

    const handleBack = () => {
        navigate(`/editor/${id}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={handleBack}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Share Resume</h1>
                            <p className="text-sm text-gray-600">
                                Create a public link to share your resume
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Error Message */}
                {error && (
                    <div className="mb-6 rounded-md bg-red-50 p-4">
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                )}

                {/* Not Shared State */}
                {!isLoading && !isShared && (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                            <Lock className="w-8 h-8 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Resume is Private
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Create a public link to share your resume with anyone. They'll be able to
                            view it without signing in.
                        </p>
                        <Button variant="primary" onClick={handleCreateShare}>
                            <Globe className="w-5 h-5 mr-2" />
                            Create Public Link
                        </Button>
                    </div>
                )}

                {/* Shared State */}
                {!isLoading && isShared && shareLink && (
                    <div className="space-y-6">
                        {/* Public Link Section */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Globe className="w-5 h-5 text-green-600" />
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Public Link Active
                                </h2>
                            </div>

                            <p className="text-sm text-gray-600 mb-4">
                                Anyone with this link can view your resume
                            </p>

                            <div className="flex gap-2">
                                <Input
                                    value={shareLink && 'publicUrl' in shareLink ? (shareLink as any).publicUrl : ''}
                                    readOnly
                                    className="flex-1"
                                />
                                <Button
                                    variant={copied ? 'primary' : 'secondary'}
                                    onClick={handleCopyLink}
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-5 h-5 mr-2" />
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-5 h-5 mr-2" />
                                            Copy
                                        </>
                                    )}
                                </Button>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <Button variant="danger" onClick={handleRevokeShare}>
                                    Revoke Access
                                </Button>
                            </div>
                        </div>

                        {/* Analytics Section */}
                        {analytics && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Analytics
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Total Views */}
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Eye className="w-5 h-5 text-blue-600" />
                                            <span className="text-sm font-medium text-blue-900">
                                                Total Views
                                            </span>
                                        </div>
                                        <p className="text-3xl font-bold text-blue-600">
                                            {analytics.viewCount || 0}
                                        </p>
                                    </div>

                                    {/* Unique Visitors */}
                                    <div className="bg-green-50 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Globe className="w-5 h-5 text-green-600" />
                                            <span className="text-sm font-medium text-green-900">
                                                Unique Visitors
                                            </span>
                                        </div>
                                        <p className="text-3xl font-bold text-green-600">
                                            {analytics.viewCount || 0}
                                        </p>
                                    </div>

                                    {/* Last Viewed */}
                                    <div className="bg-purple-50 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Calendar className="w-5 h-5 text-purple-600" />
                                            <span className="text-sm font-medium text-purple-900">
                                                Last Viewed
                                            </span>
                                        </div>
                                        <p className="text-sm font-semibold text-purple-600">
                                            {analytics.lastViewedAt
                                                ? new Date(analytics.lastViewedAt).toLocaleDateString()
                                                : 'Never'}
                                        </p>
                                    </div>
                                </div>

                                {/* Recent Views */}
                                {analytics.viewsByDate && analytics.viewsByDate.length > 0 && (
                                    <div className="mt-6">
                                        <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                            Views by Date
                                        </h3>
                                        <div className="space-y-2">
                                            {analytics.viewsByDate.map((view, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded"
                                                >
                                                    <span className="text-sm text-gray-600">
                                                        {new Date(view.date).toLocaleDateString()}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {view.count} views
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tips Section */}
                        <div className="bg-blue-50 rounded-lg p-6">
                            <h3 className="text-sm font-semibold text-blue-900 mb-2">
                                💡 Sharing Tips
                            </h3>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• Share this link on LinkedIn, job applications, or your email signature</li>
                                <li>• The link will always show the latest version of your resume</li>
                                <li>• You can revoke access anytime to make your resume private again</li>
                                <li>• Track views to see how many people are viewing your resume</li>
                            </ul>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};
