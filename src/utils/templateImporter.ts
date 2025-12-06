import { Resume, LayoutSettings, TemplateType } from '../types/resume.types';

/**
 * Template Importer/Exporter
 * 
 * Handles importing and exporting resume templates as JSON.
 * Includes validation and schema checking.
 */

export interface ExportedTemplate {
  version: string;
  name: string;
  description: string;
  templateType: TemplateType;
  layout: LayoutSettings;
  sampleContent?: Partial<Resume>;
  metadata: {
    author?: string;
    createdAt: string;
    tags?: string[];
  };
}

export interface ImportValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  template?: ExportedTemplate;
}

const CURRENT_VERSION = '1.0.0';

/**
 * Export current resume layout as template
 */
export const exportTemplate = (
  resume: Resume,
  name: string,
  description: string,
  author?: string
): ExportedTemplate => {
  const template: ExportedTemplate = {
    version: CURRENT_VERSION,
    name,
    description,
    templateType: resume.template,
    layout: resume.layout,
    metadata: {
      author,
      createdAt: new Date().toISOString(),
      tags: ['custom', resume.template],
    },
  };

  return template;
};

/**
 * Export template as JSON string
 */
export const exportTemplateAsJSON = (template: ExportedTemplate): string => {
  return JSON.stringify(template, null, 2);
};

/**
 * Export template and trigger download
 */
export const downloadTemplate = (template: ExportedTemplate): void => {
  const json = exportTemplateAsJSON(template);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${template.name.replace(/\s+/g, '-').toLowerCase()}-template.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Import template from JSON string
 */
export const importTemplateFromJSON = (jsonString: string): ImportValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const parsed = JSON.parse(jsonString);
    const validation = validateTemplateStructure(parsed);

    if (!validation.isValid) {
      return validation;
    }

    return {
      isValid: true,
      errors: [],
      warnings: validation.warnings,
      template: parsed as ExportedTemplate,
    };
  } catch (error) {
    errors.push('Invalid JSON format');
    return { isValid: false, errors, warnings };
  }
};

/**
 * Import template from file
 */
export const importTemplateFromFile = (file: File): Promise<ImportValidationResult> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;
      const result = importTemplateFromJSON(content);
      resolve(result);
    };

    reader.onerror = () => {
      resolve({
        isValid: false,
        errors: ['Failed to read file'],
        warnings: [],
      });
    };

    reader.readAsText(file);
  });
};

/**
 * Validate template structure
 */
