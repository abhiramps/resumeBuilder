/**
 * Resume Editor Page
 * Main editor with three-panel layout: editor, preview, and controls
 */

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResumeBackend } from '../contexts/ResumeBackendContext';
import { useResumeContext } from '../contexts/ResumeContext';
import { EditorSidebar } from '../components/Editor/EditorSidebar';
import { ResumePreview } from '../components/Preview/ResumePreview';
import { Button } from '../components/UI/Button';
import { SaveStatusIndicator } from '../components/UI/SaveStatusIndicator';
import { TemplateSelector } from '../components/UI/TemplateSelector';
import { ExportModal } from '../components/UI/ExportModal';
import { ArrowLeft, Download, Share2, History, Eye, EyeOff } from 'lucide-react';

export const EditorPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentResume, loadResume, updateResume, isSaving, error } = useResumeBackend();
    const { resume, dispatch } = useResumeContext();

    const [showPreview, setShowPreview] = useState(true);
    const [showExportModal, setShowExportModal] = useState(false);
    const [showTemplateSelector, setShowTemplateSelector] = useState(false);

    // Track if we've loaded the resume from backend
    const hasLoadedRef = useRef(false);
    const lastSavedRef = useRef<string>('');

    // Load resume on mount
    useEffect(() => {
        if (id && !hasLoadedRef.current) {
            loadResume(id);
        }
    }, [id, loadResume]);

    // Sync backend resume to local context (only once)
    useEffect(() => {
        if (currentResume && !hasLoadedRef.current) {
            hasLoadedRef.current = true;

            // Update local context with backend data
            if (currentResume.content) {
                // Reconstruct sections from backend data
                const updatedSections = resume.sections.map(section => {
                    if (section.type === 'summary' && currentResume.content.summary) {
                        return {
                            ...section,
                            content: { summary: currentResume.content.summary }
                        };
                    }
                    if (section.type === 'experience' && currentResume.content.experience) {
                        return {
                            ...section,
                            content: { experiences: currentResume.content.experience }
                        };
                    }
                    if (section.type === 'education' && currentResume.content.education) {
                        return {
                            ...section,
                            content: { education: currentResume.content.education }
                        };
                    }
                    if (section.type === 'skills' && currentResume.content.skills) {
                        return {
                            ...section,
                            content: { skills: currentResume.content.skills }
                        };
                    }
                    if (section.type === 'projects' && currentResume.content.projects) {
                        return {
                            ...section,
                            content: { projects: currentResume.content.projects }
                        };
                    }
                    if (section.type === 'certifications' && currentResume.content.certifications) {
                        return {
                            ...section,
                            content: { certifications: currentResume.content.certifications }
                        };
                    }
                    return section;
                });

                dispatch({
                    type: 'SET_RESUME',
                    payload: {
                        ...resume,
                        id: currentResume.id,
                        personalInfo: currentResume.content.personalInfo || resume.personalInfo,
                        sections: updatedSections,
                        createdAt: currentResume.createdAt,
                        updatedAt: currentResume.updatedAt,
                    }
                });
            }
        }
    }, [currentResume]);

    // Auto-save: sync local changes to backend (debounced)
    useEffect(() => {
        if (!hasLoadedRef.current || !currentResume) return;

        // Create a string representation of the resume for comparison
        const resumeString = JSON.stringify({
            personalInfo: resume.personalInfo,
            sections: resume.sections,
            layout: resume.layout,
        });

        // Skip if nothing changed
        if (resumeString === lastSavedRef.current) return;

        const timeoutId = setTimeout(() => {
            lastSavedRef.current = resumeString;

            // Extract content from sections
            const summarySection = resume.sections.find(s => s.type === 'summary');
            const experienceSection = resume.sections.find(s => s.type === 'experience');
            const educationSection = resume.sections.find(s => s.type === 'education');
            const skillsSection = resume.sections.find(s => s.type === 'skills');
            const projectsSection = resume.sections.find(s => s.type === 'projects');
            const certificationsSection = resume.sections.find(s => s.type === 'certifications');

            updateResume({
                content: {
                    personalInfo: resume.personalInfo,
                    summary: (summarySection?.content as any)?.summary || '',
                    experience: (experienceSection?.content as any)?.experiences || [],
                    education: (educationSection?.content as any)?.education || [],
                    skills: (skillsSection?.content as any)?.skills || [],
                    projects: (projectsSection?.content as any)?.projects || [],
                    certifications: (certificationsSection?.content as any)?.certifications || [],
                },
            });
        }, 2000); // Debounce by 2 seconds

        return () => clearTimeout(timeoutId);
    }, [resume.personalInfo, resume.sections, resume.layout]);

    const handleBack = () => {
        navigate('/dashboard');
    };

    const handleShare = () => {
        if (id) {
            navigate(`/share/${id}`);
        }
    };

    const handleVersions = () => {
        if (id) {
            navigate(`/versions/${id}`);
        }
    };

    const handleExport = () => {
        setShowExportModal(true);
    };

    const togglePreview = () => {
        setShowPreview(!showPreview);
    };

    if (!currentResume) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading resume...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={handleBack}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-lg font-semibold text-gray-900">
                            {currentResume.title}
                        </h1>
                        <SaveStatusIndicator isSaving={isSaving} />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Template Selector */}
                    <Button
                        variant="secondary"
                        onClick={() => setShowTemplateSelector(!showTemplateSelector)}
                    >
                        Template
                    </Button>

                    {/* Toggle Preview (Mobile) */}
                    <Button
                        variant="secondary"
                        onClick={togglePreview}
                        className="lg:hidden"
                    >
                        {showPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </Button>

                    {/* Version History */}
                    <Button variant="secondary" onClick={handleVersions}>
                        <History className="w-5 h-5 mr-2" />
                        Versions
                    </Button>

                    {/* Share */}
                    <Button variant="secondary" onClick={handleShare}>
                        <Share2 className="w-5 h-5 mr-2" />
                        Share
                    </Button>

                    {/* Export */}
                    <Button variant="primary" onClick={handleExport}>
                        <Download className="w-5 h-5 mr-2" />
                        Export
                    </Button>
                </div>
            </header>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border-b border-red-200 px-4 py-3">
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}

            {/* Template Selector Dropdown */}
            {showTemplateSelector && (
                <div className="bg-white border-b border-gray-200 px-4 py-4">
                    <TemplateSelector
                        currentTemplate={resume.templateId || 'modern'}
                        onTemplateChange={(templateId) => {
                            dispatch({ type: 'UPDATE_LAYOUT', payload: { templateId } });
                        }}
                    />
                </div>
            )}

            {/* Main Content - Three Panel Layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Editor Sidebar */}
                <div className="w-full lg:w-96 bg-white border-r border-gray-200 overflow-y-auto">
                    <EditorSidebar />
                </div>

                {/* Right Panel - Preview */}
                {showPreview && (
                    <div className="hidden lg:block flex-1 overflow-y-auto bg-gray-100 p-8">
                        <div className="max-w-4xl mx-auto">
                            <ResumePreview resume={resume} />
                        </div>
                    </div>
                )}

                {/* Mobile Preview (Full Screen) */}
                {showPreview && (
                    <div className="lg:hidden fixed inset-0 z-50 bg-gray-100 overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Preview</h2>
                            <Button variant="ghost" onClick={togglePreview}>
                                <EyeOff className="w-5 h-5" />
                            </Button>
                        </div>
                        <div className="p-4">
                            <ResumePreview resume={resume} />
                        </div>
                    </div>
                )}
            </div>

            {/* Export Modal */}
            {showExportModal && (
                <ExportModal
                    isOpen={showExportModal}
                    onClose={() => setShowExportModal(false)}
                    resume={resume}
                />
            )}
        </div>
    );
};
