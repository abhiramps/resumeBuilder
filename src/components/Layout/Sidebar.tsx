import React from "react";
import { useResume } from "../../contexts/ResumeContext";
import { SummaryEditor, ExperienceEditor, ProjectsEditor, SkillsEditor, EducationEditor, CertificationsEditor, SectionManager } from "../Editor";

const Sidebar: React.FC = () => {
  const { resume, dispatch } = useResume();

  return (
    <div className="h-full flex flex-col">
      {/* Section Manager */}
      <div className="p-6 border-b border-gray-200 bg-gray-50/50 max-h-[40%] overflow-y-auto">
        <SectionManager />
      </div>

      {/* Section Editors */}
      <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
        <div className="p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
            Edit Sections
          </h3>

          {/* Personal Information Editor */}
          <div className="mb-8 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
              Personal Information
            </h4>
            <div className="space-y-4">
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
          </div>

          {/* Summary Editor */}
          <div className="mb-8">
            <SummaryEditor />
          </div>

          {/* Experience Editor */}
          <div className="mb-8">
            <ExperienceEditor />
          </div>

          {/* Projects Editor */}
          <div className="mb-8">
            <ProjectsEditor />
          </div>

          {/* Skills Editor */}
          <div className="mb-8">
            <SkillsEditor />
          </div>

          {/* Education Editor */}
          <div className="mb-8">
            <EducationEditor />
          </div>

          {/* Certifications Editor */}
          <div className="mb-8">
            <CertificationsEditor />
          </div>

          {/* TODO: Add other section editors */}
          <div className="text-center py-8 text-gray-500 text-sm">
            More section editors coming soon...
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
