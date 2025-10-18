import React, { forwardRef } from "react";
import { Resume } from "../../types/resume.types";
import { templateHelpers } from "../../utils/templateHelpers";

/**
 * Resume Preview Component Props
 */
export interface ResumePreviewProps {
  /** Resume data to display */
  resume: Resume;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show print-specific styling */
  printMode?: boolean;
}

/**
 * Resume Preview Component
 * 
 * Displays the formatted resume with:
 * - Letter size (8.5" x 11") dimensions
 * - User's layout settings applied
 * - Only enabled sections shown
 * - Sections in correct order
 * - Print-optimized styling
 * - ATS-safe formatting
 * 
 * Uses forwardRef for PDF generation compatibility
 */
export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ resume, className = "", printMode = false }, ref) => {
    // Calculate enabled sections in order
    const enabledSections = (resume.sections || [])
      .filter((section) => section.enabled)
      .sort((a, b) => a.order - b.order);

    // Apply layout settings to inline styles
    const containerStyles: React.CSSProperties = {
      fontFamily: resume.layout?.fontFamily || "Arial",
      fontSize: `${resume.layout?.fontSize?.body || 10}pt`,
      lineHeight: resume.layout?.lineHeight || 1.4,
      color: resume.layout?.colors?.text || "#333333",
      backgroundColor: "white",
      // Letter size dimensions (8.5" x 11")
      width: printMode ? "8.5in" : "100%",
      maxWidth: "8.5in",
      minHeight: printMode ? "11in" : "auto",
      // Apply page margins
      padding: `${resume.layout?.pageMargins?.top || 1}in ${resume.layout?.pageMargins?.right || 1}in ${resume.layout?.pageMargins?.bottom || 1}in ${resume.layout?.pageMargins?.left || 1}in`,
      // Box shadow for paper effect (hidden in print)
      boxShadow: printMode ? "none" : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      // Ensure proper page breaks
      pageBreakInside: "avoid",
    };

    const headerStyles: React.CSSProperties = {
      textAlign: "center",
      marginBottom: `${resume.layout?.sectionSpacing || 16}px`,
    };

    const nameStyles: React.CSSProperties = {
      fontSize: `${resume.layout?.fontSize?.name || 22}pt`,
      fontWeight: "bold",
      color: resume.layout?.colors?.primary || "#2c3e50",
      marginBottom: "4px",
      lineHeight: 1.2,
    };

    const titleStyles: React.CSSProperties = {
      fontSize: `${resume.layout?.fontSize?.title || 12}pt`,
      color: resume.layout?.colors?.secondary || "#555555",
      marginBottom: "8px",
      fontStyle: "italic",
    };

    const contactStyles: React.CSSProperties = {
      fontSize: `${(resume.layout?.fontSize?.body || 10) - 1}pt`,
      color: resume.layout?.colors?.secondary || "#555555",
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: "16px",
    };

    const sectionHeaderStyles: React.CSSProperties = {
      fontSize: `${resume.layout?.fontSize?.sectionHeader || 12}pt`,
      fontWeight: "bold",
      color: resume.layout?.colors?.primary || "#2c3e50",
      textTransform: "uppercase",
      borderBottom: `1px solid ${resume.layout?.colors?.primary || "#2c3e50"}`,
      paddingBottom: "2px",
      marginBottom: "12px",
      letterSpacing: "0.5px",
    };

    /**
     * Render contact information
     */
    const renderContactInfo = () => {
      const contactItems = [];

      if (resume.personalInfo?.email) {
        contactItems.push(resume.personalInfo.email);
      }
      if (resume.personalInfo?.phone) {
        // Use template helper to format phone number
        contactItems.push(templateHelpers.phone.format(resume.personalInfo.phone));
      }
      if (resume.personalInfo?.location) {
        contactItems.push(resume.personalInfo.location);
      }
      if (resume.personalInfo?.linkedin) {
        // Use template helper to format URL for display
        contactItems.push(templateHelpers.url.formatForDisplay(resume.personalInfo.linkedin));
      }
      if (resume.personalInfo?.github) {
        contactItems.push(templateHelpers.url.formatForDisplay(resume.personalInfo.github));
      }
      if (resume.personalInfo?.portfolio) {
        contactItems.push(templateHelpers.url.formatForDisplay(resume.personalInfo.portfolio));
      }

      return contactItems.map((item, index) => (
        <span key={index}>{item}</span>
      ));
    };

    /**
     * Render section content based on section type
     */
    const renderSectionContent = (section: typeof resume.sections[0]) => {
      const contentStyles: React.CSSProperties = {
        fontSize: `${resume.layout?.fontSize?.body || 10}pt`,
        lineHeight: resume.layout.lineHeight,
      };

      switch (section.type) {
        case "summary":
          const summaryContent = (section.content as { summary: string }).summary;
          return (
            <div style={contentStyles}>
              <p style={{ margin: 0, textAlign: "justify" }}>
                {summaryContent || "Professional summary will appear here..."}
              </p>
            </div>
          );

        case "experience":
          const experiences = (section.content as { experiences: any[] }).experiences || [];
          return (
            <div style={contentStyles}>
              {experiences.map((exp, index) => (
                <div key={exp.id || index} style={{ marginBottom: index < experiences.length - 1 ? "16px" : "0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                    <div>
                      <h3 style={{
                        fontSize: `${(resume.layout?.fontSize?.body || 10) + 1}pt`,
                        fontWeight: "bold",
                        color: resume.layout?.colors?.primary || "#2c3e50",
                        margin: 0,
                        lineHeight: 1.2
                      }}>
                        {exp.jobTitle || "Job Title"}
                      </h3>
                      <p style={{
                        fontSize: `${resume.layout?.fontSize?.body || 10}pt`,
                        fontStyle: "italic",
                        color: resume.layout?.colors?.secondary || "#555555",
                        margin: "2px 0"
                      }}>
                        {exp.company || "Company Name"} {exp.location && `• ${exp.location}`}
                      </p>
                    </div>
                    <span style={{
                      fontSize: `${(resume.layout?.fontSize?.body || 10) - 1}pt`,
                      color: resume.layout?.colors?.secondary || "#555555",
                      whiteSpace: "nowrap"
                    }}>
                      {templateHelpers.date.formatDateRange(exp.startDate || "", exp.endDate || "", exp.current)}
                    </span>
                  </div>
                  {exp.description && (
                    <p style={{ margin: "4px 0", textAlign: "justify" }}>
                      {exp.description}
                    </p>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
                      {exp.achievements.map((achievement: string, achIndex: number) => (
                        <li key={achIndex} style={{ marginBottom: "2px" }}>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          );

        case "projects":
          const projects = (section.content as { projects: any[] }).projects || [];
          return (
            <div style={contentStyles}>
              {projects.map((project, index) => (
                <div key={project.id || index} style={{ marginBottom: index < projects.length - 1 ? "16px" : "0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                    <h3 style={{
                      fontSize: `${resume.layout?.fontSize?.body || 10 + 1}pt`,
                      fontWeight: "bold",
                      color: resume.layout?.colors?.primary || "#2c3e50",
                      margin: 0,
                      lineHeight: 1.2
                    }}>
                      {project.name || "Project Name"}
                    </h3>
                    <span style={{
                      fontSize: `${resume.layout?.fontSize?.body || 10 - 1}pt`,
                      color: resume.layout?.colors?.secondary || "#555555",
                      whiteSpace: "nowrap"
                    }}>
                      {project.startDate || "Start"} - {project.current ? "Present" : (project.endDate || "End")}
                    </span>
                  </div>
                  {project.techStack && project.techStack.length > 0 && (
                    <p style={{
                      fontSize: `${resume.layout?.fontSize?.body || 10}pt`,
                      fontStyle: "italic",
                      color: resume.layout?.colors?.secondary || "#555555",
                      margin: "2px 0"
                    }}>
                      <strong>Tech Stack:</strong> {project.techStack.join(", ")}
                    </p>
                  )}
                  {project.description && (
                    <p style={{ margin: "4px 0", textAlign: "justify" }}>
                      {project.description}
                    </p>
                  )}
                  {(project.url || project.githubUrl) && (
                    <p style={{
                      fontSize: `${resume.layout?.fontSize?.body || 10 - 1}pt`,
                      color: resume.layout?.colors?.secondary || "#555555",
                      margin: "4px 0"
                    }}>
                      {project.url && <span>URL: {project.url}</span>}
                      {project.url && project.githubUrl && " • "}
                      {project.githubUrl && <span>GitHub: {project.githubUrl}</span>}
                    </p>
                  )}
                </div>
              ))}
            </div>
          );

        case "skills":
          const skills = (section.content as { skills: any[] }).skills || [];
          // Group skills by category
          const skillsByCategory = skills.reduce((acc, skill) => {
            const category = skill.category || "other";
            if (!acc[category]) acc[category] = [];
            acc[category].push(skill.name);
            return acc;
          }, {} as Record<string, string[]>);

          return (
            <div style={contentStyles}>
              {Object.entries(skillsByCategory).map(([category, skillNames], index) => (
                <div key={category} style={{ marginBottom: index < Object.keys(skillsByCategory).length - 1 ? "8px" : "0" }}>
                  <span style={{
                    fontWeight: "bold",
                    color: resume.layout?.colors?.primary || "#2c3e50",
                    textTransform: "capitalize"
                  }}>
                    {category.replace(/([A-Z])/g, ' $1').trim()}:
                  </span>
                  <span style={{ marginLeft: "8px" }}>
                    {skillNames.join(", ")}
                  </span>
                </div>
              ))}
            </div>
          );

        case "education":
          const education = (section.content as { education: any[] }).education || [];
          return (
            <div style={contentStyles}>
              {education.map((edu, index) => (
                <div key={edu.id || index} style={{ marginBottom: index < education.length - 1 ? "12px" : "0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h3 style={{
                        fontSize: `${resume.layout?.fontSize?.body || 10 + 1}pt`,
                        fontWeight: "bold",
                        color: resume.layout?.colors?.primary || "#2c3e50",
                        margin: 0,
                        lineHeight: 1.2
                      }}>
                        {edu.degree || "Degree"}
                      </h3>
                      <p style={{
                        fontSize: `${resume.layout?.fontSize?.body || 10}pt`,
                        color: resume.layout?.colors?.secondary || "#555555",
                        margin: "2px 0"
                      }}>
                        {edu.institution || "Institution"} {edu.location && `• ${edu.location}`}
                      </p>
                      {edu.gpa && (
                        <p style={{
                          fontSize: `${resume.layout?.fontSize?.body || 10 - 1}pt`,
                          color: resume.layout?.colors?.secondary || "#555555",
                          margin: "2px 0"
                        }}>
                          GPA: {edu.gpa}
                        </p>
                      )}
                      {edu.coursework && edu.coursework.length > 0 && (
                        <p style={{
                          fontSize: `${resume.layout?.fontSize?.body || 10 - 1}pt`,
                          color: resume.layout?.colors?.secondary || "#555555",
                          margin: "2px 0"
                        }}>
                          <strong>Relevant Coursework:</strong> {edu.coursework.join(", ")}
                        </p>
                      )}
                    </div>
                    <span style={{
                      fontSize: `${resume.layout?.fontSize?.body || 10 - 1}pt`,
                      color: resume.layout?.colors?.secondary || "#555555",
                      whiteSpace: "nowrap"
                    }}>
                      {edu.startDate || "Start"} - {edu.endDate || "End"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          );

        case "certifications":
          const certifications = (section.content as { certifications: any[] }).certifications || [];
          return (
            <div style={contentStyles}>
              {certifications.map((cert, index) => (
                <div key={cert.id || index} style={{ marginBottom: index < certifications.length - 1 ? "12px" : "0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h3 style={{
                        fontSize: `${resume.layout?.fontSize?.body || 10 + 1}pt`,
                        fontWeight: "bold",
                        color: resume.layout?.colors?.primary || "#2c3e50",
                        margin: 0,
                        lineHeight: 1.2
                      }}>
                        {cert.name || "Certification Name"}
                      </h3>
                      <p style={{
                        fontSize: `${resume.layout?.fontSize?.body || 10}pt`,
                        color: resume.layout?.colors?.secondary || "#555555",
                        margin: "2px 0"
                      }}>
                        {cert.issuer || "Issuing Organization"}
                      </p>
                      {cert.credentialId && (
                        <p style={{
                          fontSize: `${resume.layout?.fontSize?.body || 10 - 1}pt`,
                          color: resume.layout?.colors?.secondary || "#555555",
                          margin: "2px 0"
                        }}>
                          Credential ID: {cert.credentialId}
                        </p>
                      )}
                      {cert.url && (
                        <p style={{
                          fontSize: `${resume.layout?.fontSize?.body || 10 - 1}pt`,
                          color: resume.layout?.colors?.secondary || "#555555",
                          margin: "2px 0"
                        }}>
                          URL: {cert.url}
                        </p>
                      )}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{
                        fontSize: `${resume.layout?.fontSize?.body || 10 - 1}pt`,
                        color: resume.layout?.colors?.secondary || "#555555",
                        whiteSpace: "nowrap"
                      }}>
                        {cert.issueDate || "Issue Date"}
                      </span>
                      {cert.expiryDate && (
                        <div style={{
                          fontSize: `${resume.layout?.fontSize?.body || 10 - 1}pt`,
                          color: resume.layout?.colors?.secondary || "#555555",
                          whiteSpace: "nowrap"
                        }}>
                          Expires: {cert.expiryDate}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );

        case "custom":
          const customContent = (section.content as { custom: { title: string; content: string } }).custom;
          return (
            <div style={contentStyles}>
              <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                {customContent?.content || "Custom content will appear here..."}
              </p>
            </div>
          );

        default:
          return (
            <div style={contentStyles}>
              <p style={{ margin: 0, fontStyle: "italic", color: resume.layout?.colors?.secondary || "#555555" }}>
                Unknown section type: {section.type}
              </p>
            </div>
          );
      }
    };

    return (
      <div
        ref={ref}
        className={`resume-preview ${className}`}
        style={containerStyles}
      >
        {/* Header Section */}
        <header style={headerStyles}>
          <h1 style={nameStyles}>
            {resume.personalInfo?.fullName || "Your Name"}
          </h1>

          {resume.personalInfo?.title && (
            <p style={titleStyles}>
              {resume.personalInfo.title}
            </p>
          )}

          <div style={contactStyles}>
            {renderContactInfo()}
          </div>
        </header>

        {/* Resume Sections */}
        {enabledSections.map((section, index) => (
          <section
            key={section.id}
            style={{
              marginBottom: index < enabledSections.length - 1 ? `${resume.layout.sectionSpacing}px` : "0",
              pageBreakInside: "avoid"
            }}
          >
            <h2 style={sectionHeaderStyles}>
              {section.title}
            </h2>
            {renderSectionContent(section)}
          </section>
        ))}

        {/* Empty state when no sections are enabled */}
        {enabledSections.length === 0 && (
          <div style={{
            textAlign: "center",
            padding: "40px 20px",
            color: resume.layout?.colors?.secondary || "#555555",
            fontStyle: "italic"
          }}>
            <p>No sections enabled. Enable sections from the sidebar to see your resume content.</p>
          </div>
        )}
      </div>
    );
  }
);

ResumePreview.displayName = "ResumePreview";

export default ResumePreview;