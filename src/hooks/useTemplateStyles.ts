import { useMemo } from 'react';
import { useResume } from '../contexts/ResumeContext';
import { mergeTemplateStyles, ComputedStyles } from '../utils/templateStyler';
import { TemplateType } from '../types/resume.types';

/**
 * useTemplateStyles Hook
 * 
 * Returns computed styles by merging template defaults with user customizations.
 * Memoized for performance - only recalculates when template or layout changes.
 * 
 * @returns ComputedStyles object with all merged styles
 * 
 * @example
 * const styles = useTemplateStyles();
 * console.log(styles.fontFamily); // 'Arial, Helvetica, sans-serif'
 * console.log(styles.colors.primary); // '#2c3e50'
 */
export const useTemplateStyles = (): ComputedStyles => {
  const { resume } = useResume();

  const computedStyles = useMemo(() => {
    return mergeTemplateStyles(resume.template, resume.layout);
  }, [resume.template, resume.layout]);

  return computedStyles;
};

/**
 * useTemplateStylesFor Hook
 * 
 * Returns computed styles for a specific template (useful for previews).
 * 
 * @param templateType - The template type to get styles for
 * @returns ComputedStyles object for the specified template
 * 
 * @example
 * const classicStyles = useTemplateStylesFor('classic');
 * const modernStyles = useTemplateStylesFor('modern');
 */
export const useTemplateStylesFor = (templateType: TemplateType): ComputedStyles => {
  const { resume } = useResume();

  const computedStyles = useMemo(() => {
    return mergeTemplateStyles(templateType, resume.layout);
  }, [templateType, resume.layout]);

  return computedStyles;
};

/**
 * useTemplateFont Hook
 * 
 * Returns just the font family for the current template.
 * Useful for components that only need font information.
 * 
 * @returns Font family string
 */
export const useTemplateFont = (): string => {
  const styles = useTemplateStyles();
  return styles.fontFamily;
};

/**
 * useTemplateColors Hook
 * 
 * Returns just the color scheme for the current template.
 * Useful for components that only need color information.
 * 
 * @returns Color scheme object
 */
export const useTemplateColors = () => {
  const styles = useTemplateStyles();
  return styles.colors;
};

/**
 * useTemplateFontSizes Hook
 * 
 * Returns just the font sizes for the current template.
 * Useful for components that only need font size information.
 * 
 * @returns Font sizes object
 */
export const useTemplateFontSizes = () => {
  const styles = useTemplateStyles();
  return styles.fontSize;
};

/**
 * useTemplateSpacing Hook
 * 
 * Returns just the spacing settings for the current template.
 * Useful for components that only need spacing information.
 * 
 * @returns Spacing settings object
 */
export const useTemplateSpacing = () => {
  const styles = useTemplateStyles();
  return styles.spacing;
};

export default useTemplateStyles;
