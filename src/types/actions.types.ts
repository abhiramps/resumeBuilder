import {
  Resume,
  PersonalInfo,
  ResumeSection,
  LayoutSettings,
  TemplateType,
} from "./resume.types";

/**
 * Action types for the resume reducer
 * Defines all possible actions that can be dispatched to update resume state
 */

// Core resume actions
export type ResumeAction =
  | { type: "SET_RESUME"; payload: Resume }
  | { type: "RESET_RESUME" }
  | { type: "LOAD_RESUME"; payload: Resume }
  | { type: "SAVE_RESUME" };

// Personal information actions
export type PersonalInfoAction =
  | { type: "UPDATE_PERSONAL_INFO"; payload: Partial<PersonalInfo> }
  | { type: "UPDATE_FULL_NAME"; payload: string }
  | { type: "UPDATE_TITLE"; payload: string }
  | {
      type: "UPDATE_CONTACT_INFO";
      payload: Partial<Pick<PersonalInfo, "email" | "phone" | "location">>;
    }
  | {
      type: "UPDATE_SOCIAL_LINKS";
      payload: Partial<Pick<PersonalInfo, "linkedin" | "github" | "portfolio">>;
    };

// Section management actions
export type SectionAction =
  | { type: "ADD_SECTION"; payload: ResumeSection }
  | {
      type: "UPDATE_SECTION";
      payload: { id: string; updates: Partial<ResumeSection> };
    }
  | { type: "DELETE_SECTION"; payload: string }
  | { type: "REORDER_SECTIONS"; payload: string[] }
  | { type: "TOGGLE_SECTION"; payload: string }
  | { type: "DUPLICATE_SECTION"; payload: string };

// Content-specific actions for each section type
export type SummaryAction = {
  type: "UPDATE_SUMMARY";
  payload: { sectionId: string; summary: string };
};

export type ExperienceAction =
  | { type: "ADD_EXPERIENCE"; payload: { sectionId: string; experience: any } }
  | {
      type: "UPDATE_EXPERIENCE";
      payload: { sectionId: string; experienceId: string; updates: any };
    }
  | {
      type: "DELETE_EXPERIENCE";
      payload: { sectionId: string; experienceId: string };
    }
  | {
      type: "REORDER_EXPERIENCES";
      payload: { sectionId: string; experienceIds: string[] };
    };

export type ProjectAction =
  | { type: "ADD_PROJECT"; payload: { sectionId: string; project: any } }
  | {
      type: "UPDATE_PROJECT";
      payload: { sectionId: string; projectId: string; updates: any };
    }
  | {
      type: "DELETE_PROJECT";
      payload: { sectionId: string; projectId: string };
    }
  | {
      type: "REORDER_PROJECTS";
      payload: { sectionId: string; projectIds: string[] };
    };

export type SkillAction =
  | { type: "ADD_SKILL"; payload: { sectionId: string; skill: any } }
  | {
      type: "UPDATE_SKILL";
      payload: { sectionId: string; skillId: string; updates: any };
    }
  | { type: "DELETE_SKILL"; payload: { sectionId: string; skillId: string } }
  | {
      type: "REORDER_SKILLS";
      payload: { sectionId: string; skillIds: string[] };
    };

export type EducationAction =
  | { type: "ADD_EDUCATION"; payload: { sectionId: string; education: any } }
  | {
      type: "UPDATE_EDUCATION";
      payload: { sectionId: string; educationId: string; updates: any };
    }
  | {
      type: "DELETE_EDUCATION";
      payload: { sectionId: string; educationId: string };
    }
  | {
      type: "REORDER_EDUCATION";
      payload: { sectionId: string; educationIds: string[] };
    };

export type CertificationAction =
  | {
      type: "ADD_CERTIFICATION";
      payload: { sectionId: string; certification: any };
    }
  | {
      type: "UPDATE_CERTIFICATION";
      payload: { sectionId: string; certificationId: string; updates: any };
    }
  | {
      type: "DELETE_CERTIFICATION";
      payload: { sectionId: string; certificationId: string };
    }
  | {
      type: "REORDER_CERTIFICATIONS";
      payload: { sectionId: string; certificationIds: string[] };
    };

export type CustomSectionAction = {
  type: "UPDATE_CUSTOM_SECTION";
  payload: { sectionId: string; title: string; content: string };
};

// Layout and styling actions
export type LayoutAction =
  | { type: "UPDATE_LAYOUT"; payload: Partial<LayoutSettings> }
  | { type: "UPDATE_MARGINS"; payload: Partial<LayoutSettings["pageMargins"]> }
  | {
      type: "UPDATE_SPACING";
      payload: { sectionSpacing?: number; lineHeight?: number };
    }
  | { type: "UPDATE_FONT_SIZES"; payload: Partial<LayoutSettings["fontSize"]> }
  | { type: "UPDATE_FONT_FAMILY"; payload: string }
  | { type: "UPDATE_COLORS"; payload: Partial<LayoutSettings["colors"]> };

