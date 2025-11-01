import React, { useRef, useState } from 'react';
import { Download, Upload, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { useResumeContext } from '../../contexts/ResumeContext';
import { downloadResumeJSON, importResumeFromFile } from '../../utils/jsonExporter';
import { createDefaultResume } from '../../constants/defaultResume';

export const DataManagement: React.FC = () => {
    const { resume, dispatch } = useResumeContext();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const handleExport = () => {
        try {
            downloadResumeJSON(resume);
            showMessage('success', 'Resume exported successfully!');
        } catch (error) {
            showMessage('error', 'Failed to export resume');
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const result = await importResumeFromFile(file);

            if (result.success && result.resume) {
                dispatch({ type: 'SET_RESUME', payload: result.resume });
                showMessage('success', 'Resume imported successfully!');
            } else {
                showMessage('error', result.error || 'Failed to import resume');
            }
        } catch (error) {
            showMessage('error', 'Failed to read file');
        }

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleReset = () => {
        setShowResetConfirm(true);
    };

    const confirmReset = () => {
        const defaultResume = createDefaultResume();
        dispatch({ type: 'SET_RESUME', payload: defaultResume });
        setShowResetConfirm(false);
        showMessage('success', 'Resume reset to default');
    };

    const cancelReset = () => {
        setShowResetConfirm(false);
    };

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 3000);
    };

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">Data Management</h3>

            {/* Message Display */}
            {message && (
                <div
                    className={`flex items-center gap-2 p-3 rounded-lg text-sm ${message.type === 'success'
                            ? 'bg-green-50 text-green-800 border border-green-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                >
                    {message.type === 'success' ? (
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    ) : (
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    )}
                    <span>{message.text}</span>
                </div>
            )}

            {/* Export Button */}
            <button
                onClick={handleExport}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                <Download className="w-4 h-4" />
                <span>Export as JSON</span>
            </button>

            {/* Import Button */}
            <button
                onClick={handleImportClick}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
                <Upload className="w-4 h-4" />
                <span>Import from JSON</span>
            </button>
            <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
            />

            {/* Reset Button */}
            {!showResetConfirm ? (
                <button
                    onClick={handleReset}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                    <span>Reset Resume</span>
                </button>
            ) : (
                <div className="space-y-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800 font-medium">
                        Are you sure? This will delete all your data.
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={confirmReset}
                            className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                        >
                            Yes, Reset
                        </button>
                        <button
                            onClick={cancelReset}
                            className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Info Text */}
            <div className="text-xs text-gray-500 space-y-1 pt-2 border-t">
                <p>• Export: Download your resume data as JSON</p>
                <p>• Import: Load resume from a JSON file</p>
                <p>• Reset: Clear all data and start fresh</p>
            </div>
        </div>
    );
};
