import React, { useState, useCallback } from "react";
import { Button, Input, Select, Textarea } from "../UI";
import { useResumeContext } from "../../contexts/ResumeContext";
import { WorkExperience } from "../../types/resume.types";
import {
    validateExperience,
    hasValidationErrors,
    checkATSCompliance,
    ExperienceValidationErrors
} from "../../utils/experienceValidation";

/**
 * Experience Editor Component Props
 */
export interface ExperienceEditorProps {
    className?: string;
}

/**
 * Individual Experience Entry Props
 */
export interface ExperienceEntryProps {
    experience: WorkExperience;

    isEditing: boolean;
    onUpdate: (id: string, updates: Partial<WorkExperience>) => void;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    onToggleEdit: (id: string) => void;
    onMoveUp: (id: string) => void;
    onMoveDown: (id: string) => void;
}

/**
 * Bullet Point Manager Props
 */
export interface BulletPointManagerProps {
    bulletPoints: string[];
    onUpdate: (bulletPoints: string[]) => void;
    maxPoints?: number;
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
 * Generate year options (current year + 1 down to 1970)
 */
const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear + 1; year >= 1970; year--) {
        years.push({ value: year.toString(), label: year.toString() });
    }
    return years;
};

const YEAR_OPTIONS = generateYearOptions();

/**
 * Bullet Point Manager Component
 */
const BulletPointManager: React.FC<BulletPointManagerProps> = ({
    bulletPoints,
    onUpdate,
    maxPoints = 10,
}) => {
    const addBulletPoint = () => {
        if (bulletPoints.length < maxPoints) {
            onUpdate([...bulletPoints, ""]);
        }
    };

    const updateBulletPoint = (index: number, value: string) => {
        const updated = [...bulletPoints];
        updated[index] = value;
        onUpdate(updated);
    };

    const removeBulletPoint = (index: number) => {
        const updated = bulletPoints.filter((_, i) => i !== index);
        onUpdate(updated);
    };

    const moveBulletPoint = (index: number, direction: "up" | "down") => {
        if (
            (direction === "up" && index === 0) ||
            (direction === "down" && index === bulletPoints.length - 1)
        ) {
            return;
        }

        const updated = [...bulletPoints];
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
        onUpdate(updated);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h5 className="text-sm font-medium text-gray-700">Responsibilities & Achievements</h5>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addBulletPoint}
                    disabled={bulletPoints.length >= maxPoints}
                    leftIcon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    }
                >
                    Add Point
                </Button>
            </div>

            {bulletPoints.map((point, index) => (
                <div key={index} className="flex items-start space-x-2">
                    <div className="flex flex-col space-y-1 mt-2">
                        <button
                            type="button"
                            onClick={() => moveBulletPoint(index, "up")}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                            title="Move up"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => moveBulletPoint(index, "down")}
                            disabled={index === bulletPoints.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                            title="Move down"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1">
                        <Textarea
                            value={point}
                            onChange={(e) => updateBulletPoint(index, e.target.value)}
                            placeholder="Describe your responsibility or achievement..."
                            rows={2}
                            maxLength={200}
                            showCharCount
                            className="text-sm"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => removeBulletPoint(index)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md mt-1"
                        title="Remove bullet point"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            ))}

            {bulletPoints.length === 0 && (
                <div className="text-center py-4 text-gray-500 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                    No responsibilities added yet. Click "Add Point" to get started.
                </div>
            )}

            {bulletPoints.length >= maxPoints && (
                <p className="text-xs text-gray-500">
                    Maximum {maxPoints} bullet points reached.
                </p>
            )}
        </div>
    );
};

/**
 * Individual Experience Entry Component
 */
