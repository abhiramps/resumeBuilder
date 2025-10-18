import React, { useState, useCallback } from "react";
import { Button, Input } from "../UI";
import { useResumeContext } from "../../contexts/ResumeContext";
import { Skill, SkillCategory } from "../../types/resume.types";
import {
    validateSkillCategory,
    hasValidationErrors,
    checkSkillsATSCompliance,
    SkillsValidationErrors,
    SKILL_SUGGESTIONS,
    filterSkillSuggestions,
    validateSkillName,
    generateId,
    parseSkillsInput,
    getPopularSkillsForCategory,
    CATEGORY_TEMPLATES,
    DEFAULT_SKILL_CATEGORIES,
    convertSkillsToCategories
} from "../../utils/skillsValidation";

/**
 * Skills Editor Component Props
 */
export interface SkillsEditorProps {
    className?: string;
}

/**
 * Individual Skill Category Props
 */
export interface SkillCategoryComponentProps {
    category: SkillCategory;
    categoryIndex: number;
    isEditing: boolean;
    onUpdate: (index: number, updates: Partial<SkillCategory>) => void;
    onDelete: (index: number) => void;
    onDuplicate: (index: number) => void;
    onToggleEdit: (index: number) => void;
    onMoveUp: (index: number) => void;
    onMoveDown: (index: number) => void;
}

/**
 * Skill Tag Input Props
 */
export interface SkillTagInputProps {
    skills: Skill[];
    categoryName: string;
    onSkillsUpdate: (skills: Skill[]) => void;
    maxSkills?: number;
    allowLevels?: boolean;
}

/**
 * Skill level options
 */
const SKILL_LEVELS = [
    { value: "beginner", label: "Beginner", color: "bg-gray-100 text-gray-800" },
    { value: "intermediate", label: "Intermediate", color: "bg-blue-100 text-blue-800" },
    { value: "advanced", label: "Advanced", color: "bg-green-100 text-green-800" },
    { value: "expert", label: "Expert", color: "bg-purple-100 text-purple-800" },
];

/**
 * Skill Tag Input Component
 */
