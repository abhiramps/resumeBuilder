import React, { useState, useRef } from 'react';
import { useResumeContext } from '../../contexts/ResumeContext';
import { Download, Upload, FileJson, AlertCircle, CheckCircle, X } from 'lucide-react';
import {
    exportTemplate,
    downloadTemplate,
    downloadResumeData,
    importTemplateFromFile,
    importResumeDataFromFile,
    applyImportedTemplate,
    isValidTemplateFile,
    getFileSizeString,
    ExportedTemplate,
    ImportValidationResult,
} from '../../utils/templateImporter';

/**
 * Template Import/Export Component
 * 
 * Provides UI for importing and exporting templates and resume data.
 */
export const TemplateImportExport: React.FC = () => {
    const { resume, dispatch } = useResumeContext();
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
    const [importResult, setImportResult] = useState<ImportValidationResult | null>(null);
    const [importedTemplate, setImportedTemplate] = useState<ExportedTemplate | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExportTemplate = () => {
        const template = exportTemplate(
            resume,
            `${resume.template} Custom Template`,
            `Custom ${resume.template} template with personalized settings`,
            'User'
        );
        downloadTemplate(template);
    };

    const handleExportResumeData = () => {
        downloadResumeData(resume);
    };

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!isValidTemplateFile(file)) {
            setImportResult({
                isValid: false,
                errors: ['Invalid file type. Please select a JSON file.'],
                warnings: [],
            });
            return;
        }

        // Check if it's a template or resume data
        const result = await importTemplateFromFile(file);
        setImportResult(result);

        if (result.isValid && result.template) {
            setImportedTemplate(result.template);
        }
    };

    const handleApplyTemplate = () => {
        if (!importedTemplate) return;

        const updatedResume = applyImportedTemplate(importedTemplate, resume);

        // Update template type
        dispatch({ type: 'SET_TEMPLATE', payload: updatedResume.template });

        // Update layout settings
        if (updatedResume.layout.fontFamily) {
            dispatch({ type: 'UPDATE_FONT_FAMILY', payload: updatedResume.layout.fontFamily });
        }
        if (updatedResume.layout.fontSize) {
            dispatch({ type: 'UPDATE_FONT_SIZES', payload: updatedResume.layout.fontSize });
        }
        if (updatedResume.layout.colors) {
            dispatch({ type: 'UPDATE_COLORS', payload: updatedResume.layout.colors });
        }
        if (updatedResume.layout.pageMargins) {
            dispatch({ type: 'UPDATE_MARGINS', payload: updatedResume.layout.pageMargins });
        }
        if (updatedResume.layout.sectionSpacing || updatedResume.layout.lineHeight) {
            dispatch({
                type: 'UPDATE_SPACING',
                payload: {
                    sectionSpacing: updatedResume.layout.sectionSpacing,
                    lineHeight: updatedResume.layout.lineHeight,
                },
            });
        }

        setShowModal(false);
        setImportResult(null);
        setImportedTemplate(null);
    };

    const handleCancel = () => {
        setShowModal(false);
        setImportResult(null);
        setImportedTemplate(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Import/Export Templates"
            >
                <FileJson className="w-4 h-4" />
                <span className="hidden sm:inline">Import/Export</span>
            </button>

            {/* Modal */}
            {showModal && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-30 z-40"
                        onClick={handleCancel}
                    />

                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Template Manager</h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Import or export resume templates and data
                                    </p>
                                </div>
                                <button
                                    onClick={handleCancel}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="h-5 w-5 text-gray-500" />
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-gray-200">
                                <button
                                    onClick={() => setActiveTab('export')}
                                    className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'export'
                                            ? 'text-blue-600 border-b-2 border-blue-600'
                                            : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    Export
                                </button>
                                <button
                                    onClick={() => setActiveTab('import')}
                                    className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'import'
                                            ? 'text-blue-600 border-b-2 border-blue-600'
                                            : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    Import
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                                {activeTab === 'export' ? (
                                    <ExportTab
                                        onExportTemplate={handleExportTemplate}
                                        onExportResumeData={handleExportResumeData}
                                        currentTemplate={resume.template}
                                    />
                                ) : (
                                    <ImportTab
                                        fileInputRef={fileInputRef}
                                        onFileSelect={handleFileSelect}
                                        importResult={importResult}
                                        importedTemplate={importedTemplate}
                                        onApply={handleApplyTemplate}
                                        onCancel={handleCancel}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

/**
 * Export Tab Component
 */
interface ExportTabProps {
    onExportTemplate: () => void;
    onExportResumeData: () => void;
    currentTemplate: string;
}

const ExportTab: React.FC<ExportTabProps> = ({
    onExportTemplate,
    onExportResumeData,
    currentTemplate,
}) => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
                <p className="text-sm text-gray-600 mb-6">
                    Save your current template settings or entire resume data as JSON files.
                </p>
            </div>

            {/* Export Template */}
            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Download className="w-5 h-5 text-blue-600" />
                            <h4 className="font-semibold text-gray-900">Export Template Settings</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                            Export your current layout settings, colors, fonts, and spacing as a reusable template.
                            This includes only the styling configuration, not your personal data.
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="px-2 py-1 bg-gray-100 rounded">Current: {currentTemplate}</span>
                            <span>•</span>
                            <span>JSON format</span>
                        </div>
                    </div>
                    <button
                        onClick={onExportTemplate}
                        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                        Export
                    </button>
                </div>
            </div>

            {/* Export Resume Data */}
            <div className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <FileJson className="w-5 h-5 text-green-600" />
                            <h4 className="font-semibold text-gray-900">Export Complete Resume</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                            Export your entire resume including all content, sections, and settings.
                            Use this to backup your resume or transfer it to another device.
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="px-2 py-1 bg-gray-100 rounded">Full backup</span>
                            <span>•</span>
                            <span>JSON format</span>
                        </div>
                    </div>
                    <button
                        onClick={onExportResumeData}
                        className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                        Export
                    </button>
                </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">About Exported Files</p>
                        <ul className="list-disc list-inside space-y-1 text-blue-700">
                            <li>Template files contain only styling settings</li>
                            <li>Resume files contain all your personal data</li>
                            <li>Both can be imported back into the application</li>
                            <li>Files are in JSON format and can be shared</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Import Tab Component
 */
interface ImportTabProps {
    fileInputRef: React.RefObject<HTMLInputElement>;
    onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
    importResult: ImportValidationResult | null;
    importedTemplate: ExportedTemplate | null;
    onApply: () => void;
    onCancel: () => void;
}

const ImportTab: React.FC<ImportTabProps> = ({
    fileInputRef,
    onFileSelect,
    importResult,
    importedTemplate,
    onApply,
    onCancel,
}) => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Import Template</h3>
                <p className="text-sm text-gray-600 mb-6">
                    Upload a template JSON file to apply its settings to your resume.
                </p>
            </div>

            {/* File Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-4">
                    Drag and drop a JSON file here, or click to browse
                </p>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,application/json"
                    onChange={onFileSelect}
                    className="hidden"
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                    Select File
                </button>
            </div>

            {/* Validation Result */}
            {importResult && (
                <div className={`border rounded-lg p-4 ${importResult.isValid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}>
                    <div className="flex items-start gap-3">
                        {importResult.isValid ? (
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                            <p className={`font-medium mb-2 ${importResult.isValid ? 'text-green-800' : 'text-red-800'
                                }`}>
                                {importResult.isValid ? 'Template Valid' : 'Validation Failed'}
                            </p>

                            {/* Errors */}
                            {importResult.errors.length > 0 && (
                                <div className="mb-3">
                                    <p className="text-sm font-medium text-red-700 mb-1">Errors:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        {importResult.errors.map((error, index) => (
                                            <li key={index} className="text-sm text-red-600">{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Warnings */}
                            {importResult.warnings.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium text-yellow-700 mb-1">Warnings:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        {importResult.warnings.map((warning, index) => (
                                            <li key={index} className="text-sm text-yellow-600">{warning}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Template Preview */}
            {importedTemplate && importResult?.isValid && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h4 className="font-semibold text-gray-900 mb-3">Template Preview</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Name:</span>
                            <span className="font-medium text-gray-900">{importedTemplate.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Type:</span>
                            <span className="font-medium text-gray-900">{importedTemplate.templateType}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Version:</span>
                            <span className="font-medium text-gray-900">{importedTemplate.version}</span>
                        </div>
                        {importedTemplate.metadata.author && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Author:</span>
                                <span className="font-medium text-gray-900">{importedTemplate.metadata.author}</span>
                            </div>
                        )}
                        <div className="pt-2 border-t border-gray-300">
                            <p className="text-gray-600">{importedTemplate.description}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            {importedTemplate && importResult?.isValid && (
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onApply}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                        Apply Template
                    </button>
                </div>
            )}

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Import Guidelines</p>
                        <ul className="list-disc list-inside space-y-1 text-blue-700">
                            <li>Only JSON files are supported</li>
                            <li>Your current content will be preserved</li>
                            <li>Only styling settings will be updated</li>
                            <li>You can undo changes after applying</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateImportExport;