const ExperienceEntry: React.FC<ExperienceEntryProps> = ({
    experience,

    isEditing,
    onUpdate,
    onDelete,
    onDuplicate,
    onToggleEdit,
    onMoveUp,
    onMoveDown,
}) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [validationErrors, setValidationErrors] = useState<ExperienceValidationErrors>({});

    const handleFieldUpdate = (field: keyof WorkExperience, value: any) => {
        const updatedExperience = { ...experience, [field]: value };
        onUpdate(experience.id, { [field]: value });

        // Validate the updated experience
        const errors = validateExperience(updatedExperience);
        setValidationErrors(errors);
    };

    const handleDateUpdate = (field: "startDate" | "endDate", month: string, year: string) => {
        if (month && year) {
            handleFieldUpdate(field, `${year}-${month}`);
        }
    };

    const handleCurrentToggle = (current: boolean) => {
        handleFieldUpdate("current", current);
        if (current) {
            handleFieldUpdate("endDate", "");
        }
    };

    const parseDate = (dateString: string) => {
        if (!dateString) return { month: "", year: "" };
        const [year, month] = dateString.split("-");
        return { month: month || "", year: year || "" };
    };

    const startDate = parseDate(experience.startDate);
    const endDate = parseDate(experience.endDate);

    const handleDeleteConfirm = () => {
        onDelete(experience.id);
        setShowDeleteConfirm(false);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            {/* Entry Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                            {experience.jobTitle || "New Experience"}
                        </h4>
                        <p className="text-sm text-gray-500">
                            {experience.company && `${experience.company}${experience.location ? ` • ${experience.location}` : ""}`}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    {/* Validation and ATS Status */}
                    {isEditing && (
                        <>
                            {hasValidationErrors(validationErrors) ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    ⚠ Validation Issues
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    ✓ Valid
                                </span>
                            )}
                            {(() => {
                                const atsCheck = checkATSCompliance(experience);
                                return atsCheck.isCompliant ? (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        ✓ ATS-Friendly
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                        ⚠ ATS Issues
                                    </span>
                                );
                            })()}
                        </>
                    )}

                    {/* Move buttons */}
                    <button
                        type="button"
                        onClick={() => onMoveUp(experience.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                        title="Move up"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => onMoveDown(experience.id)}
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
                        onClick={() => onToggleEdit(experience.id)}
                    >
                        {isEditing ? "Save" : "Edit"}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDuplicate(experience.id)}
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
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Experience</h3>
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to delete this work experience? This action cannot be undone.
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
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Job Title"
                            value={experience.jobTitle}
                            onChange={(e) => handleFieldUpdate("jobTitle", e.target.value)}
                            error={validationErrors.jobTitle}
                            required
                            placeholder="e.g., Senior Software Engineer"
                        />
                        <Input
                            label="Company"
                            value={experience.company}
                            onChange={(e) => handleFieldUpdate("company", e.target.value)}
                            error={validationErrors.company}
                            required
                            placeholder="e.g., Tech Company Inc."
                        />
                    </div>

                    <Input
                        label="Location"
                        value={experience.location}
                        onChange={(e) => handleFieldUpdate("location", e.target.value)}
                        error={validationErrors.location}
                        placeholder="e.g., San Francisco, CA"
                    />

                    {/* Date Range */}
                    <div className="space-y-4">
                        <h5 className="text-sm font-medium text-gray-700">Employment Period</h5>
                        {validationErrors.dateRange && (
                            <p className="text-sm text-red-600">{validationErrors.dateRange}</p>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Select
                                label="Start Month"
                                options={MONTH_OPTIONS}
                                value={startDate.month}
                                onChange={(value) => handleDateUpdate("startDate", value, startDate.year)}
                                placeholder="Month"
                                required
                            />
                            <Select
                                label="Start Year"
                                options={YEAR_OPTIONS}
                                value={startDate.year}
                                onChange={(value) => handleDateUpdate("startDate", startDate.month, value)}
                                placeholder="Year"
                                required
                            />

                            {!experience.current && (
                                <>
                                    <Select
                                        label="End Month"
                                        options={MONTH_OPTIONS}
                                        value={endDate.month}
                                        onChange={(value) => handleDateUpdate("endDate", value, endDate.year)}
                                        placeholder="Month"
                                    />
                                    <Select
                                        label="End Year"
                                        options={YEAR_OPTIONS}
                                        value={endDate.year}
                                        onChange={(value) => handleDateUpdate("endDate", endDate.month, value)}
                                        placeholder="Year"
                                    />
                                </>
                            )}
                        </div>

                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={experience.current}
                                onChange={(e) => handleCurrentToggle(e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">I currently work here</span>
                        </label>
                    </div>

                    {/* Description */}
                    <Textarea
                        label="Job Description (Optional)"
                        value={experience.description}
                        onChange={(e) => handleFieldUpdate("description", e.target.value)}
                        error={validationErrors.description}
                        placeholder="Brief description of your role and responsibilities..."
                        rows={3}
                        maxLength={300}
                        showCharCount
                    />

                    {/* Bullet Points */}
                    <BulletPointManager
                        bulletPoints={experience.achievements}
                        onUpdate={(bulletPoints) => handleFieldUpdate("achievements", bulletPoints)}
                    />
                </div>
            )}

            {/* Summary View (when not editing) */}
            {!isEditing && (
                <div className="space-y-3 border-t border-gray-200 pt-4">
                    {experience.description && (
                        <p className="text-sm text-gray-600">{experience.description}</p>
                    )}

                    {experience.achievements.length > 0 && (
                        <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Key Achievements:</h5>
                            <ul className="space-y-1">
                                {experience.achievements.slice(0, 3).map((achievement, index) => (
                                    <li key={index} className="text-sm text-gray-600 flex items-start">
                                        <span className="text-blue-600 mr-2">•</span>
                                        <span>{achievement}</span>
                                    </li>
                                ))}
                                {experience.achievements.length > 3 && (
                                    <li className="text-sm text-gray-500 italic">
                                        +{experience.achievements.length - 3} more achievements
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}

                    <div className="text-xs text-gray-500">
                        {experience.startDate && (
                            <>
                                {new Date(experience.startDate + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                                {" - "}
                                {experience.current
                                    ? "Present"
                                    : experience.endDate
                                        ? new Date(experience.endDate + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" })
                                        : "Present"
                                }
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

/**
 * Work Experience Editor Component
 *
 * Provides comprehensive editing capabilities for work experience entries including:
 * - Add/remove/duplicate experience entries
 * - Reorder entries with move up/down buttons
 * - Comprehensive form fields with validation
 * - Bullet point management for achievements
 * - Collapsible entries for space efficiency
 * - Real-time auto-save integration
 */
export const ExperienceEditor: React.FC<ExperienceEditorProps> = ({
    className = "",
}) => {
    const { resume, dispatch } = useResumeContext();
    const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

    // Find the experience section
    const experienceSection = (resume.sections || []).find(
        (section) => section.type === "experience"
    );

    const experiences = experienceSection?.content
        ? (experienceSection.content as { experiences: WorkExperience[] }).experiences
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
            return (updatedExperiences: WorkExperience[]) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    if (experienceSection) {
                        dispatch({
                            type: "UPDATE_SECTION",
                            payload: {
                                id: experienceSection.id,
                                updates: {
                                    content: { experiences: updatedExperiences },
                                },
                            },
                        });
                    }
                }, 300);
            };
        })(),
        [dispatch, experienceSection]
    );

    /**
     * Add new experience entry
     */
    const addExperience = () => {
        const newExperience: WorkExperience = {
            id: generateId(),
            jobTitle: "",
            company: "",
            location: "",
            startDate: "",
            endDate: "",
            current: false,
            description: "",
            achievements: [],
        };

        const updatedExperiences = [...experiences, newExperience];
        debouncedUpdate(updatedExperiences);
        setEditingEntryId(newExperience.id);
    };

    /**
     * Update experience entry
     */
    const updateExperience = (id: string, updates: Partial<WorkExperience>) => {
        const updatedExperiences = experiences.map((exp) =>
            exp.id === id ? { ...exp, ...updates } : exp
        );
        debouncedUpdate(updatedExperiences);
    };

    /**
     * Delete experience entry
     */
    const deleteExperience = (id: string) => {
        const updatedExperiences = experiences.filter((exp) => exp.id !== id);
        debouncedUpdate(updatedExperiences);
        if (editingEntryId === id) {
            setEditingEntryId(null);
        }
    };

    /**
     * Duplicate experience entry
     */
    const duplicateExperience = (id: string) => {
        const experienceToDuplicate = experiences.find((exp) => exp.id === id);
        if (experienceToDuplicate) {
            const duplicatedExperience: WorkExperience = {
                ...experienceToDuplicate,
                id: generateId(),
                jobTitle: `${experienceToDuplicate.jobTitle} (Copy)`,
            };
            const updatedExperiences = [...experiences, duplicatedExperience];
            debouncedUpdate(updatedExperiences);
            setEditingEntryId(duplicatedExperience.id);
        }
    };

    /**
     * Toggle edit mode for entry
     */
    const toggleEditEntry = (id: string) => {
        setEditingEntryId(editingEntryId === id ? null : id);
    };

    /**
     * Move experience entry up
     */
    const moveExperienceUp = (id: string) => {
        const currentIndex = experiences.findIndex((exp) => exp.id === id);
        if (currentIndex > 0) {
            const updatedExperiences = [...experiences];
            [updatedExperiences[currentIndex - 1], updatedExperiences[currentIndex]] =
                [updatedExperiences[currentIndex], updatedExperiences[currentIndex - 1]];
            debouncedUpdate(updatedExperiences);
        }
    };

    /**
     * Move experience entry down
     */
    const moveExperienceDown = (id: string) => {
        const currentIndex = experiences.findIndex((exp) => exp.id === id);
        if (currentIndex < experiences.length - 1) {
            const updatedExperiences = [...experiences];
            [updatedExperiences[currentIndex], updatedExperiences[currentIndex + 1]] =
                [updatedExperiences[currentIndex + 1], updatedExperiences[currentIndex]];
            debouncedUpdate(updatedExperiences);
        }
    };
    // Don't render if no experience section exists
    if (!experienceSection) {
        return null;
    }

    return (
        <div className={className}>
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-500">
                        {experiences.length} {experiences.length === 1 ? "entry" : "entries"}
                    </p>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={addExperience}
                        leftIcon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        }
                    >
                        Add Experience
                    </Button>
                </div>

                {/* Experience Entries */}
                {experiences.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <svg
                            className="w-12 h-12 mx-auto mb-4 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
                            />
                        </svg>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">No work experience added</h4>
                        <p className="text-gray-500 mb-4">
                            Add your work experience to showcase your professional background.
                        </p>
                        <Button onClick={addExperience} leftIcon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        }>
                            Add Your First Experience
                        </Button>
                    </div>
                ) : (
                    experiences.map((experience) => (
                        <ExperienceEntry
                            key={experience.id}
                            experience={experience}
                            isEditing={editingEntryId === experience.id}
                            onUpdate={updateExperience}
                            onDelete={deleteExperience}
                            onDuplicate={duplicateExperience}
                            onToggleEdit={toggleEditEntry}
                            onMoveUp={moveExperienceUp}
                            onMoveDown={moveExperienceDown}
                        />
                    ))
                )}
            </div>
        </div >
    );
};

export default ExperienceEditor;