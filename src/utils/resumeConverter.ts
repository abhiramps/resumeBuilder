/**
 * Resume Converter Utilities
 * Convert between frontend Resume format and backend API format
 */

import type { Resume, BackendResume, ResumeContent, ResumeSection } from '../types/resume.types';
import type { ResumeResponse } from '../types/api.types';

/**
 * Convert backend resume response to frontend Resume format
 */
export const backendToFrontendResume = (backendResume: ResumeResponse | BackendResume): Resume => {
    const content = backendResume.content;

    // Convert content to sections
    const sections: ResumeSection[] = [];
    let order = 0;

    // Summary section
    if (content.summary) {
        sections.push({
            id: 'summary',
            type: 'summary',
            title: 'Professional Summary',
            enabled: true,
            order: order++,
            content: { summary: content.summary },
        });
    }

    // Experience section
    if (content.experience && content.experience.length > 0) {
        sections.push({
            id: 'experience',
            type: 'experience',
            title: 'Work Experience',
            enabled: true,
            order: order++,
            content: { experiences: content.experience },
        });
    }

    // Projects section
    if (content.projects && content.projects.length > 0) {
        sections.push({
            id: 'projects',
            type: 'projects',
            title: 'Projects',
            enabled: true,
            order: order++,
            content: { projects: content.projects },
        });
    }

    // Skills section
    if (content.skills && content.skills.length > 0) {
        sections.push({
            id: 'skills',
            type: 'skills',
            title: 'Skills',
            enabled: true,
            order: order++,
            content: { skills: content.skills },
        });
    }

    // Education section
    if (content.education && content.education.length > 0) {
        sections.push({
            id: 'education',
            type: 'education',
            title: 'Education',
            enabled: true,
            order: order++,
            content: { education: content.education },
        });
    }

    // Certifications section
    if (content.certifications && content.certifications.length > 0) {
        sections.push({
            id: 'certifications',
            type: 'certifications',
            title: 'Certifications',
            enabled: true,
            order: order++,
            content: { certifications: content.certifications },
        });
    }

    // Custom sections
    if (content.customSections && content.customSections.length > 0) {
        content.customSections.forEach((customSection) => {
            sections.push({
                id: customSection.id,
                type: 'custom',
                title: customSection.title,
                enabled: true,
                order: customSection.order || order++,
                content: { custom: customSection },
            });
        });
    }

    return {
        id: backendResume.id,
        personalInfo: content.personalInfo || {
            fullName: '',
            title: '',
            email: '',
            phone: '',
            location: '',
        },
        sections,
        layout: {
            pageMargins: { top: 20, right: 20, bottom: 20, left: 20 },
            sectionSpacing: 16,
            lineHeight: 1.5,
            fontSize: {
                name: 24,
                title: 14,
                sectionHeader: 16,
                body: 11,
            },
            fontFamily: 'Inter, system-ui, sans-serif',
            colors: {
                primary: '#2563eb',
                secondary: '#64748b',
                text: '#1e293b',
            },
        },
        template: backendResume.templateId as any || 'classic',
        createdAt: backendResume.createdAt,
        updatedAt: backendResume.updatedAt,
    };
};

/**
 * Convert frontend Resume to backend ResumeContent format
 */
export const frontendToBackendContent = (resume: Resume): ResumeContent => {
    const content: ResumeContent = {
        personalInfo: resume.personalInfo,
    };

    // Extract content from sections
    resume.sections.forEach((section) => {
        if (!section.enabled) return;

        switch (section.type) {
            case 'summary':
                content.summary = (section.content as any).summary;
                break;
            case 'experience':
                content.experience = (section.content as any).experiences;
                break;
            case 'projects':
                content.projects = (section.content as any).projects;
                break;
            case 'skills':
                content.skills = (section.content as any).skills;
                break;
            case 'education':
                content.education = (section.content as any).education;
                break;
            case 'certifications':
                content.certifications = (section.content as any).certifications;
                break;
            case 'custom':
                if (!content.customSections) {
                    content.customSections = [];
                }
                content.customSections.push((section.content as any).custom);
                break;
        }
    });

    return content;
};
