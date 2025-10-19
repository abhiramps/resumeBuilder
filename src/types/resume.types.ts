/**
 * Core resume data types for the ATS-friendly resume builder
 * All types are designed to maintain ATS compliance while providing flexibility
 */

/**
 * Personal information section containing contact details and social links
 * @interface PersonalInfo
 */
export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

/**
 * Work experience item with job details, responsibilities, and achievements
 * @interface WorkExperience
 */
export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

// Alias for Task 2 requirements
export type ExperienceItem = WorkExperience;

export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  startDate: string;
  endDate: string;
  current: boolean;
  url?: string;
  githubUrl?: string;
}

// Alias for Task 2 requirements
export type ProjectItem = Project;

export interface Skill {
  id: string;
  name: string;
  category:
    | "languages"
    | "frameworks"
    | "databases"
    | "tools"
    | "cloud"
    | "other";
  level: "beginner" | "intermediate" | "advanced" | "expert";
}

// SkillCategory interface for Task 2 requirements
export interface SkillCategory {
  categoryName: string;
  skills: Skill[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  coursework?: string[];
}

// Alias for Task 2 requirements
export type EducationItem = Education;

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

// Alias for Task 2 requirements
export type CertificationItem = Certification;

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

export type SectionType =
  | "summary"
  | "experience"
  | "projects"
  | "skills"
  | "education"
  | "certifications"
  | "custom";

/**
 * Resume section container with type-safe content based on section type
 * Uses discriminated union for type safety
 * @interface ResumeSection
 */
export interface ResumeSection {
  id: string;
  type: SectionType;
  title: string;
  enabled: boolean;
  order: number;
  content:
    | { summary: string }
    | { experiences: WorkExperience[] }
    | { projects: Project[] }
    | { skills: Skill[] }
    | { education: Education[] }
    | { certifications: Certification[] }
    | { custom: CustomSection };
}

// Alias for Task 2 requirements
export type Section = ResumeSection;

/**
 * Layout and styling settings for resume appearance
 * Controls margins, spacing, fonts, and colors while maintaining ATS compliance
 * @interface LayoutSettings
 */
export interface LayoutSettings {
  pageMargins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  sectionSpacing: number;
  lineHeight: number;
  fontSize: {
    name: number;
    title: number;
    sectionHeader: number;
    body: number;
  };
  fontFamily: string;
  colors: {
    primary: string;
    secondary: string;
    text: string;
  };
}

export type TemplateType = "classic" | "modern" | "minimal" | "abhiram";

/**
 * Main resume data structure containing all sections and settings
 * @interface Resume
 */
export interface Resume {
  id: string;
  personalInfo: PersonalInfo;
  sections: ResumeSection[];
  layout: LayoutSettings;
  template: TemplateType;
  createdAt: string;
  updatedAt: string;
}

// ATS Validation types
export interface ATSIssue {
  id: string;
  type: "error" | "warning" | "info";
  message: string;
  section?: string;
  suggestion?: string;
}

export interface ATSValidation {
  score: number;
  issues: ATSIssue[];
  lastValidated: string;
}

// Action types for reducer
export type ResumeAction =
  | { type: "SET_RESUME"; payload: Resume }
  | { type: "UPDATE_PERSONAL_INFO"; payload: Partial<PersonalInfo> }
  | { type: "ADD_SECTION"; payload: ResumeSection }
  | {
      type: "UPDATE_SECTION";
      payload: { id: string; updates: Partial<ResumeSection> };
    }
  | { type: "DELETE_SECTION"; payload: string }
  | { type: "REORDER_SECTIONS"; payload: string[] }
  | { type: "UPDATE_LAYOUT"; payload: Partial<LayoutSettings> }
  | { type: "SET_TEMPLATE"; payload: TemplateType }
  | { type: "RESET_RESUME" };

// Context types
export interface ResumeContextType {
  resume: Resume;
  dispatch: React.Dispatch<any>; // Using any to support all action types from actions.types.ts
  atsValidation: ATSValidation;
  isLoading: boolean;
  error: string | null;
}

// Component prop types
export interface SectionEditorProps {
  section: ResumeSection;
  onUpdate: (updates: Partial<ResumeSection>) => void;
  onDelete: () => void;
}

export interface PreviewProps {
  resume: Resume;
  className?: string;
}

export interface LayoutControlsProps {
  layout: LayoutSettings;
  onUpdate: (updates: Partial<LayoutSettings>) => void;
}

// Export utility types
export type ResumeSectionContent<T extends SectionType> = T extends "summary"
  ? { summary: string }
  : T extends "experience"
  ? { experiences: WorkExperience[] }
  : T extends "projects"
  ? { projects: Project[] }
  : T extends "skills"
  ? { skills: Skill[] }
  : T extends "education"
  ? { education: Education[] }
  : T extends "certifications"
  ? { certifications: Certification[] }
  : T extends "custom"
  ? { custom: CustomSection }
  : never;
