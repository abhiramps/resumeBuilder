import React, { useState, useCallback } from "react";
import { Button, Input, Select } from "../UI";
import { useResumeContext } from "../../contexts/ResumeContext";
import { Education } from "../../types/resume.types";

/**
 * Education Editor Component Props
 */
export interface EducationEditorProps {
    className?: string;
}

/**
 * Individual Education Entry Props
 */
export interface EducationEntryProps {
    education: Education;
    isEditing: boolean;
    onUpdate: (id: string, updates: Partial<Education>) => void;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    onToggleEdit: (id: string) => void;
    onMoveUp: (id: string) => void;
    onMoveDown: (id: string) => void;
}

/**
 * Coursework Manager Props
 */
export interface CourseworkManagerProps {
    coursework: string[];
    onUpdate: (coursework: string[]) => void;
    maxCourses?: number;
}

/**
 * Generate month options for date selects
 */
const MONTH_OPTIONS = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
];

/**
 * Generate year options (current year + 10 down to 1970)
 */
const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear + 10; year >= 1970; year--) {
        years.push({ value: year.toString(), label: year.toString() });
    }
    return years;
};

const YEAR_OPTIONS = generateYearOptions();

/**
 * Common degree suggestions
 */
const DEGREE_SUGGESTIONS = [
    "Bachelor of Science in Computer Science",
    "Bachelor of Engineering in Software Engineering",
    "Master of Science in Computer Science",
    "Master of Business Administration (MBA)",
    "Bachelor of Arts in Computer Science",
    "Associate Degree in Computer Science",
    "Ph.D. in Computer Science",
];

/**
 * Coursework Manager Component
 */
