import { WorkExperience } from "../types/resume.types";

/**
 * Validation error interface for experience entries
 */
export interface ExperienceValidationErrors {
  jobTitle?: string;
  company?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  dateRange?: string;
  description?: string;
  achievements?: { [index: number]: string };
}

/**
 * Validation schema for experience fields
 */
export const EXPERIENCE_VALIDATION_RULES = {
  jobTitle: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-.,()&/]+$/,
    errorMessage: "Job title must be 2-100 characters and contain only letters, numbers, and basic punctuation",
  },
  company: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-.,()&/]+$/,
    errorMessage: "Company name must be 2-100 characters and contain only letters, numbers, and basic punctuation",
  },
  location: {
    required: false,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-.,()]+$/,
    errorMessage: "Location must be under 100 characters and contain only letters, numbers, and basic punctuation",
  },
  description: {
    required: false,
    maxLength: 300,
    pattern: /^[a-zA-Z0-9\s\-.,()&/%$#@!?:;'"]+$/,
    errorMessage: "Description must be under 300 characters and ATS-friendly",
  },
  achievements: {
    maxItems: 10,
    itemMaxLength: 200,
    pattern: /^[a-zA-Z0-9\s\-.,()&/%$#@!?:;'"]+$/,
    errorMessage: "Each achievement must be under 200 characters and ATS-friendly",
  },
} as const;

/**
 * Validate a single field value
 */
export const validateField = (
  field: keyof typeof EXPERIENCE_VALIDATION_RULES,
  value: string
): string | undefined => {
  const rules = EXPERIENCE_VALIDATION_RULES[field];
  
  if (!value.trim()) {
    if ('required' in rules && rules.required) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    return undefined;
  }

  if ('minLength' in rules && rules.minLength && value.length < rules.minLength) {
    return `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${rules.minLength} characters`;
  }

  if ('maxLength' in rules && rules.maxLength && value.length > rules.maxLength) {
    return `${field.charAt(0).toUpperCase() + field.slice(1)} must be under ${rules.maxLength} characters`;
  }

  if ('pattern' in rules && rules.pattern && !rules.pattern.test(value)) {
    return rules.errorMessage;
  }

  return undefined;
};

/**
 * Validate achievements array
 */
export const validateAchievements = (achievements: string[]): { [index: number]: string } => {
  const errors: { [index: number]: string } = {};
  const rules = EXPERIENCE_VALIDATION_RULES.achievements;

  if (achievements.length > rules.maxItems) {
    errors[achievements.length - 1] = `Maximum ${rules.maxItems} achievements allowed`;
  }

  achievements.forEach((achievement, index) => {
    if (achievement.trim()) {
      if (achievement.length > rules.itemMaxLength) {
        errors[index] = `Achievement must be under ${rules.itemMaxLength} characters`;
      } else if (!rules.pattern.test(achievement)) {
        errors[index] = rules.errorMessage;
      }
    }
  });

  return errors;
};

/**
 * Validate date format (YYYY-MM)
 */
export const validateDateFormat = (date: string): boolean => {
  if (!date) return true; // Empty dates are allowed for optional fields
  const dateRegex = /^\d{4}-\d{2}$/;
  return dateRegex.test(date);
};

/**
 * Validate date range (start date should be before end date)
 */
export const validateDateRange = (startDate: string, endDate: string, current: boolean): string | undefined => {
  if (!startDate) {
    return "Start date is required";
  }

  if (!validateDateFormat(startDate)) {
    return "Invalid start date format";
  }

  if (!current && endDate) {
    if (!validateDateFormat(endDate)) {
      return "Invalid end date format";
    }

    const start = new Date(startDate + "-01");
    const end = new Date(endDate + "-01");

    if (start >= end) {
      return "End date must be after start date";
    }
  }

  // Check if start date is not in the future
  const start = new Date(startDate + "-01");
  const now = new Date();
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  if (start > currentMonth) {
    return "Start date cannot be in the future";
  }

  return undefined;
};

/**
 * Validate entire experience entry
 */
export const validateExperience = (experience: WorkExperience): ExperienceValidationErrors => {
  const errors: ExperienceValidationErrors = {};

  // Validate basic fields
  const jobTitleError = validateField("jobTitle", experience.jobTitle);
  if (jobTitleError) errors.jobTitle = jobTitleError;

  const companyError = validateField("company", experience.company);
  if (companyError) errors.company = companyError;

  const locationError = validateField("location", experience.location);
  if (locationError) errors.location = locationError;

  const descriptionError = validateField("description", experience.description);
  if (descriptionError) errors.description = descriptionError;

  // Validate date range
  const dateRangeError = validateDateRange(experience.startDate, experience.endDate, experience.current);
  if (dateRangeError) errors.dateRange = dateRangeError;

  // Validate achievements
  const achievementErrors = validateAchievements(experience.achievements);
  if (Object.keys(achievementErrors).length > 0) {
    errors.achievements = achievementErrors;
  }

  return errors;
};

/**
 * Check if experience has any validation errors
 */
export const hasValidationErrors = (errors: ExperienceValidationErrors): boolean => {
  return Object.keys(errors).some(key => {
    const error = errors[key as keyof ExperienceValidationErrors];
    if (typeof error === "string") return true;
    if (typeof error === "object" && error !== null) {
      return Object.keys(error).length > 0;
    }
    return false;
  });
};

/**
 * Get validation error count
 */
export const getValidationErrorCount = (errors: ExperienceValidationErrors): number => {
  let count = 0;
  
  Object.keys(errors).forEach(key => {
    const error = errors[key as keyof ExperienceValidationErrors];
    if (typeof error === "string") {
      count++;
    } else if (typeof error === "object" && error !== null) {
      count += Object.keys(error).length;
    }
  });

  return count;
};

/**
 * ATS compliance checker for experience content
 */
export const checkATSCompliance = (experience: WorkExperience): {
  isCompliant: boolean;
  issues: string[];
  suggestions: string[];
} => {
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Check for problematic characters
  const problematicChars = /[^\w\s\-.,()&/%$#@!?:;'"]/g;
  
  if (problematicChars.test(experience.jobTitle)) {
    issues.push("Job title contains characters that may not be ATS-friendly");
  }

  if (problematicChars.test(experience.company)) {
    issues.push("Company name contains characters that may not be ATS-friendly");
  }

  if (problematicChars.test(experience.description)) {
    issues.push("Description contains characters that may not be ATS-friendly");
  }

  experience.achievements.forEach((achievement, index) => {
    if (problematicChars.test(achievement)) {
      issues.push(`Achievement ${index + 1} contains characters that may not be ATS-friendly`);
    }
  });

  // Check for missing key information
  if (!experience.jobTitle.trim()) {
    issues.push("Missing job title");
  }

  if (!experience.company.trim()) {
    issues.push("Missing company name");
  }

  if (!experience.startDate) {
    issues.push("Missing start date");
  }

  if (experience.achievements.length === 0) {
    suggestions.push("Consider adding achievements or responsibilities to strengthen your experience");
  }

  if (experience.achievements.length < 3) {
    suggestions.push("Adding 3-5 achievements per role is recommended for impact");
  }

  // Check for quantifiable achievements
  const hasQuantifiableAchievements = experience.achievements.some(achievement => 
    /\d+/.test(achievement) || /%/.test(achievement) || /\$/.test(achievement)
  );

  if (!hasQuantifiableAchievements && experience.achievements.length > 0) {
    suggestions.push("Consider adding quantifiable results (numbers, percentages, dollar amounts) to your achievements");
  }

  return {
    isCompliant: issues.length === 0,
    issues,
    suggestions,
  };
};

/**
 * Generate experience summary for display
 */
export const generateExperienceSummary = (experience: WorkExperience): string => {
  const parts: string[] = [];

  if (experience.jobTitle) parts.push(experience.jobTitle);
  if (experience.company) parts.push(`at ${experience.company}`);
  if (experience.location) parts.push(`(${experience.location})`);

  if (experience.startDate) {
    const startDate = new Date(experience.startDate + "-01");
    const startStr = startDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    
    if (experience.current) {
      parts.push(`• ${startStr} - Present`);
    } else if (experience.endDate) {
      const endDate = new Date(experience.endDate + "-01");
      const endStr = endDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      parts.push(`• ${startStr} - ${endStr}`);
    }
  }

  return parts.join(" ");
};

/**
 * Calculate experience duration in months
 */
export const calculateExperienceDuration = (experience: WorkExperience): number => {
  if (!experience.startDate) return 0;

  const start = new Date(experience.startDate + "-01");
  const end = experience.current || !experience.endDate 
    ? new Date() 
    : new Date(experience.endDate + "-01");

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44)); // Average days per month

  return diffMonths;
};

/**
 * Format experience duration for display
 */
export const formatExperienceDuration = (experience: WorkExperience): string => {
  const months = calculateExperienceDuration(experience);
  
  if (months === 0) return "";
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0) {
    return `${months} month${months === 1 ? "" : "s"}`;
  } else if (remainingMonths === 0) {
    return `${years} year${years === 1 ? "" : "s"}`;
  } else {
    return `${years} year${years === 1 ? "" : "s"}, ${remainingMonths} month${remainingMonths === 1 ? "" : "s"}`;
  }
};