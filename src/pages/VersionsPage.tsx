/**
 * Versions Page
 * Version history and management interface
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVersionsManagement as useVersions } from '../hooks/useVersions';
import { Button } from '../components/UI/Button';
import { Modal } from '../components/UI/Modal';
import { ArrowLeft, Clock, RotateCcw, Plus, Eye } from 'lucide-react';
import type { ResumeVersion } from '../types/version.types';

export const VersionsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {
        versions,
        isLoading,
        error,
        listVersions,
        createVersion,
        restoreVersion,
    } = useVersions(id!);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [versionName, setVersionName] = useState('');
    const [selectedVersion, setSelectedVersion] = useState<ResumeVersion | null>(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    useEffect(() => {
        if (id) {
            listVersions();
        }
    }, [id]);

    const handleBack = () => {
        navigate(`/editor/${id}`);
    };

    const handleCreateVersion = async () => {
        if (!versionName.trim()) {
            alert('Please enter a version name');
            return;
        }

        try {
            await createVersion(versionName);
            setShowCreateModal(false);
            setVersionName('');
        } catch (err) {
            console.error('Failed to create version:', err);
        }
    };

    const handleRestoreVersion = async (versionId: string) => {
        if (!confirm('Are you sure you want to restore this version? Your current resume will be replaced.')) {
            return;
        }

        try {
            await restoreVersion(versionId);
            navigate(`/editor/${id}`);
        } catch (err) {
            console.error('Failed to restore version:', err);
        }
    };

    const handlePreviewVersion = (version: ResumeVersion) => {
        setSelectedVersion(version);
        setShowPreviewModal(true);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" onClick={handleBack}>
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Version History</h1>
                                <p className="text-sm text-gray-600">
                                    View and restore previous versions of your resume
                                </p>
                            </div>
                        </div>
                        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                            <Plus className="w-5 h-5 mr-2" />
                            Create Snapshot
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

                {/* Empty State */}
                {!isLoading && versions.length === 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            No Version History
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Create snapshots to save different versions of your resume
                        </p>
                        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                            <Plus className="w-5 h-5 mr-2" />
                            Create First Snapshot
                        </Button>
                    </div>
                )}

                {/* Version List */}
                {!isLoading && versions.length > 0 && (
                    <div className="space-y-4">
                        {/* Current Version Badge */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-blue-600" />
                                <span className="text-sm font-medium text-blue-900">
                                    You're viewing the current version
                                </span>
                            </div>
                        </div>

                        {/* Version Cards */}
                        {versions.map((version, index) => (
                            <div
                                key={version.id}
                                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {version.versionName || `Version ${version.versionNumber}`}
                                            </h3>
                                            {index === 0 && (
                                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                                                    Latest
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {new Date(version.createdAt).toLocaleString()}
                                            </span>
                                            {version.changesSummary && (
                                                <span>• {version.changesSummary}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => handlePreviewVersion(version)}
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                            Preview
                                        </Button>
                                        {index !== 0 && (
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleRestoreVersion(version.id)}
                                            >
                                                <RotateCcw className="w-4 h-4 mr-1" />
                                                Restore
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* Version Metadata */}
                                {version.templateId && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500">Template:</span>
                                                <span className="ml-2 font-medium text-gray-900">
                                                    {version.templateId}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Version:</span>
                                                <span className="ml-2 font-medium text-gray-900">
                                                    #{version.versionNumber}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Info Box */}
                {!isLoading && versions.length > 0 && (
                    <div className="mt-8 bg-blue-50 rounded-lg p-6">
                        <h3 className="text-sm font-semibold text-blue-900 mb-2">
                            💡 Version Management Tips
                        </h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Create snapshots before making major changes</li>
                            <li>• Use descriptive names to easily identify versions</li>
                            <li>• Restore any previous version with one click</li>
                            <li>• Versions are saved automatically when you create snapshots</li>
                        </ul>
                    </div>
                )}
            </main>

            {/* Create Version Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Create Version Snapshot"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Save the current state of your resume as a version snapshot
                    </p>

                    <div>
                        <label htmlFor="versionName" className="block text-sm font-medium text-gray-700 mb-1">
                            Version Name
                        </label>
                        <input
                            id="versionName"
                            type="text"
                            value={versionName}
                            onChange={(e) => setVersionName(e.target.value)}
                            placeholder="e.g., Before applying to Google"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="flex gap-3 justify-end">
                        <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleCreateVersion}>
                            Create Snapshot
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Preview Modal */}
            <Modal
                isOpen={showPreviewModal}
                onClose={() => setShowPreviewModal(false)}
                title={selectedVersion?.versionName || 'Version Preview'}
                size="lg"
            >
                {selectedVersion && (
                    <div className="space-y-4">
                        <div className="text-sm text-gray-600">
                            Created: {new Date(selectedVersion.createdAt).toLocaleString()}
                        </div>
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                                {JSON.stringify(selectedVersion.content, null, 2)}
                            </pre>
                        </div>
                        <div className="flex gap-3 justify-end">
                            <Button variant="secondary" onClick={() => setShowPreviewModal(false)}>
                                Close
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => {
                                    setShowPreviewModal(false);
                                    handleRestoreVersion(selectedVersion.id);
                                }}
                            >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Restore This Version
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