const CourseworkManager: React.FC<CourseworkManagerProps> = ({
    coursework,
    onUpdate,
    maxCourses = 10,
}) => {
    const [inputValue, setInputValue] = useState("");

    const addCourse = () => {
        if (inputValue.trim() && coursework.length < maxCourses) {
            onUpdate([...coursework, inputValue.trim()]);
            setInputValue("");
        }
    };

    const removeCourse = (index: number) => {
        const updated = coursework.filter((_, i) => i !== index);
        onUpdate(updated);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addCourse();
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h5 className="text-sm font-medium text-gray-700">Relevant Coursework</h5>
            </div>

            <div className="flex items-center space-x-2">
                <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter course name and press Enter..."
                    disabled={coursework.length >= maxCourses}
                    className="flex-1"
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addCourse}
                    disabled={!inputValue.trim() || coursework.length >= maxCourses}
                >
                    Add
                </Button>
            </div>

            {coursework.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {coursework.map((course, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                            {course}
                            <button
                                type="button"
                                onClick={() => removeCourse(index)}
                                className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {coursework.length >= maxCourses && (
                <p className="text-xs text-gray-500">
                    Maximum {maxCourses} courses reached.
                </p>
            )}
        </div>
    );
};

/**
 * Individual Education Entry Component
 */
const EducationEntry: React.FC<EducationEntryProps> = ({
    education,
    isEditing,
    onUpdate,
    onDelete,
    onDuplicate,
    onToggleEdit,
    onMoveUp,
    onMoveDown,
}) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleFieldUpdate = (field: keyof Education, value: any) => {
        onUpdate(education.id, { [field]: value });
    };

    const handleDateUpdate = (field: "startDate" | "endDate", month: string, year: string) => {
        if (month && year) {
            handleFieldUpdate(field, `${year}-${month}`);
        }
    };

    const parseDate = (dateString: string) => {
        if (!dateString) return { month: "", year: "" };
        const [year, month] = dateString.split("-");
        return { month: month || "", year: year || "" };
    };

    const startDate = parseDate(education.startDate);
    const endDate = parseDate(education.endDate);

    const handleDeleteConfirm = () => {
        onDelete(education.id);
        setShowDeleteConfirm(false);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            {/* Entry Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                            {education.degree || "New Education"}
                        </h4>
                        <p className="text-sm text-gray-500">
                            {education.institution && `${education.institution}${education.location ? ` • ${education.location}` : ""}`}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    {/* Move buttons */}
                    <button
                        type="button"
                        onClick={() => onMoveUp(education.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                        title="Move up"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => onMoveDown(education.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                        title="Move down"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Action buttons */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleEdit(education.id)}
                    >
                        {isEditing ? "Save" : "Edit"}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDuplicate(education.id)}
                        title="Duplicate entry"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Delete entry"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </Button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Education</h3>
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to delete this education entry? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <Button
                                variant="secondary"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                onClick={handleDeleteConfirm}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Entry Form */}
            {isEditing && (
                <div className="space-y-4 border-t border-gray-200 pt-4">
                    {/* Degree with suggestions */}
                    <div>
                        <Input
                            label="Degree/Certification"
                            value={education.degree}
                            onChange={(e) => handleFieldUpdate("degree", e.target.value)}
                            required
                            placeholder="e.g., Bachelor of Science in Computer Science"
                            list="degree-suggestions"
                        />
                        <datalist id="degree-suggestions">
                            {DEGREE_SUGGESTIONS.map((degree, index) => (
                                <option key={index} value={degree} />
                            ))}
                        </datalist>
                    </div>

                    {/* Institution and Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="University/Institution"
                            value={education.institution}
                            onChange={(e) => handleFieldUpdate("institution", e.target.value)}
                            required
                            placeholder="e.g., Stanford University"
                        />
                        <Input
                            label="Location"
                            value={education.location}
                            onChange={(e) => handleFieldUpdate("location", e.target.value)}
                            placeholder="e.g., Stanford, CA"
                        />
                    </div>

                    {/* Date Range */}
                    <div className="space-y-4">
                        <h5 className="text-sm font-medium text-gray-700">Study Period</h5>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Select
                                label="Start Month"
                                options={MONTH_OPTIONS}
                                value={startDate.month}
                                onChange={(value) => handleDateUpdate("startDate", value, startDate.year)}
                                placeholder="Month"
                            />
                            <Select
                                label="Start Year"
                                options={YEAR_OPTIONS}
                                value={startDate.year}
                                onChange={(value) => handleDateUpdate("startDate", startDate.month, value)}
                                placeholder="Year"
                            />

                            <Select
                                label="End Month"
                                options={MONTH_OPTIONS}
                                value={endDate.month}
                                onChange={(value) => handleDateUpdate("endDate", value, endDate.year)}
                                placeholder="Month"
                            />
                            <Select
                                label="End Year (or Expected)"
                                options={YEAR_OPTIONS}
                                value={endDate.year}
                                onChange={(value) => handleDateUpdate("endDate", endDate.month, value)}
                                placeholder="Year"
                            />
                        </div>
                    </div>

                    {/* GPA */}
                    <Input
                        label="GPA (Optional)"
                        value={education.gpa || ""}
                        onChange={(e) => handleFieldUpdate("gpa", e.target.value)}
                        placeholder="e.g., 3.8/4.0"
                        maxLength={10}
                    />

                    {/* Coursework */}
                    <CourseworkManager
                        coursework={education.coursework || []}
                        onUpdate={(coursework) => handleFieldUpdate("coursework", coursework)}
                    />
                </div>
            )}

            {/* Summary View (when not editing) */}
            {!isEditing && (
                <div className="space-y-3 border-t border-gray-200 pt-4">
                    {education.gpa && (
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">GPA:</span> {education.gpa}
                        </p>
                    )}

                    {education.coursework && education.coursework.length > 0 && (
                        <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Relevant Coursework:</h5>
                            <div className="flex flex-wrap gap-2">
                                {education.coursework.map((course, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                                    >
                                        {course}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="text-xs text-gray-500">
                        {education.startDate && education.endDate && (
                            <>
                                {new Date(education.startDate + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                                {" - "}
                                {new Date(education.endDate + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

/**
 * Education Editor Component
 *
 * Provides comprehensive editing capabilities for education entries including:
 * - Add/remove/duplicate education entries
 * - Reorder entries with move up/down buttons
 * - Comprehensive form fields
 * - Coursework tag management
 * - GPA field
 * - Collapsible entries for space efficiency
 * - Real-time auto-save integration
 */
export const EducationEditor: React.FC<EducationEditorProps> = ({
    className = "",
}) => {
    const { resume, dispatch } = useResumeContext();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

    // Find the education section
    const educationSection = (resume.sections || []).find(
        (section) => section.type === "education"
    );

    const educationEntries = educationSection?.content
        ? (educationSection.content as { education: Education[] }).education
        : [];

    /**
     * Generate unique ID for new entries
     */
    const generateId = (): string => {
        return Math.random().toString(36).substr(2, 9);
    };

    /**
     * Debounced update function
     */
    const debouncedUpdate = useCallback(
        (() => {
            let timeoutId: ReturnType<typeof setTimeout>;
            return (updatedEducation: Education[]) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    if (educationSection) {
                        dispatch({
                            type: "UPDATE_SECTION",
                            payload: {
                                id: educationSection.id,
                                updates: {
                                    content: { education: updatedEducation },
                                },
                            },
                        });
                    }
                }, 300);
            };
        })(),
        [dispatch, educationSection]
    );

    /**
     * Add new education entry
     */
    const addEducation = () => {
        const newEducation: Education = {
            id: generateId(),
            degree: "",
            institution: "",
            location: "",
            startDate: "",
            endDate: "",
            gpa: "",
            coursework: [],
        };

        const updatedEducation = [...educationEntries, newEducation];
        debouncedUpdate(updatedEducation);
        setEditingEntryId(newEducation.id);
    };

    /**
     * Update education entry
     */
    const updateEducation = (id: string, updates: Partial<Education>) => {
        const updatedEducation = educationEntries.map((edu) =>
            edu.id === id ? { ...edu, ...updates } : edu
        );
        debouncedUpdate(updatedEducation);
    };

    /**
     * Delete education entry
     */
    const deleteEducation = (id: string) => {
        const updatedEducation = educationEntries.filter((edu) => edu.id !== id);
        debouncedUpdate(updatedEducation);
        if (editingEntryId === id) {
            setEditingEntryId(null);
        }
    };

    /**
     * Duplicate education entry
     */
    const duplicateEducation = (id: string) => {
        const educationToDuplicate = educationEntries.find((edu) => edu.id === id);
        if (educationToDuplicate) {
            const duplicatedEducation: Education = {
                ...educationToDuplicate,
                id: generateId(),
                degree: `${educationToDuplicate.degree} (Copy)`,
            };
            const updatedEducation = [...educationEntries, duplicatedEducation];
            debouncedUpdate(updatedEducation);
            setEditingEntryId(duplicatedEducation.id);
        }
    };

    /**
     * Toggle edit mode for entry
     */
    const toggleEditEntry = (id: string) => {
        setEditingEntryId(editingEntryId === id ? null : id);
    };

    /**
     * Move education entry up
     */
    const moveEducationUp = (id: string) => {
        const currentIndex = educationEntries.findIndex((edu) => edu.id === id);
        if (currentIndex > 0) {
            const updatedEducation = [...educationEntries];
            [updatedEducation[currentIndex - 1], updatedEducation[currentIndex]] =
                [updatedEducation[currentIndex], updatedEducation[currentIndex - 1]];
            debouncedUpdate(updatedEducation);
        }
    };

    /**
     * Move education entry down
     */
    const moveEducationDown = (id: string) => {
        const currentIndex = educationEntries.findIndex((edu) => edu.id === id);
        if (currentIndex < educationEntries.length - 1) {
            const updatedEducation = [...educationEntries];
            [updatedEducation[currentIndex], updatedEducation[currentIndex + 1]] =
                [updatedEducation[currentIndex + 1], updatedEducation[currentIndex]];
            debouncedUpdate(updatedEducation);
        }
    };

    /**
     * Collapse/expand icon
     */
    const CollapseIcon = () => (
        <svg
            className={`w-5 h-5 transition-transform duration-200 ${isCollapsed ? "rotate-180" : ""
                }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
            />
        </svg>
    );

    // Don't render if no education section exists
    if (!educationSection) {
        return null;
    }

    return (
        <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
            {/* Header */}
            <div
                className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg
                            className="w-5 h-5 text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                        <p className="text-sm text-gray-500">
                            {educationEntries.length} {educationEntries.length === 1 ? "entry" : "entries"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            addEducation();
                        }}
                        leftIcon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        }
                    >
                        Add Education
                    </Button>
                    <button
                        type="button"
                        className="p-2 text-gray-400 hover:text-gray-600"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsCollapsed(!isCollapsed);
                        }}
                    >
                        <CollapseIcon />
                    </button>
                </div>
            </div>

            {/* Content */}
            {!isCollapsed && (
                <div className="p-4 space-y-4">
                    {educationEntries.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <svg
                                className="w-16 h-16 mx-auto mb-4 text-gray-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            </svg>
                            <p className="text-lg font-medium mb-2">No education entries yet</p>
                            <p className="text-sm mb-4">Add your educational background to get started</p>
                            <Button variant="primary" onClick={addEducation}>
                                Add Your First Education
                            </Button>
                        </div>
                    ) : (
                        educationEntries.map((education) => (
                            <EducationEntry
                                key={education.id}
                                education={education}
                                isEditing={editingEntryId === education.id}
                                onUpdate={updateEducation}
                                onDelete={deleteEducation}
                                onDuplicate={duplicateEducation}
                                onToggleEdit={toggleEditEntry}
                                onMoveUp={moveEducationUp}
                                onMoveDown={moveEducationDown}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};
