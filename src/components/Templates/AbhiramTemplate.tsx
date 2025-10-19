import React, { forwardRef } from 'react';
import { TemplateBaseProps } from './TemplateBase';
import { templateHelpers } from '../../utils/templateHelpers';
import { WorkExperience, Education, Skill, Certification, Project } from '../../types/resume.types';

/**
 * Abhiram Template Component
 * 
 * Professional backend engineer focused resume template.
 * Based on the provided resume.html design.
 * 
 * Features:
 * - Centered header with professional styling
 * - Color scheme: #2c3e50 (primary), #555 (secondary), #333 (text)
 * - Category-based skills layout
 * - Clean section headers with borders
 * - Optimized for single-page format
 * 
 * ATS Compliance: 95/100
 * Best For: Backend engineers, technical roles, professional presentation
 */
export const AbhiramTemplate = forwardRef<HTMLDivElement, TemplateBaseProps>(
    ({ resume, layout, className = '', printMode = false }, ref) => {
        const enabledSections = resume.sections
            .filter(section => section.enabled)
            .sort((a, b) => a.order - b.order);

        // Color scheme from original template
        const primaryColor = '#2c3e50';
        const secondaryColor = '#555';
        const textColor = '#333';
        const dateColor = '#666';

        const containerStyles: React.CSSProperties = {
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontSize: '10pt',
            lineHeight: 1.3,
            color: textColor,
            backgroundColor: 'white',
            width: printMode ? '8.5in' : '100%',
            maxWidth: '8.5in',
            minHeight: printMode ? '11in' : 'auto',
            padding: `${layout.pageMargins.top}in ${layout.pageMargins.right}in ${layout.pageMargins.bottom}in ${layout.pageMargins.left}in`,
            boxShadow: printMode ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            pageBreakInside: 'avoid',
        };

        const headerStyles: React.CSSProperties = {
            textAlign: 'center',
            marginBottom: '10px',
            paddingBottom: '8px',
            borderBottom: `2px solid ${primaryColor}`,
        };

        const nameStyles: React.CSSProperties = {
            fontSize: '22pt',
            fontWeight: 'bold',
            color: primaryColor,
            marginBottom: '6px',
            letterSpacing: '1px',
        };

        const roleStyles: React.CSSProperties = {
            fontSize: '12pt',
            color: secondaryColor,
            fontWeight: 600,
            marginBottom: '8px',
        };

        const contactStyles: React.CSSProperties = {
            fontSize: '9pt',
            color: secondaryColor,
            lineHeight: 1.5,
        };

        const sectionStyles: React.CSSProperties = {
            marginBottom: '10px',
        };

        const sectionTitleStyles: React.CSSProperties = {
            fontSize: '12pt',
            fontWeight: 'bold',
            color: primaryColor,
            textTransform: 'uppercase',
            borderBottom: `1.5px solid ${primaryColor}`,
            paddingBottom: '2px',
            marginBottom: '6px',
            letterSpacing: '0.5px',
        };

        const renderContactInfo = () => {
            const contactParts: string[] = [];

            if (resume.personalInfo?.location) {
                contactParts.push(resume.personalInfo.location);
            }
            if (resume.personalInfo?.email) {
                contactParts.push(resume.personalInfo.email);
            }

            const firstLine = contactParts.join(' | ');

            const linkParts: string[] = [];
            if (resume.personalInfo?.linkedin) {
                linkParts.push(templateHelpers.url.formatForDisplay(resume.personalInfo.linkedin));
            }
            if (resume.personalInfo?.github) {
                linkParts.push(templateHelpers.url.formatForDisplay(resume.personalInfo.github));
            }
            if (resume.personalInfo?.portfolio) {
                linkParts.push(templateHelpers.url.formatForDisplay(resume.personalInfo.portfolio));
            }

            const secondLine = linkParts.join(' | ');

            return (
                <>
                    {firstLine && <div>{firstLine}</div>}
                    {secondLine && <div>{secondLine}</div>}
                </>
            );
        };

        const renderSummary = (content: { summary: string }) => {
            if (!content.summary) return null;

            return (
                <div style={{
                    textAlign: 'justify',
                    lineHeight: 1.35,
                }}>
                    {content.summary}
                </div>
            );
        };

        const renderSkills = (content: { skills: Skill[] }) => {
            if (!content.skills || content.skills.length === 0) return null;

            const skillsByCategory = content.skills.reduce((acc, skill) => {
                const category = skill.category || 'other';
                if (!acc[category]) acc[category] = [];
                acc[category].push(skill.name);
                return acc;
            }, {} as Record<string, string[]>);

            return (
                <div style={{ lineHeight: 1.4 }}>
                    {Object.entries(skillsByCategory).map(([category, skillNames]) => (
                        <div key={category} style={{ marginBottom: '3px' }}>
                            <strong style={{
                                color: primaryColor,
                                fontWeight: 600,
                            }}>
                                {category.replace(/([A-Z])/g, ' $1').trim()}:
                            </strong>
                            {' '}
                            {skillNames.join(', ')}
                        </div>
                    ))}
                </div>
            );
        };

        const renderExperience = (content: { experiences: WorkExperience[] }) => {
            if (!content.experiences || content.experiences.length === 0) return null;

            return (
                <div>
                    {content.experiences.map((exp, index) => (
                        <div
                            key={exp.id || index}
                            style={{
                                marginBottom: '8px',
                                pageBreakInside: 'avoid',
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '3px',
                            }}>
                                <div>
                                    <div style={{
                                        fontWeight: 'bold',
                                        color: primaryColor,
                                        fontSize: '10.5pt',
                                    }}>
                                        {exp.jobTitle || 'Job Title'}
                                    </div>
                                    <div style={{
                                        fontStyle: 'italic',
                                        color: secondaryColor,
                                        marginBottom: '2px',
                                    }}>
                                        {exp.company || 'Company Name'}
                                        {exp.location && `, ${exp.location}`}
                                    </div>
                                </div>
                                <div style={{
                                    color: dateColor,
                                    fontSize: '9pt',
                                    whiteSpace: 'nowrap',
                                }}>
                                    {templateHelpers.date.formatDateRange(
                                        exp.startDate || '',
                                        exp.endDate || '',
                                        exp.current
                                    )}
                                </div>
                            </div>
                            {exp.description && (
                                <p style={{
                                    margin: '3px 0',
                                    lineHeight: 1.3,
                                }}>
                                    {exp.description}
                                </p>
                            )}
                            {exp.achievements && exp.achievements.length > 0 && (
                                <ul style={{
                                    marginLeft: '18px',
                                    marginTop: '3px',
                                }}>
                                    {exp.achievements.map((achievement, achIndex) => (
                                        <li key={achIndex} style={{
                                            marginBottom: '2px',
                                            lineHeight: 1.3,
                                        }}>
                                            {achievement}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            );
        };

        const renderProjects = (content: { projects: Project[] }) => {
            if (!content.projects || content.projects.length === 0) return null;

            return (
                <div>
                    {content.projects.map((project, index) => (
                        <div
                            key={project.id || index}
                            style={{
                                marginBottom: '8px',
                                pageBreakInside: 'avoid',
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '3px',
                            }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontWeight: 'bold',
                                        color: primaryColor,
                                        fontSize: '10.5pt',
                                    }}>
                                        {project.name || 'Project Name'}
                                    </div>
                                    {project.techStack && project.techStack.length > 0 && (
                                        <div style={{
                                            fontStyle: 'italic',
                                            color: secondaryColor,
                                            marginBottom: '2px',
                                        }}>
                                            {project.techStack.join(', ')}
                                        </div>
                                    )}
                                </div>
                                <div style={{
                                    color: dateColor,
                                    fontSize: '9pt',
                                    whiteSpace: 'nowrap',
                                    marginLeft: '12px',
                                }}>
                                    {templateHelpers.date.formatDateRange(
                                        project.startDate || '',
                                        project.endDate || '',
                                        project.current
                                    )}
                                </div>
                            </div>
                            {project.description && (
                                <p style={{
                                    margin: '3px 0',
                                    lineHeight: 1.3,
                                }}>
                                    {project.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            );
        };

        const renderEducation = (content: { education: Education[] }) => {
            if (!content.education || content.education.length === 0) return null;

            return (
                <div>
                    {content.education.map((edu, index) => (
                        <div
                            key={edu.id || index}
                            style={{
                                marginBottom: index < content.education.length - 1 ? '8px' : '0',
                                pageBreakInside: 'avoid',
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '2px',
                            }}>
                                <div>
                                    <div style={{
                                        fontWeight: 600,
                                        color: primaryColor,
                                    }}>
                                        {edu.degree || 'Degree'}
                                    </div>
                                    <div style={{ color: secondaryColor }}>
                                        {edu.institution || 'Institution'}
                                        {edu.location && `, ${edu.location}`}
                                    </div>
                                </div>
                                <div style={{
                                    color: dateColor,
                                    fontSize: '9pt',
                                    whiteSpace: 'nowrap',
                                }}>
                                    {templateHelpers.date.formatDateRange(
                                        edu.startDate || '',
                                        edu.endDate || ''
                                    )}
                                </div>
                            </div>
                            {edu.gpa && (
                                <div style={{
                                    marginTop: '2px',
                                    color: secondaryColor,
                                    fontSize: '9.5pt',
                                }}>
                                    GPA: {edu.gpa}
                                </div>
                            )}
                            {edu.coursework && edu.coursework.length > 0 && (
                                <div style={{
                                    marginTop: '2px',
                                    color: secondaryColor,
                                    fontSize: '9.5pt',
                                }}>
                                    Relevant Coursework: {edu.coursework.join(', ')}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            );
        };

        const renderCertifications = (content: { certifications: Certification[] }) => {
            if (!content.certifications || content.certifications.length === 0) return null;

            return (
                <div>
                    {content.certifications.map((cert, index) => (
                        <div
                            key={cert.id || index}
                            style={{
                                marginBottom: '3px',
                                pageBreakInside: 'avoid',
                            }}
                        >
                            <span style={{
                                fontWeight: 600,
                                color: primaryColor,
                            }}>
                                {cert.name || 'Certification Name'}
                            </span>
                            {' - '}
                            {cert.issuer || 'Issuing Organization'}
                            {cert.issueDate && (
                                <>
                                    {' '}({templateHelpers.date.formatDate(cert.issueDate)}
                                    {cert.expiryDate && ` - ${templateHelpers.date.formatDate(cert.expiryDate)}`})
                                </>
                            )}
                            {cert.credentialId && (
                                <span style={{ color: secondaryColor }}>
                                    {' '}| ID: {cert.credentialId}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            );
        };

        const renderCustom = (content: { custom: { title: string; content: string } }) => {
            if (!content.custom || !content.custom.content) return null;

            return (
                <div style={{
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.3,
                }}>
                    {content.custom.content}
                </div>
            );
        };

        const renderSectionContent = (section: typeof resume.sections[0]) => {
            switch (section.type) {
                case 'summary':
                    return renderSummary(section.content as { summary: string });
                case 'skills':
                    return renderSkills(section.content as { skills: Skill[] });
                case 'experience':
                    return renderExperience(section.content as { experiences: WorkExperience[] });
                case 'projects':
                    return renderProjects(section.content as { projects: Project[] });
                case 'education':
                    return renderEducation(section.content as { education: Education[] });
                case 'certifications':
                    return renderCertifications(section.content as { certifications: Certification[] });
                case 'custom':
                    return renderCustom(section.content as { custom: { title: string; content: string } });
                default:
                    return null;
            }
        };

        return (
            <div
                ref={ref}
                className={`abhiram-template ${className}`}
                style={containerStyles}
            >
                {/* Header Section */}
                <header style={headerStyles}>
                    <h1 style={nameStyles}>
                        {resume.personalInfo?.fullName?.toUpperCase() || 'YOUR NAME'}
                    </h1>

                    {resume.personalInfo?.title && (
                        <div style={roleStyles}>
                            {resume.personalInfo.title.toUpperCase()}
                        </div>
                    )}

                    <div style={contactStyles}>
                        {renderContactInfo()}
                    </div>
                </header>

                {/* Resume Sections */}
                {enabledSections.map((section) => {
                    const content = renderSectionContent(section);
                    if (!content) return null;

                    return (
                        <section
                            key={section.id}
                            style={sectionStyles}
                        >
                            <h2 style={sectionTitleStyles}>
                                {section.title}
                            </h2>
                            {content}
                        </section>
                    );
                })}

                {/* Empty state */}
                {enabledSections.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        color: secondaryColor,
                    }}>
                        <p>No sections enabled. Enable sections from the sidebar to see your resume content.</p>
                    </div>
                )}
            </div>
        );
    }
);

AbhiramTemplate.displayName = 'AbhiramTemplate';

export default AbhiramTemplate;
