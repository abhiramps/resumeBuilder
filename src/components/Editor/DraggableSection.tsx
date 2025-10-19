import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff, Trash2 } from 'lucide-react';
import { ResumeSection } from '../../types/resume.types';

interface DraggableSectionProps {
    section: ResumeSection;
    children: React.ReactNode;
    onToggle: () => void;
    onDelete: () => void;
    isDragging?: boolean;
}

export const DraggableSection: React.FC<DraggableSectionProps> = ({
    section,
    children,
    onToggle,
    onDelete,
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: section.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-white rounded-lg border ${isDragging ? 'border-blue-500 shadow-lg' : 'border-gray-200'
                } mb-4 overflow-hidden`}
        >
            {/* Section Header with Drag Handle */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
                {/* Drag Handle */}
                <button
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded transition-colors"
                    aria-label="Drag to reorder section"
                >
                    <GripVertical className="w-5 h-5 text-gray-400" />
                </button>

                {/* Section Title */}
                <h3 className="flex-1 font-semibold text-gray-900">{section.title}</h3>

                {/* Action Buttons */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={onToggle}
                        className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                        aria-label={section.enabled ? 'Hide section' : 'Show section'}
                        title={section.enabled ? 'Hide section' : 'Show section'}
                    >
                        {section.enabled ? (
                            <Eye className="w-4 h-4 text-gray-600" />
                        ) : (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                    </button>

                    <button
                        onClick={onDelete}
                        className="p-1.5 hover:bg-red-100 rounded transition-colors"
                        aria-label="Delete section"
                        title="Delete section"
                    >
                        <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                </div>
            </div>

            {/* Section Content */}
            <div className={`p-4 ${!section.enabled ? 'opacity-50' : ''}`}>
                {children}
            </div>
        </div>
    );
};