// Template actions
export type TemplateAction =
  | { type: "SET_TEMPLATE"; payload: TemplateType }
  | { type: "RESET_TEMPLATE" };

// ATS validation actions
export type ATSAction =
  | { type: "VALIDATE_ATS"; payload: any }
  | { type: "CLEAR_ATS_ISSUES" }
  | { type: "FIX_ATS_ISSUE"; payload: string };

// UI state actions
export type UIAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_PREVIEW_MODE"; payload: boolean }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_ACTIVE_SECTION"; payload: string | null };

// Union type for all actions
export type AppAction =
  | ResumeAction
  | PersonalInfoAction
  | SectionAction
  | SummaryAction
  | ExperienceAction
  | ProjectAction
  | SkillAction
  | EducationAction
  | CertificationAction
  | CustomSectionAction
  | LayoutAction
  | TemplateAction
  | ATSAction
  | UIAction;

// Action creator types for type-safe action creation
export interface ActionCreators {
  // Resume actions
  setResume: (resume: Resume) => ResumeAction;
  resetResume: () => ResumeAction;
  loadResume: (resume: Resume) => ResumeAction;
  saveResume: () => ResumeAction;

  // Personal info actions
  updatePersonalInfo: (updates: Partial<PersonalInfo>) => PersonalInfoAction;
  updateFullName: (name: string) => PersonalInfoAction;
  updateTitle: (title: string) => PersonalInfoAction;
  updateContactInfo: (
    contact: Partial<Pick<PersonalInfo, "email" | "phone" | "location">>
  ) => PersonalInfoAction;
  updateSocialLinks: (
    links: Partial<Pick<PersonalInfo, "linkedin" | "github" | "portfolio">>
  ) => PersonalInfoAction;

  // Section actions
  addSection: (section: ResumeSection) => SectionAction;
  updateSection: (id: string, updates: Partial<ResumeSection>) => SectionAction;
  deleteSection: (id: string) => SectionAction;
  reorderSections: (ids: string[]) => SectionAction;
  toggleSection: (id: string) => SectionAction;
  duplicateSection: (id: string) => SectionAction;

  // Layout actions
  updateLayout: (updates: Partial<LayoutSettings>) => LayoutAction;
  updateMargins: (
    margins: Partial<LayoutSettings["pageMargins"]>
  ) => LayoutAction;
  updateSpacing: (spacing: {
    sectionSpacing?: number;
    lineHeight?: number;
  }) => LayoutAction;
  updateFontSizes: (sizes: Partial<LayoutSettings["fontSize"]>) => LayoutAction;
  updateFontFamily: (family: string) => LayoutAction;
  updateColors: (colors: Partial<LayoutSettings["colors"]>) => LayoutAction;

  // Template actions
  setTemplate: (template: TemplateType) => TemplateAction;
  resetTemplate: () => TemplateAction;

  // UI actions
  setLoading: (loading: boolean) => UIAction;
  setError: (error: string | null) => UIAction;
  clearError: () => UIAction;
  setPreviewMode: (preview: boolean) => UIAction;
  toggleSidebar: () => UIAction;
  setActiveSection: (sectionId: string | null) => UIAction;
}

// Action type guards for runtime type checking
export const isResumeAction = (action: AppAction): action is ResumeAction => {
  return ["SET_RESUME", "RESET_RESUME", "LOAD_RESUME", "SAVE_RESUME"].includes(
    action.type
  );
};

export const isPersonalInfoAction = (
  action: AppAction
): action is PersonalInfoAction => {
  return [
    "UPDATE_PERSONAL_INFO",
    "UPDATE_FULL_NAME",
    "UPDATE_TITLE",
    "UPDATE_CONTACT_INFO",
    "UPDATE_SOCIAL_LINKS",
  ].includes(action.type);
};

export const isSectionAction = (action: AppAction): action is SectionAction => {
  return [
    "ADD_SECTION",
    "UPDATE_SECTION",
    "DELETE_SECTION",
    "REORDER_SECTIONS",
    "TOGGLE_SECTION",
    "DUPLICATE_SECTION",
  ].includes(action.type);
};

export const isLayoutAction = (action: AppAction): action is LayoutAction => {
  return [
    "UPDATE_LAYOUT",
    "UPDATE_MARGINS",
    "UPDATE_SPACING",
    "UPDATE_FONT_SIZES",
    "UPDATE_FONT_FAMILY",
    "UPDATE_COLORS",
  ].includes(action.type);
};

export const isTemplateAction = (
  action: AppAction
): action is TemplateAction => {
  return ["SET_TEMPLATE", "RESET_TEMPLATE"].includes(action.type);
};

export const isUIAction = (action: AppAction): action is UIAction => {
  return [
    "SET_LOADING",
    "SET_ERROR",
    "CLEAR_ERROR",
    "SET_PREVIEW_MODE",
    "TOGGLE_SIDEBAR",
    "SET_ACTIVE_SECTION",
  ].includes(action.type);
};
