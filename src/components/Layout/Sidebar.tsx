import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useResume } from "../../contexts/ResumeContext";
import { SummaryEditor, ExperienceEditor, ProjectsEditor, SkillsEditor, EducationEditor, CertificationsEditor, SectionManager } from "../Editor";

const Sidebar: React.FC = () => {
  const { resume, dispatch } = useResume();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["sectionManager", "personalInfo"])
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const isSectionExpanded = (sectionId: string) => expandedSections.has(sectionId);

  return (
    <div className="h-full flex flex-col overflow-y-auto custom-scrollbar">
      {/* Section Manager - Collapsible */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection("sectionManager")}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
        >
          <h3 className="text-sm font-semibold text-gray-900 flex items-center">
            <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
            Section Manager
          </h3>
          {isSectionExpanded("sectionManager") ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {isSectionExpanded("sectionManager") && (
          <div className="px-4 pb-4 bg-gray-50/50">
            <SectionManager />
          </div>
        )}
      </div>

      {/* Section Editors */}
      <div className="flex-1">
        {/* Personal Information Editor - Collapsible */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("personalInfo")}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
          >
            <h4 className="text-sm font-semibold text-gray-900 flex items-center">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
              Personal Information
            </h4>
            {isSectionExpanded("personalInfo") ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {isSectionExpanded("personalInfo") && (
            <div className="px-4 pb-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={resume.personalInfo?.fullName || ""}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_PERSONAL_INFO",
                      payload: { fullName: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary transition-all duration-200"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  value={resume.personalInfo?.title || ""}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_PERSONAL_INFO",
                      payload: { title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary transition-all duration-200"
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={resume.personalInfo?.email || ""}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_PERSONAL_INFO",
                      payload: { email: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary transition-all duration-200"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={resume.personalInfo?.phone || ""}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_PERSONAL_INFO",
                      payload: { phone: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary transition-all duration-200"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={resume.personalInfo?.location || ""}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_PERSONAL_INFO",
                      payload: { location: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary transition-all duration-200"
                  placeholder="City, State"
                />
              </div>
            </div>
          )}
        </div>

        {/* Summary Editor - Collapsible */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("summary")}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
          >
            <h4 className="text-sm font-semibold text-gray-900 flex items-center">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
              Professional Summary
            </h4>
            {isSectionExpanded("summary") ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {isSectionExpanded("summary") && (
            <div className="px-4 pb-4">
              <SummaryEditor />
            </div>
          )}
        </div>

        {/* Experience Editor - Collapsible */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("experience")}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
          >
            <h4 className="text-sm font-semibold text-gray-900 flex items-center">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
              Work Experience
            </h4>
            {isSectionExpanded("experience") ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {isSectionExpanded("experience") && (
            <div className="px-4 pb-4">
              <ExperienceEditor />
            </div>
          )}
        </div>

        {/* Projects Editor - Collapsible */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("projects")}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
          >
            <h4 className="text-sm font-semibold text-gray-900 flex items-center">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
              Projects
            </h4>
            {isSectionExpanded("projects") ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {isSectionExpanded("projects") && (
            <div className="px-4 pb-4">
              <ProjectsEditor />
            </div>
          )}
        </div>

        {/* Skills Editor - Collapsible */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("skills")}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
          >
            <h4 className="text-sm font-semibold text-gray-900 flex items-center">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
              Technical Skills
            </h4>
            {isSectionExpanded("skills") ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {isSectionExpanded("skills") && (
            <div className="px-4 pb-4">
              <SkillsEditor />
            </div>
          )}
        </div>

        {/* Education Editor - Collapsible */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("education")}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
          >
            <h4 className="text-sm font-semibold text-gray-900 flex items-center">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
              Education
            </h4>
            {isSectionExpanded("education") ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {isSectionExpanded("education") && (
            <div className="px-4 pb-4">
              <EducationEditor />
            </div>
          )}
        </div>

        {/* Certifications Editor - Collapsible */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("certifications")}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
          >
            <h4 className="text-sm font-semibold text-gray-900 flex items-center">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
              Certifications
            </h4>
            {isSectionExpanded("certifications") ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {isSectionExpanded("certifications") && (
            <div className="px-4 pb-4">
              <CertificationsEditor />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