const SkillTagInput: React.FC<SkillTagInputProps> = ({
    skills,
    categoryName,
    onSkillsUpdate,
    maxSkills = 20,
    allowLevels = true,
}) => {
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showBulkInput, setShowBulkInput] = useState(false);
    const [bulkInput, setBulkInput] = useState("");

    const handleInputChange = (value: string) => {
        setInputValue(value);
        if (value.trim()) {
            const existingSkillNames = skills.map(skill => skill.name);
            const filtered = filterSkillSuggestions(value, categoryName, existingSkillNames);
            setSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const addSkill = (skillName: string, level: Skill["level"] = "intermediate") => {
        const trimmedName = skillName.trim();
        if (trimmedName && !skills.some(skill => skill.name.toLowerCase() === trimmedName.toLowerCase())) {
            const newSkill: Skill = {
                id: generateId(),
                name: trimmedName,
                category: "other", // Will be updated by parent
                level: level,
            };
            onSkillsUpdate([...skills, newSkill]);
        }
        setInputValue("");
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const removeSkill = (skillId: string) => {
        const updatedSkills = skills.filter(skill => skill.id !== skillId);
        onSkillsUpdate(updatedSkills);
    };

    const updateSkillLevel = (skillId: string, level: Skill["level"]) => {
        const updatedSkills = skills.map(skill =>
            skill.id === skillId ? { ...skill, level } : skill
        );
        onSkillsUpdate(updatedSkills);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            if (inputValue.trim()) {
                addSkill(inputValue);
            }
        } else if (e.key === "Backspace" && !inputValue && skills.length > 0) {
            removeSkill(skills[skills.length - 1].id);
        }
    };

    const handleBulkAdd = () => {
        const skillNames = parseSkillsInput(bulkInput);
        const existingNames = skills.map(skill => skill.name.toLowerCase());

        const newSkills = skillNames
            .filter(name => !existingNames.includes(name.toLowerCase()))
            .map(name => ({
                id: generateId(),
                name,
                category: "other" as const,
                level: "intermediate" as const,
            }));

        if (newSkills.length > 0) {
            onSkillsUpdate([...skills, ...newSkills]);
        }

        setBulkInput("");
        setShowBulkInput(false);
    };

    const popularSkills = getPopularSkillsForCategory(categoryName);

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h5 className="text-sm font-medium text-gray-700">Skills</h5>
                <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                        {skills.length}/{maxSkills} skills
                    </span>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowBulkInput(!showBulkInput)}
                        className="text-xs"
                    >
                        Bulk Add
                    </Button>
                </div>
            </div>

            {/* Bulk Input */}
            {showBulkInput && (
                <div className="p-3 bg-gray-50 rounded-lg space-y-3">
                    <Input
                        label="Add Multiple Skills"
                        value={bulkInput}
                        onChange={(e) => setBulkInput(e.target.value)}
                        placeholder="Enter skills separated by commas (e.g., React, Node.js, Python)"
                        helperText="Separate skills with commas"
                    />
                    <div className="flex justify-end space-x-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowBulkInput(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleBulkAdd}
                            disabled={!bulkInput.trim()}
                        >
                            Add Skills
                        </Button>
                    </div>
                </div>
            )}

            {/* Skill Tags */}
            <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-md min-h-[42px] bg-white">
                {skills.map((skill) => {
                    const levelInfo = SKILL_LEVELS.find(l => l.value === skill.level) || SKILL_LEVELS[1];
                    return (
                        <div
                            key={skill.id}
                            className={`inline-flex items-center px-2 py-1 rounded-md text-sm ${levelInfo.color} group`}
                        >
                            <span>{skill.name}</span>
                            {allowLevels && (
                                <select
                                    value={skill.level}
                                    onChange={(e) => updateSkillLevel(skill.id, e.target.value as Skill["level"])}
                                    className="ml-2 text-xs bg-transparent border-none outline-none cursor-pointer"
                                    title="Skill level"
                                >
                                    {SKILL_LEVELS.map(level => (
                                        <option key={level.value} value={level.value}>
                                            {level.label}
                                        </option>
                                    ))}
                                </select>
                            )}
                            <button
                                type="button"
                                onClick={() => removeSkill(skill.id)}
                                className="ml-2 text-current hover:text-red-600 opacity-70 group-hover:opacity-100"
                                title="Remove skill"
                            >
                                ×
                            </button>
                        </div>
                    );
                })}

                {skills.length < maxSkills && (
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => {
                            if (inputValue.trim()) {
                                const existingSkillNames = skills.map(skill => skill.name);
                                const filtered = filterSkillSuggestions(inputValue, categoryName, existingSkillNames);
                                setSuggestions(filtered);
                                setShowSuggestions(filtered.length > 0);
                            }
                        }}
                        onBlur={() => {
                            // Delay hiding suggestions to allow clicking
                            setTimeout(() => setShowSuggestions(false), 200);
                        }}
                        placeholder={skills.length === 0 ? "Add skills (e.g., React, Python, AWS)" : "Add more..."}
                        className="flex-1 min-w-[120px] outline-none bg-transparent text-sm"
                    />
                )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="relative">
                    <div className="absolute top-0 left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => addSkill(suggestion)}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Popular Skills */}
            {popularSkills.length > 0 && skills.length === 0 && (
                <div className="text-xs">
                    <span className="text-gray-600 font-medium">Popular {categoryName} skills:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                        {popularSkills.map((skill) => (
                            <button
                                key={skill}
                                type="button"
                                onClick={() => addSkill(skill)}
                                disabled={skills.some(s => s.name.toLowerCase() === skill.toLowerCase()) || skills.length >= maxSkills}
                                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {skill}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {skills.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-2">
                    No skills added yet. Start typing to add skills or use popular suggestions above.
                </p>
            )}

            {skills.length >= maxSkills && (
                <p className="text-xs text-orange-600">
                    Maximum {maxSkills} skills reached. Remove some to add more.
                </p>
            )}
        </div>
    );
};

/**
 * Individual Skill Category Component
 */
const SkillCategoryComponent: React.FC<SkillCategoryComponentProps> = ({
    category,
    categoryIndex,
    isEditing,
    onUpdate,
    onDelete,
    onDuplicate,
    onToggleEdit,
    onMoveUp,
    onMoveDown,
}) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [validationErrors, setValidationErrors] = useState<SkillsValidationErrors[string]>({});

    const handleCategoryUpdate = (field: keyof SkillCategory, value: any) => {
        const updatedCategory = { ...category, [field]: value };
        onUpdate(categoryIndex, { [field]: value });

        // Validate the updated category
        const errors = validateSkillCategory(updatedCategory);
        setValidationErrors(errors);
    };

    const handleSkillsUpdate = (skills: Skill[]) => {
        handleCategoryUpdate("skills", skills);
    };

    const handleDeleteConfirm = () => {
        onDelete(categoryIndex);
        setShowDeleteConfirm(false);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            {/* Category Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                            {category.categoryName || "New Category"}
                        </h4>
                        <p className="text-sm text-gray-500">
                            {category.skills.length} {category.skills.length === 1 ? "skill" : "skills"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    {/* Validation Status */}
                    {isEditing && (
                        <>
                            {hasValidationErrors(validationErrors) ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    ⚠ Issues
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    ✓ Valid
                                </span>
                            )}
                        </>
                    )}

                    {/* Move buttons */}
                    <button
                        type="button"
                        onClick={() => onMoveUp(categoryIndex)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                        title="Move up"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => onMoveDown(categoryIndex)}
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
                        onClick={() => onToggleEdit(categoryIndex)}
                    >
                        {isEditing ? "Save" : "Edit"}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDuplicate(categoryIndex)}
                        title="Duplicate category"
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
                        title="Delete category"
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
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Category</h3>
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to delete this skill category and all its skills? This action cannot be undone.
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

            {/* Category Form */}
            {isEditing && (
                <div className="space-y-4 border-t border-gray-200 pt-4">
                    <Input
                        label="Category Name"
                        value={category.categoryName}
                        onChange={(e) => handleCategoryUpdate("categoryName", e.target.value)}
                        error={validationErrors.categoryName}
                        required
                        placeholder="e.g., Programming Languages"
                    />

                    <SkillTagInput
                        skills={category.skills}
                        categoryName={category.categoryName}
                        onSkillsUpdate={handleSkillsUpdate}
                    />

                    {validationErrors.general && (
                        <p className="text-sm text-red-600">{validationErrors.general}</p>
                    )}
                </div>
            )}

            {/* Summary View (when not editing) */}
            {!isEditing && (
                <div className="space-y-3 border-t border-gray-200 pt-4">
                    {category.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {category.skills.map((skill) => {
                                const levelInfo = SKILL_LEVELS.find(l => l.value === skill.level) || SKILL_LEVELS[1];
                                return (
                                    <span
                                        key={skill.id}
                                        className={`inline-flex items-center px-2 py-1 rounded-md text-sm ${levelInfo.color}`}
                                        title={`${skill.name} - ${levelInfo.label}`}
                                    >
                                        {skill.name}
                                    </span>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic">No skills added to this category yet.</p>
                    )}
                </div>
            )}
        </div>
    );
};

/**
 * Technical Skills Editor Component
 *
 * Provides comprehensive editing capabilities for technical skills including:
 * - Category-based skill organization
 * - Tag-based skill input with suggestions
 * - Skill level indicators
 * - Category templates for quick setup
 * - Bulk skill input functionality
 * - Real-time validation and ATS compliance
 */
export const SkillsEditor: React.FC<SkillsEditorProps> = ({
    className = "",
}) => {
    const { resume, dispatch } = useResumeContext();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null);
    const [showTemplates, setShowTemplates] = useState(false);

    // Find the skills section
    const skillsSection = (resume.sections || []).find(
        (section) => section.type === "skills"
    );

    // Convert flat skills array to categorized structure
    const flatSkills = skillsSection?.content
        ? (skillsSection.content as { skills: Skill[] }).skills
        : [];

    const [skillCategories, setSkillCategories] = useState<SkillCategory[]>(() => {
        if (flatSkills.length > 0) {
            return convertSkillsToCategories(flatSkills);
        }
        return [];
    });

    /**
     * Debounced update function
     */
    const debouncedUpdate = useCallback(
        (() => {
            let timeoutId: ReturnType<typeof setTimeout>;
            return (updatedCategories: SkillCategory[]) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    // Convert categories back to flat skills array
                    const flatSkills: Skill[] = [];
                    updatedCategories.forEach(category => {
                        category.skills.forEach(skill => {
                            flatSkills.push({
                                ...skill,
                                category: skill.category // Keep original category for compatibility
                            });
                        });
                    });

                    if (skillsSection) {
                        dispatch({
                            type: "UPDATE_SECTION",
                            payload: {
                                id: skillsSection.id,
                                updates: {
                                    content: { skills: flatSkills },
                                },
                            },
                        });
                    }
                }, 300);
            };
        })(),
        [dispatch, skillsSection]
    );

    /**
     * Update skill categories and sync with context
     */
    const updateSkillCategories = (updatedCategories: SkillCategory[]) => {
        setSkillCategories(updatedCategories);
        debouncedUpdate(updatedCategories);
    };

    /**
     * Add new skill category
     */
    const addCategory = () => {
        const newCategory: SkillCategory = {
            categoryName: "",
            skills: [],
        };

        const updatedCategories = [...skillCategories, newCategory];
        updateSkillCategories(updatedCategories);
        setEditingCategoryIndex(updatedCategories.length - 1);
    };

    /**
     * Update skill category
     */
    const updateCategory = (index: number, updates: Partial<SkillCategory>) => {
        const updatedCategories = skillCategories.map((category, i) =>
            i === index ? { ...category, ...updates } : category
        );
        updateSkillCategories(updatedCategories);
    };

    /**
     * Delete skill category
     */
    const deleteCategory = (index: number) => {
        const updatedCategories = skillCategories.filter((_, i) => i !== index);
        updateSkillCategories(updatedCategories);
        if (editingCategoryIndex === index) {
            setEditingCategoryIndex(null);
        }
    };

    /**
     * Duplicate skill category
     */
    const duplicateCategory = (index: number) => {
        const categoryToDuplicate = skillCategories[index];
        if (categoryToDuplicate) {
            const duplicatedCategory: SkillCategory = {
                ...categoryToDuplicate,
                categoryName: `${categoryToDuplicate.categoryName} (Copy)`,
                skills: categoryToDuplicate.skills.map(skill => ({
                    ...skill,
                    id: generateId(),
                })),
            };
            const updatedCategories = [...skillCategories, duplicatedCategory];
            updateSkillCategories(updatedCategories);
            setEditingCategoryIndex(updatedCategories.length - 1);
        }
    };

    /**
     * Toggle edit mode for category
     */
    const toggleEditCategory = (index: number) => {
        setEditingCategoryIndex(editingCategoryIndex === index ? null : index);
    };

    /**
     * Move category up
     */
    const moveCategoryUp = (index: number) => {
        if (index > 0) {
            const updatedCategories = [...skillCategories];
            [updatedCategories[index - 1], updatedCategories[index]] =
                [updatedCategories[index], updatedCategories[index - 1]];
            updateSkillCategories(updatedCategories);
        }
    };

    /**
     * Move category down
     */
    const moveCategoryDown = (index: number) => {
        if (index < skillCategories.length - 1) {
            const updatedCategories = [...skillCategories];
            [updatedCategories[index], updatedCategories[index + 1]] =
                [updatedCategories[index + 1], updatedCategories[index]];
            updateSkillCategories(updatedCategories);
        }
    };

    /**
     * Apply category template
     */
    const applyTemplate = (templateId: string) => {
        const template = CATEGORY_TEMPLATES[templateId as keyof typeof CATEGORY_TEMPLATES];
        if (template) {
            const newCategories = template.categories.map(cat => ({
                categoryName: cat.categoryName,
                skills: cat.skills.map(skillName => ({
                    id: generateId(),
                    name: skillName,
                    category: "other" as const,
                    level: "intermediate" as const,
                })),
            }));

            // Merge with existing categories
            const mergedCategories = [...skillCategories];
            newCategories.forEach(newCat => {
                const existingIndex = mergedCategories.findIndex(
                    existing => existing.categoryName.toLowerCase() === newCat.categoryName.toLowerCase()
                );

                if (existingIndex >= 0) {
                    // Merge skills into existing category
                    const existingSkillNames = mergedCategories[existingIndex].skills.map(s => s.name.toLowerCase());
                    const newSkills = newCat.skills.filter(
                        skill => !existingSkillNames.includes(skill.name.toLowerCase())
                    );
                    mergedCategories[existingIndex].skills.push(...newSkills);
                } else {
                    // Add new category
                    mergedCategories.push(newCat);
                }
            });

            updateSkillCategories(mergedCategories);
            setShowTemplates(false);
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

    // Don't render if no skills section exists
    if (!skillsSection) {
        return null;
    }

    const totalSkills = skillCategories.reduce((total, category) => total + category.skills.length, 0);
    const atsCheck = checkSkillsATSCompliance(skillCategories);

    return (
        <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
            {/* Header */}
            <div
                className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <svg
                            className="w-5 h-5 text-indigo-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Technical Skills
                        </h3>
                        <p className="text-sm text-gray-500">
                            {skillCategories.length} {skillCategories.length === 1 ? "category" : "categories"}, {totalSkills} skills
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {/* ATS Status */}
                    {atsCheck.isCompliant ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✓ ATS-Friendly
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            ⚠ ATS Issues
                        </span>
                    )}

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowTemplates(!showTemplates);
                        }}
                    >
                        Templates
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            addCategory();
                        }}
                        leftIcon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        }
                    >
                        Add Category
                    </Button>
                    <CollapseIcon />
                </div>
            </div>

            {/* Skills Content */}
            {!isCollapsed && (
                <div className="p-6 space-y-6">
                    {/* Templates */}
                    {showTemplates && (
                        <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                            <h4 className="text-sm font-semibold text-blue-900">Category Templates</h4>
                            <p className="text-xs text-blue-700">
                                Choose a template to quickly set up skill categories for your role. Templates will merge with existing skills.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {Object.entries(CATEGORY_TEMPLATES).map(([id, template]) => (
                                    <div key={id} className="bg-white rounded p-3 border border-blue-200">
                                        <h5 className="font-medium text-sm text-gray-900">{template.name}</h5>
                                        <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                                        <div className="text-xs text-gray-500 mb-2">
                                            Categories: {template.categories.map(cat => cat.categoryName).join(", ")}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => applyTemplate(id)}
                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                                        >
                                            Apply Template
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowTemplates(false)}
                                className="text-blue-600"
                            >
                                Close Templates
                            </Button>
                        </div>
                    )}

                    {/* Skill Categories */}
                    {skillCategories.length === 0 ? (
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
                                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                />
                            </svg>
                            <h4 className="text-lg font-medium text-gray-900 mb-2">No skill categories added</h4>
                            <p className="text-gray-500 mb-4">
                                Organize your technical skills into categories to showcase your expertise effectively.
                            </p>
                            <div className="flex justify-center space-x-3">
                                <Button onClick={() => setShowTemplates(true)} variant="secondary">
                                    Use Template
                                </Button>
                                <Button onClick={addCategory} leftIcon={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                }>
                                    Add Your First Category
                                </Button>
                            </div>
                        </div>
                    ) : (
                        skillCategories.map((category, index) => (
                            <SkillCategoryComponent
                                key={index}
                                category={category}
                                categoryIndex={index}
                                isEditing={editingCategoryIndex === index}
                                onUpdate={updateCategory}
                                onDelete={deleteCategory}
                                onDuplicate={duplicateCategory}
                                onToggleEdit={toggleEditCategory}
                                onMoveUp={moveCategoryUp}
                                onMoveDown={moveCategoryDown}
                            />
                        ))
                    )}

                    {/* ATS Issues */}
                    {!atsCheck.isCompliant && atsCheck.issues.length > 0 && (
                        <div className="bg-orange-50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-orange-900 mb-2">ATS Compliance Issues</h4>
                            <ul className="text-sm text-orange-800 space-y-1">
                                {atsCheck.issues.map((issue, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="text-orange-600 mr-2">•</span>
                                        <span>{issue}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* ATS Suggestions */}
                    {atsCheck.suggestions.length > 0 && (
                        <div className="bg-blue-50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-blue-900 mb-2">Suggestions</h4>
                            <ul className="text-sm text-blue-800 space-y-1">
                                {atsCheck.suggestions.map((suggestion, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="text-blue-600 mr-2">•</span>
                                        <span>{suggestion}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SkillsEditor;