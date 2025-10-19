import React from 'react';
import { ResumeSection } from '../../types/resume.types';
import { useResumeContext } from '../../contexts/ResumeContext';

interface CustomSectionEditorProps {
    section: ResumeSection;
}

export const CustomSectionEditor: React.FC<CustomSectionEditorProps> = ({ section }) => {
    const { dispatch } = useResumeContext();

    if (section.type !== 'custom') return null;

    const customContent = (section.content as any).custom;
    const title = customContent?.title || '';
    const content = customContent?.content || '';

    const handleTitleChange = (newTitle: string) => {
        dispatch({
            type: 'UPDATE_CUSTOM_SECTION',
            payload: {
                sectionId: section.id,
                title: newTitle,
                content: content,
            },
        });
    };

    const handleContentChange = (newContent: string) => {
        dispatch({
            type: 'UPDATE_CUSTOM_SECTION',
            payload: {
                sectionId: section.id,
                title: title,
                content: newContent,
            },
        });
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Section Title
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter section title"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                </label>
                <textarea
                    value={content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Enter section content..."
                />
                <p className="text-xs text-gray-500 mt-1">
                    Use line breaks to separate items. Keep formatting simple for ATS compatibility.
                </p>
            </div>
        </div>
    );
};