const validateTemplateStructure = (data: any): ImportValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required fields
  if (!data.version) {
    errors.push('Missing version field');
  }

  if (!data.name || typeof data.name !== 'string') {
    errors.push('Missing or invalid name field');
  }

  if (!data.description || typeof data.description !== 'string') {
    errors.push('Missing or invalid description field');
  }

  if (!data.templateType) {
    errors.push('Missing templateType field');
  } else if (!['classic', 'modern', 'minimal', 'professional'].includes(data.templateType)) {
    errors.push(`Invalid templateType: ${data.templateType}`);
  }

  if (!data.layout) {
    errors.push('Missing layout configuration');
  } else {
    const layoutErrors = validateLayoutSettings(data.layout);
    errors.push(...layoutErrors);
  }

  if (!data.metadata) {
    warnings.push('Missing metadata');
  } else {
    if (!data.metadata.createdAt) {
      warnings.push('Missing creation date');
    }
  }

  // Check version compatibility
  if (data.version !== CURRENT_VERSION) {
    warnings.push(`Template version ${data.version} may not be fully compatible with current version ${CURRENT_VERSION}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    template: errors.length === 0 ? data : undefined,
  };
};

/**
 * Validate layout settings
 */
const validateLayoutSettings = (layout: any): string[] => {
  const errors: string[] = [];

  // Check page margins
  if (layout.pageMargins) {
    const { top, right, bottom, left } = layout.pageMargins;
    if (typeof top !== 'number' || top < 0 || top > 2) {
      errors.push('Invalid top margin');
    }
    if (typeof right !== 'number' || right < 0 || right > 2) {
      errors.push('Invalid right margin');
    }
    if (typeof bottom !== 'number' || bottom < 0 || bottom > 2) {
      errors.push('Invalid bottom margin');
    }
    if (typeof left !== 'number' || left < 0 || left > 2) {
      errors.push('Invalid left margin');
    }
  }

  // Check section spacing
  if (layout.sectionSpacing !== undefined) {
    if (typeof layout.sectionSpacing !== 'number' || layout.sectionSpacing < 0 || layout.sectionSpacing > 50) {
      errors.push('Invalid section spacing');
    }
  }

  // Check line height
  if (layout.lineHeight !== undefined) {
    if (typeof layout.lineHeight !== 'number' || layout.lineHeight < 1.0 || layout.lineHeight > 3.0) {
      errors.push('Invalid line height');
    }
  }

  // Check font sizes
  if (layout.fontSize) {
    const { name, title, sectionHeader, body } = layout.fontSize;
    if (typeof name !== 'number' || name < 10 || name > 40) {
      errors.push('Invalid name font size');
    }
    if (typeof title !== 'number' || title < 8 || title > 20) {
      errors.push('Invalid title font size');
    }
    if (typeof sectionHeader !== 'number' || sectionHeader < 8 || sectionHeader > 20) {
      errors.push('Invalid section header font size');
    }
    if (typeof body !== 'number' || body < 8 || body > 16) {
      errors.push('Invalid body font size');
    }
  }

  // Check font family
  if (layout.fontFamily !== undefined) {
    if (typeof layout.fontFamily !== 'string' || layout.fontFamily.trim().length === 0) {
      errors.push('Invalid font family');
    }
  }

  // Check colors
  if (layout.colors) {
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
    if (layout.colors.primary && !hexColorRegex.test(layout.colors.primary)) {
      errors.push('Invalid primary color format');
    }
    if (layout.colors.secondary && !hexColorRegex.test(layout.colors.secondary)) {
      errors.push('Invalid secondary color format');
    }
    if (layout.colors.text && !hexColorRegex.test(layout.colors.text)) {
      errors.push('Invalid text color format');
    }
  }

  return errors;
};

/**
 * Apply imported template to resume
 */
export const applyImportedTemplate = (
  template: ExportedTemplate,
  currentResume: Resume
): Resume => {
  return {
    ...currentResume,
    template: template.templateType,
    layout: {
      ...currentResume.layout,
      ...template.layout,
    },
  };
};

/**
 * Export resume data as JSON
 */
export const exportResumeData = (resume: Resume): string => {
  return JSON.stringify(resume, null, 2);
};

/**
 * Download resume data as JSON file
 */
export const downloadResumeData = (resume: Resume, filename?: string): void => {
  const json = exportResumeData(resume);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `resume-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Import resume data from JSON
 */
export const importResumeData = (jsonString: string): { isValid: boolean; resume?: Resume; error?: string } => {
  try {
    const parsed = JSON.parse(jsonString);

    // Basic validation
    if (!parsed.id || !parsed.personalInfo || !parsed.sections || !parsed.layout) {
      return {
        isValid: false,
        error: 'Invalid resume data structure',
      };
    }

    return {
      isValid: true,
      resume: parsed as Resume,
    };
  } catch (error) {
    return {
      isValid: false,
      error: 'Invalid JSON format',
    };
  }
};

/**
 * Import resume data from file
 */
export const importResumeDataFromFile = (file: File): Promise<{ isValid: boolean; resume?: Resume; error?: string }> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;
      const result = importResumeData(content);
      resolve(result);
    };

    reader.onerror = () => {
      resolve({
        isValid: false,
        error: 'Failed to read file',
      });
    };

    reader.readAsText(file);
  });
};

/**
 * Create sample template for sharing
 */
export const createSampleTemplate = (
  templateType: TemplateType,
  layout: LayoutSettings
): ExportedTemplate => {
  return {
    version: CURRENT_VERSION,
    name: `${templateType.charAt(0).toUpperCase() + templateType.slice(1)} Template`,
    description: `A ${templateType} resume template`,
    templateType,
    layout,
    metadata: {
      createdAt: new Date().toISOString(),
      tags: [templateType, 'sample'],
    },
  };
};

/**
 * Validate file type
 */
export const isValidTemplateFile = (file: File): boolean => {
  return file.type === 'application/json' || file.name.endsWith('.json');
};

/**
 * Get file size in human-readable format
 */
export const getFileSizeString = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
