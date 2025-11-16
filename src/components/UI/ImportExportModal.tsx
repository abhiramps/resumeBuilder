/**
 * ImportExportModal Component
 * Modal for importing and exporting resumes in various formats
 */

import React, { useState, useRef } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import {
    Download,
    Upload,
    FileJson,
    FileText,
    File,
    CheckCircle,
    AlertCircle,
    Copy
} from 'lucide-react';
import { useImportExport } from '../../hooks/useImportExport';
import type { ResumeResponse } from '../../types/api.types';

interface ImportExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    resume?: ResumeResponse;
    resumes?: ResumeResponse[];
    mode: 'single' | 'bulk';
    onImportSuccess?: (resume: ResumeResponse) => void;
}

type TabType = 'export' | 'import';
type ExportFormat = 'json' | 'pdf' | 'docx';

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
    isOpen,
    onClose,
    resume,
    resumes = [],
    mode,
    onImportSuccess,
}) => {
    const [activeTab, setActiveTab] = useState<TabType>('export');
    const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('json');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        isExporting,
        isImporting,
        error,
        exportAsJSON,
        exportAsPDF,
        exportAsDOCX,
        bulkExportAsJSON,
        importFromJSON,
        importFromFile,
        clearError,
    } = useImportExport();

    const handleExport = async () => {
        try {
            clearError();
            setSuccessMessage(null);

            if (mode === 'bulk') {
                if (selectedFormat === 'json') {
                    await bulkExportAsJSON(resumes);
                    setSuccessMessage(`Successfully exported ${resumes.length} resumes`);
                } else {
                    throw new Error('Bulk export only supports JSON format');
                }
            } else if (resume) {
                switch (selectedFormat) {
                    case 'json':
                        await exportAsJSON(resume);
                        setSuccessMessage('Resume exported as JSON');
                        break;
                    case 'pdf':
                        await exportAsPDF(resume.id);
                        setSuccessMessage('Resume exported as PDF');
                        break;
                    case 'docx':
                        await exportAsDOCX(resume.id);
                        setSuccessMessage('Resume exported as DOCX');
                        break;
                }
            }

            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            console.error('Export failed:', err);
        }
    };

    const handleImport = async (file: File) => {
        try {
            clearError();
            setSuccessMessage(null);

            let importedResume: ResumeResponse | null = null;

            if (file.type === 'application/json') {
                importedResume = await importFromJSON(file);
            } else {
                importedResume = await importFromFile(file);
            }

            if (importedResume) {
                setSuccessMessage('Resume imported successfully');
                onImportSuccess?.(importedResume);
                setTimeout(() => {
                    onClose();
                }, 1500);
            }
        } catch (err) {
            console.error('Import failed:', err);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImport(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleImport(file);
        }
    };

    const formatOptions = [
        {
            value: 'json' as ExportFormat,
            label: 'JSON',
            description: 'Editable format for backup and transfer',
            icon: FileJson,
            available: true,
        },
        {
            value: 'pdf' as ExportFormat,
            label: 'PDF',
            description: 'Print-ready format for applications',
            icon: FileText,
            available: mode === 'single',
        },
        {
            value: 'docx' as ExportFormat,
            label: 'DOCX',
            description: 'Editable Word document',
            icon: File,
            available: mode === 'single',
        },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={mode === 'bulk' ? 'Bulk Export Resumes' : 'Import / Export Resume'}
            size="lg"
        >
            <div className="space-y-6">
                {/* Tabs */}
                {mode === 'single' && (
                    <div className="flex gap-2 border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('export')}
                            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === 'export'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Download className="w-4 h-4 inline mr-2" />
                            Export
                        </button>
                        <button
                            onClick={() => setActiveTab('import')}
                            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === 'import'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Upload className="w-4 h-4 inline mr-2" />
                            Import
                        </button>
                    </div>
                )}

                {/* Success Message */}
                {successMessage && (
                    <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-md">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <p className="text-sm text-green-800">{successMessage}</p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-md">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                {/* Export Tab */}
                {(activeTab === 'export' || mode === 'bulk') && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-4">
                                {mode === 'bulk' ? 'Select Export Format' : 'Choose Export Format'}
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                                {formatOptions
                                    .filter(option => option.available)
                                    .map((option) => {
                                        const Icon = option.icon;
                                        return (
                                            <button
                                                key={option.value}
                                                onClick={() => setSelectedFormat(option.value)}
                                                className={`flex items-start gap-4 p-4 border-2 rounded-lg transition-all ${selectedFormat === option.value
                                                        ? 'border-blue-600 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <Icon className={`w-6 h-6 flex-shrink-0 ${selectedFormat === option.value ? 'text-blue-600' : 'text-gray-400'
                                                    }`} />
                                                <div className="flex-1 text-left">
                                                    <div className="font-medium text-gray-900">{option.label}</div>
                                                    <div className="text-sm text-gray-600">{option.description}</div>
                                                </div>
                                                {selectedFormat === option.value && (
                                                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                                )}
                                            </button>
                                        );
                                    })}
                            </div>
                        </div>

                        {mode === 'bulk' && (
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                                <p className="text-sm text-blue-800">
                                    <strong>{resumes.length}</strong> resume{resumes.length !== 1 ? 's' : ''} will be exported
                                </p>
                            </div>
                        )}

                        <div className="flex justify-end gap-3">
                            <Button variant="secondary" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleExport}
                                loading={isExporting}
                                disabled={isExporting}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export {mode === 'bulk' ? 'All' : selectedFormat.toUpperCase()}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Import Tab */}
                {activeTab === 'import' && mode === 'single' && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-4">
                                Import Resume
                            </h3>

                            {/* Drag and Drop Area */}
                            <div
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-sm font-medium text-gray-900 mb-1">
                                    Drop your resume file here, or click to browse
                                </p>
                                <p className="text-xs text-gray-600">
                                    Supports JSON, PDF, and DOCX files
                                </p>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".json,.pdf,.docx"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>

                        {/* Import Info */}
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
                                <FileJson className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <div className="font-medium text-gray-900">JSON Files</div>
                                    <div className="text-gray-600">
                                        Import previously exported resumes with full data preservation
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
                                <FileText className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <div className="font-medium text-gray-900">PDF / DOCX Files</div>
                                    <div className="text-gray-600">
                                        AI-powered parsing to extract resume content (may require manual review)
                                    </div>
                                </div>
                            </div>
                        </div>

                        {isImporting && (
                            <div className="flex items-center justify-center py-8">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p className="text-sm text-gray-600">Importing resume...</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Modal>
    );
};
