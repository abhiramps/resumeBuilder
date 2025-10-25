import React, { useState } from 'react';
import { X } from 'lucide-react';

export interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExport: (options: ExportOptions) => void;
    defaultFileName: string;
}

export interface ExportOptions {
    fileName: string;
    paperSize: 'letter' | 'a4';
    quality: 'standard' | 'high';
}

export const ExportModal: React.FC<ExportModalProps> = ({
    isOpen,
    onClose,
    onExport,
    defaultFileName,
}) => {
    const [fileName, setFileName] = useState(defaultFileName);
    const [paperSize, setPaperSize] = useState<'letter' | 'a4'>('letter');
    const [quality, setQuality] = useState<'standard' | 'high'>('high');

    if (!isOpen) return null;

    const handleExport = () => {
        onExport({ fileName, paperSize, quality });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Export PDF</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    {/* File Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            File Name
                        </label>
                        <input
                            type="text"
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Resume_2024"
                        />
                    </div>

                    {/* Paper Size */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Paper Size
                        </label>
                        <div className="flex space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="letter"
                                    checked={paperSize === 'letter'}
                                    onChange={(e) => setPaperSize(e.target.value as 'letter')}
                                    className="mr-2"
                                />
                                <span className="text-sm">Letter (8.5" × 11")</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="a4"
                                    checked={paperSize === 'a4'}
                                    onChange={(e) => setPaperSize(e.target.value as 'a4')}
                                    className="mr-2"
                                />
                                <span className="text-sm">A4</span>
                            </label>
                        </div>
                    </div>

                    {/* Quality */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quality
                        </label>
                        <select
                            value={quality}
                            onChange={(e) => setQuality(e.target.value as 'standard' | 'high')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="standard">Standard</option>
                            <option value="high">High (Recommended)</option>
                        </select>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleExport}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-700 transition-colors"
                    >
                        Export PDF
                    </button>
                </div>
            </div>
        </div>
    );
};
