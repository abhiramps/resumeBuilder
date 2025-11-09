/**
 * Resume Management Example
 * Demonstrates how to use the resume hooks for CRUD operations
 */

import React, { useState } from 'react';
import {
    useResumes,
    useResume,
    useCreateResume,
    useUpdateResume,
    useDeleteResume,
    useDuplicateResume,
    useShareResume,
    useExportResume,
    useImportResume,
} from '../hooks';
import type { CreateResumeRequest, UpdateResumeRequest } from '../types/api.types';

export const ResumeManagementExample: React.FC = () => {
    const [selectedResumeId, setSelectedResumeId] = useState<string | undefined>();
    const [page, setPage] = useState(1);

    // Fetch list of resumes
    const { data: resumesData, isLoading: isLoadingList } = useResumes({
        page,
        limit: 10,
        sortBy: 'updatedAt',
        sortOrder: 'desc',
    });

    // Fetch single resume
    const { data: resume, isLoading: isLoadingResume } = useResume(selectedResumeId);

    // Mutations
    const createResume = useCreateResume();
    const updateResume = useUpdateResume(selectedResumeId || '');
    const deleteResume = useDeleteResume();
    const duplicateResume = useDuplicateResume();
    const shareResume = useShareResume(selectedResumeId || '');
    const exportResume = useExportResume();
    const importResume = useImportResume();

    // Create new resume
    const handleCreate = async () => {
        const newResume: CreateResumeRequest = {
            title: 'My New Resume',
            description: 'A professional resume',
            templateId: 'classic',
            content: {
                personalInfo: {
                    fullName: 'John Doe',
                    title: 'Software Engineer',
                    email: 'john@example.com',
                    phone: '+1234567890',
                    location: 'San Francisco, CA',
                },
            },
        };

        try {
            const created = await createResume.mutateAsync(newResume);
            console.log('Resume created:', created);
            setSelectedResumeId(created.id);
        } catch (error) {
            console.error('Failed to create resume:', error);
        }
    };

    // Update resume
    const handleUpdate = async () => {
        if (!selectedResumeId) return;

        const updates: UpdateResumeRequest = {
            title: 'Updated Resume Title',
            content: {
                ...resume?.content,
                summary: 'An experienced software engineer with 5+ years...',
            },
        };

        try {
            await updateResume.mutateAsync(updates);
            console.log('Resume updated');
        } catch (error) {
            console.error('Failed to update resume:', error);
        }
    };

    // Delete resume
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this resume?')) return;

        try {
            await deleteResume.mutateAsync(id);
            console.log('Resume deleted');
            if (selectedResumeId === id) {
                setSelectedResumeId(undefined);
            }
        } catch (error) {
            console.error('Failed to delete resume:', error);
        }
    };

    // Duplicate resume
    const handleDuplicate = async (id: string) => {
        try {
            const duplicated = await duplicateResume.mutateAsync(id);
            console.log('Resume duplicated:', duplicated);
            setSelectedResumeId(duplicated.id);
        } catch (error) {
            console.error('Failed to duplicate resume:', error);
        }
    };

    // Share resume
    const handleShare = async (isPublic: boolean) => {
        if (!selectedResumeId) return;

        try {
            const result = await shareResume.mutateAsync({
                isPublic,
                publicSlug: isPublic ? `resume-${Date.now()}` : undefined,
            });
            console.log('Resume sharing updated:', result);
        } catch (error) {
            console.error('Failed to update sharing:', error);
        }
    };

    // Export resume
    const handleExport = async (format: 'pdf' | 'docx' | 'json') => {
        if (!selectedResumeId) return;

        try {
            await exportResume.mutateAsync({ id: selectedResumeId, format });
            console.log(`Resume exported as ${format}`);
        } catch (error) {
            console.error('Failed to export resume:', error);
        }
    };

    // Import resume
    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const imported = await importResume.mutateAsync(file);
            console.log('Resume imported:', imported);
            setSelectedResumeId(imported.id);
        } catch (error) {
            console.error('Failed to import resume:', error);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Resume Management</h1>

            {/* Actions */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={handleCreate}
                    disabled={createResume.isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {createResume.isPending ? 'Creating...' : 'Create Resume'}
                </button>

                <label className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer">
                    {importResume.isPending ? 'Importing...' : 'Import Resume'}
                    <input
                        type="file"
                        accept=".json,.pdf,.docx"
                        onChange={handleImport}
                        className="hidden"
                        disabled={importResume.isPending}
                    />
                </label>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Resume List */}
                <div className="border rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-4">My Resumes</h2>

                    {isLoadingList ? (
                        <p>Loading resumes...</p>
                    ) : (
                        <>
                            <div className="space-y-2">
                                {resumesData?.data.map((resume) => (
                                    <div
                                        key={resume.id}
                                        className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${selectedResumeId === resume.id ? 'bg-blue-50 border-blue-500' : ''
                                            }`}
                                        onClick={() => setSelectedResumeId(resume.id)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium">{resume.title}</h3>
                                                <p className="text-sm text-gray-600">
                                                    {resume.status} • Updated{' '}
                                                    {new Date(resume.updatedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDuplicate(resume.id);
                                                    }}
                                                    className="text-sm text-blue-600 hover:underline"
                                                >
                                                    Duplicate
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(resume.id);
                                                    }}
                                                    className="text-sm text-red-600 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {resumesData && resumesData.pagination.totalPages > 1 && (
                                <div className="flex justify-center gap-2 mt-4">
                                    <button
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="px-3 py-1 border rounded disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <span className="px-3 py-1">
                                        Page {page} of {resumesData.pagination.totalPages}
                                    </span>
                                    <button
                                        onClick={() => setPage((p) => p + 1)}
                                        disabled={page >= resumesData.pagination.totalPages}
                                        className="px-3 py-1 border rounded disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Resume Details */}
                <div className="border rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-4">Resume Details</h2>

                    {!selectedResumeId ? (
                        <p className="text-gray-600">Select a resume to view details</p>
                    ) : isLoadingResume ? (
                        <p>Loading resume...</p>
                    ) : resume ? (
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-medium text-lg">{resume.title}</h3>
                                <p className="text-sm text-gray-600">{resume.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <span className="font-medium">Status:</span> {resume.status}
                                </div>
                                <div>
                                    <span className="font-medium">Template:</span> {resume.templateId}
                                </div>
                                <div>
                                    <span className="font-medium">Views:</span> {resume.viewCount}
                                </div>
                                <div>
                                    <span className="font-medium">Exports:</span> {resume.exportCount}
                                </div>
                                <div>
                                    <span className="font-medium">Public:</span> {resume.isPublic ? 'Yes' : 'No'}
                                </div>
                                {resume.atsScore && (
                                    <div>
                                        <span className="font-medium">ATS Score:</span> {resume.atsScore}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="space-y-2">
                                <button
                                    onClick={handleUpdate}
                                    disabled={updateResume.isPending}
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {updateResume.isPending ? 'Updating...' : 'Update Resume'}
                                </button>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleShare(!resume.isPublic)}
                                        disabled={shareResume.isPending}
                                        className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        {shareResume.isPending
                                            ? 'Updating...'
                                            : resume.isPublic
                                                ? 'Make Private'
                                                : 'Make Public'}
                                    </button>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleExport('pdf')}
                                        disabled={exportResume.isPending}
                                        className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Export PDF
                                    </button>
                                    <button
                                        onClick={() => handleExport('docx')}
                                        disabled={exportResume.isPending}
                                        className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Export DOCX
                                    </button>
                                    <button
                                        onClick={() => handleExport('json')}
                                        disabled={exportResume.isPending}
                                        className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Export JSON
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-red-600">Failed to load resume</p>
                    )}
                </div>
            </div>
        </div>
    );
};
